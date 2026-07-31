import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { CronAuthGuard } from '../common/guards/cron-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { SyncService } from './sync.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('cron/fetch')
  @HttpCode(200)
  @UseGuards(CronAuthGuard)
  async fetch() {
    await this.syncService.fullSync();
    return { status: 'ok', message: 'Sync completed' };
  }

  @Get('data-freshness')
  @Public()
  async freshness() {
    const latest = await this.prisma.priceSnapshot.findFirst({
      orderBy: { fetchedAt: 'desc' },
      select: { fetchedAt: true },
    });
    return { latestFetchedAt: latest?.fetchedAt?.toISOString() ?? null };
  }
}
