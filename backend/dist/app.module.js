"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_guard_1 = require("./common/guards/auth.guard");
const commodities_module_1 = require("./commodities/commodities.module");
const routes_module_1 = require("./routes/routes.module");
const terminals_module_1 = require("./terminals/terminals.module");
const locations_module_1 = require("./locations/locations.module");
const sync_module_1 = require("./sync/sync.module");
const reports_module_1 = require("./reports/reports.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 500 }]),
            prisma_module_1.PrismaModule,
            commodities_module_1.CommoditiesModule,
            routes_module_1.RoutesModule,
            terminals_module_1.TerminalsModule,
            locations_module_1.LocationsModule,
            sync_module_1.SyncModule,
            reports_module_1.ReportsModule,
            vehicles_module_1.VehiclesModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: auth_guard_1.AuthGuard },
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map