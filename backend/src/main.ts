import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cron from 'node-cron';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // CORS — restrict to configured origin in production
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.setGlobalPrefix('api');

  const { SyncService } = await import('./sync/sync.service');
  const syncService = app.get(SyncService);

  // ── Scheduler ─────────────────────────────────────────────

  // Safety timeout: ensure mutex always released after 20min max
  function withMutexGuard(flag: { busy: boolean }, label: string, fn: () => Promise<void>, maxMs = 1_200_000) {
    return async () => {
      if (flag.busy) { console.log(`${label} busy, skip`); return; }
      flag.busy = true;
      const timer = setTimeout(() => {
        if (flag.busy) { console.error(`${label} TIMEOUT after ${maxMs}ms — force releasing mutex`); flag.busy = false; }
      }, maxMs);
      try { await fn(); }
      catch (err) { console.error(`${label} failed:`, err); }
      finally { clearTimeout(timer); flag.busy = false; }
    };
  }

  // Fast sync (30min): prices, routes, terminalMax, averages → computations
  // UEX TTL: +30 min for prices/routes/averages
  const fastMin = clamp(process.env.FETCH_INTERVAL_MINUTES, 1, 59, 30);
  const fastFlag = { busy: false };
  const runFast = withMutexGuard(fastFlag, 'Fast sync', async () => {
    await syncService.syncPricesData();
    await syncService.syncComputations();
  });
  cron.schedule(`*/${fastMin} * * * *`, () => runFast());
  console.log(`Cron: fast sync every ${fastMin}min`);

  // Mid sync (1h): commodities
  // UEX TTL: +1 hour
  const midMin = clamp(process.env.FETCH_COMMODITIES_INTERVAL_MINUTES, 10, 360, 60);
  const midFlag = { busy: false };
  const runMid = withMutexGuard(midFlag, 'Commodity sync', () => syncService.syncCommoditiesOnly());
  cron.schedule(midMin < 60 ? `*/${midMin} * * * *` : `7 */${Math.floor(midMin / 60)} * * *`, () => runMid());
  console.log(`Cron: commodity sync every ${midMin}min`);

  // Slow sync (24h): space stations, terminals, vehicles
  // UEX TTL: +1 day
  const slowHours = clamp(process.env.FETCH_META_INTERVAL_HOURS, 1, 168, 24);
  const slowFlag = { busy: false };
  const runSlow = withMutexGuard(slowFlag, 'Slow sync', () => syncService.syncMetadata());
  const cronExpr = slowHours === 24 ? '7 0 * * *' : `7 */${slowHours} * * *`;
  cron.schedule(cronExpr, () => runSlow());
  console.log(`Cron: slow sync every ${slowHours}h — ${cronExpr}`);

  // Heartbeat: confirm scheduler is alive
  cron.schedule('*/5 * * * *', () => {
    const m = Math.floor(Date.now() / 60000);
    console.log(`[heartbeat] ${new Date().toISOString()} | fast=${fastFlag.busy} mid=${midFlag.busy} slow=${slowFlag.busy}`);
  });

  // ── Startup sync ──────────────────────────────────────────

  console.log('Running initial sync...');
  runSlow().then(() => runMid()).then(() => runFast());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`NestJS backend running on http://localhost:${port}`);
}

function clamp(raw: string | number | undefined, min: number, max: number, def: number): number {
  const n = parseInt(String(raw), 10);
  return (n >= min && n <= max) ? n : def;
}

bootstrap();
