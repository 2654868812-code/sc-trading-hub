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

  // Start periodic sync (run immediately on startup, then on schedule)
  const intervalMinRaw = parseInt(process.env.FETCH_INTERVAL_MINUTES || '30', 10);
  const intervalMin = (intervalMinRaw >= 1 && intervalMinRaw <= 59) ? intervalMinRaw : 30;
  const { SyncService } = await import('./sync/sync.service');
  const syncService = app.get(SyncService);

  let syncing = false;
  const runSync = async () => {
    if (syncing) { console.log('Sync already running, skipping'); return; }
    syncing = true;
    try { await syncService.fullSync(); }
    catch (err) { console.error('Sync failed:', err); }
    finally { syncing = false; }
  };

  console.log('Running initial data sync...');
  runSync();

  cron.schedule(`*/${intervalMin} * * * *`, () => runSync());
  console.log(`Cron: data sync every ${intervalMin} minutes`);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`NestJS backend running on http://localhost:${port}`);
}
bootstrap();
