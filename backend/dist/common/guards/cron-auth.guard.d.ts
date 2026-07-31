import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CronAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
