import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('terminals')
export class TerminalsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async findAll(@Query('distinctSystems') distinctSystems?: string, @Query('type') type?: string) {
    if (distinctSystems === 'true') {
      const rows = await this.prisma.terminal.findMany({
        where: { starSystemName: { not: null } },
        distinct: ['starSystemName'],
        select: { starSystemName: true },
        orderBy: { starSystemName: 'asc' },
      });
      return rows.map(r => r.starSystemName);
    }
    const where: any = {};
    if (type) where.type = type;
    return this.prisma.terminal.findMany({
      where,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, type: true, hasCargoCenter: true, hasDockingPort: true, hasFreightElevator: true, isAutoLoad: true },
    });
  }
}
