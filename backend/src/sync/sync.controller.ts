import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { CronAuthGuard } from '../common/guards/cron-auth.guard';
import { SyncService } from './sync.service';

@Controller('cron')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('fetch')
  @HttpCode(200)
  @UseGuards(CronAuthGuard)
  async fetch() {
    await this.syncService.fullSync();
    return { status: 'ok', message: 'Sync completed' };
  }
}
