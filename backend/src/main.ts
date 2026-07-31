import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cron from 'node-cron';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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

  // Start periodic sync
  const intervalMin = parseInt(process.env.FETCH_INTERVAL_MINUTES || '30', 10);
  const { SyncService } = await import('./sync/sync.service');
  const syncService = app.get(SyncService);
  cron.schedule(`*/${intervalMin} * * * *`, () => {
    syncService.fullSync().catch(err => console.error('Cron sync failed:', err));
  });
  console.log(`Cron: data sync every ${intervalMin} minutes`);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`NestJS backend running on http://localhost:${port}`);
}
bootstrap();
