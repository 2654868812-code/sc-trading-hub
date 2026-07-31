import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async findAll() {
    const { getShipZh } = require('../lib/ship-zh');
    const ships = await this.prisma.vehicle.findMany({ orderBy: { name: 'asc' } });
    return ships.map(v => ({
      id: v.id,
      name: getShipZh(v.name),
      nameEn: v.name,
      scu: v.scu,
      companyName: v.companyName,
      spaceOnly: false,
    }));
  }
}
