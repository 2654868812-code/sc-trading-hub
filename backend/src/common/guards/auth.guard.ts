import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '../../lib/auth';

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
    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Unauthorized');

    const token = auth.slice(7);

    // CRON_SECRET for cron endpoints
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && token === cronSecret) return true;

    // Signed HMAC token for admin operations
    if (verifyToken(token)) return true;

    throw new UnauthorizedException('Unauthorized');
  }
}
