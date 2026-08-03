import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CronAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    const secret = process.env.CRON_SECRET;
    if (!secret) throw new UnauthorizedException('CRON_SECRET not configured');

    if (!auth || auth !== `Bearer ${secret}`) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
