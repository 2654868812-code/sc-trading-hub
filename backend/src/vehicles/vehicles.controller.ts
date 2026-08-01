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
    const SPACE_ONLY_IDS = new Set([102, 104, 105, 106, 286]);
    const ships = await this.prisma.vehicle.findMany({ orderBy: { scu: 'desc' } });
    return ships.map(v => ({
      id: v.id,
      name: getShipZh(v.name),
      nameEn: v.name,
      scu: v.scu,
      companyName: v.companyName,
      padType: v.padType || '',
      isCargo: v.isCargo,
      spaceOnly: SPACE_ONLY_IDS.has(v.id),
    }));
  }
}
