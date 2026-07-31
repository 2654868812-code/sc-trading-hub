import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    if (!auth) throw new UnauthorizedException('Unauthorized');

    // Check both secrets — admin password OR cron secret
    const adminPwd = process.env.ADMIN_PASSWORD;
    const cronSecret = process.env.CRON_SECRET;
    if (adminPwd && auth === `Bearer ${adminPwd}`) return true;
    if (cronSecret && auth === `Bearer ${cronSecret}`) return true;

    throw new UnauthorizedException('Unauthorized');
  }
}
