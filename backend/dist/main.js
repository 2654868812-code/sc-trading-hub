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
    app.enableCors({
        origin: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const intervalMin = parseInt(process.env.FETCH_INTERVAL_MINUTES || '30', 10);
    const { SyncService } = await Promise.resolve().then(() => require('./sync/sync.service'));
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
//# sourceMappingURL=main.js.map