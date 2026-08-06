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

  // Fast sync: prices, routes, averages, computations (default 30min)
  const fastIntervalMin = clampInterval(process.env.FETCH_INTERVAL_MINUTES, 1, 59, 30);

  let fastSyncing = false;
  const runFast = async () => {
    if (fastSyncing) { console.log('Fast sync already running, skipping'); return; }
    fastSyncing = true;
    try {
      await syncService.syncPricesData();
      await syncService.syncComputations();
    } catch (err) { console.error('Fast sync failed:', err); }
    finally { fastSyncing = false; }
  };

  cron.schedule(`*/${fastIntervalMin} * * * *`, () => runFast());
  console.log(`Cron: fast sync every ${fastIntervalMin} minutes`);

  // Slow sync: metadata — terminals, commodities, vehicles, space stations (default 24h)
  const slowIntervalHours = clampInterval(process.env.FETCH_META_INTERVAL_HOURS, 1, 168, 24);

  let slowSyncing = false;
  const runSlow = async () => {
    if (slowSyncing) { console.log('Slow sync already running, skipping'); return; }
    slowSyncing = true;
    try { await syncService.syncMetadata(); }
    catch (err) { console.error('Slow sync failed:', err); }
    finally { slowSyncing = false; }
  };

  // Cron: run at startup then every N hours at minute 7 (off-peak minute)
  const cronHourExpr = slowIntervalHours === 24 ? '7 0 * * *' : `7 */${slowIntervalHours} * * *`;
  cron.schedule(cronHourExpr, () => runSlow());
  console.log(`Cron: slow sync every ${slowIntervalHours}h (${cronHourExpr})`);

  // ── Startup sync ──────────────────────────────────────────

  console.log('Running initial data sync...');
  // Metadata first (needed by prices), then prices + computations
  runSlow().then(() => runFast());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`NestJS backend running on http://localhost:${port}`);
}

function clampInterval(raw: string | number | undefined, min: number, max: number, def: number): number {
  const n = parseInt(String(raw), 10);
  return (n >= min && n <= max) ? n : def;
}

bootstrap();
