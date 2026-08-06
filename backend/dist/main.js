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
    const { SyncService } = await Promise.resolve().then(() => require('./sync/sync.service'));
    const syncService = app.get(SyncService);
    const fastMin = clamp(process.env.FETCH_INTERVAL_MINUTES, 1, 59, 30);
    let fastBusy = false;
    const runFast = async () => {
        if (fastBusy) {
            console.log('Fast sync busy, skip');
            return;
        }
        fastBusy = true;
        try {
            await syncService.syncPricesData();
            await syncService.syncComputations();
        }
        catch (err) {
            console.error('Fast sync failed:', err);
        }
        finally {
            fastBusy = false;
        }
    };
    cron.schedule(`*/${fastMin} * * * *`, () => runFast());
    console.log(`Cron: fast sync every ${fastMin}min (30min UEX TTL)`);
    const midMin = clamp(process.env.FETCH_COMMODITIES_INTERVAL_MINUTES, 10, 360, 60);
    let midBusy = false;
    const runMid = async () => {
        if (midBusy) {
            console.log('Commodity sync busy, skip');
            return;
        }
        midBusy = true;
        try {
            await syncService.syncCommoditiesOnly();
        }
        catch (err) {
            console.error('Commodity sync failed:', err);
        }
        finally {
            midBusy = false;
        }
    };
    cron.schedule(midMin < 60 ? `*/${midMin} * * * *` : `7 */${Math.floor(midMin / 60)} * * *`, () => runMid());
    console.log(`Cron: commodity sync every ${midMin}min (1h UEX TTL)`);
    const slowHours = clamp(process.env.FETCH_META_INTERVAL_HOURS, 1, 168, 24);
    let slowBusy = false;
    const runSlow = async () => {
        if (slowBusy) {
            console.log('Slow sync busy, skip');
            return;
        }
        slowBusy = true;
        try {
            await syncService.syncMetadata();
        }
        catch (err) {
            console.error('Slow sync failed:', err);
        }
        finally {
            slowBusy = false;
        }
    };
    const cronExpr = slowHours === 24 ? '7 0 * * *' : `7 */${slowHours} * * *`;
    cron.schedule(cronExpr, () => runSlow());
    console.log(`Cron: slow sync every ${slowHours}h (1d UEX TTL) — ${cronExpr}`);
    console.log('Running initial sync...');
    runSlow().then(() => runMid()).then(() => runFast());
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`NestJS backend running on http://localhost:${port}`);
}
function clamp(raw, min, max, def) {
    const n = parseInt(String(raw), 10);
    return (n >= min && n <= max) ? n : def;
}
bootstrap();
//# sourceMappingURL=main.js.map