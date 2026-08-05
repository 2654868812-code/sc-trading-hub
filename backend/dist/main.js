"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const cron = require("node-cron");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    app.enableCors({
        origin: corsOrigin,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const intervalMinRaw = parseInt(process.env.FETCH_INTERVAL_MINUTES || '30', 10);
    const intervalMin = (intervalMinRaw >= 1 && intervalMinRaw <= 59) ? intervalMinRaw : 30;
    const { SyncService } = await Promise.resolve().then(() => require('./sync/sync.service'));
    const syncService = app.get(SyncService);
    let syncing = false;
    const runSync = async () => {
        if (syncing) {
            console.log('Sync already running, skipping');
            return;
        }
        syncing = true;
        try {
            await syncService.fullSync();
        }
        catch (err) {
            console.error('Sync failed:', err);
        }
        finally {
            syncing = false;
        }
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
//# sourceMappingURL=main.js.map