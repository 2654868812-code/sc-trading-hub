import { Module } from '@nestjs/common';
import { CommoditiesController } from './commodities.controller';
import { PricesController } from './prices.controller';

@Module({ controllers: [CommoditiesController, PricesController] })
export class CommoditiesModule {}
