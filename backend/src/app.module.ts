import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthGuard } from './common/guards/auth.guard';
import { CommoditiesModule } from './commodities/commodities.module';
import { RoutesModule } from './routes/routes.module';
import { TerminalsModule } from './terminals/terminals.module';
import { LocationsModule } from './locations/locations.module';
import { SyncModule } from './sync/sync.module';
import { ReportsModule } from './reports/reports.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    CommoditiesModule,
    RoutesModule,
    TerminalsModule,
    LocationsModule,
    SyncModule,
    ReportsModule,
    VehiclesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
