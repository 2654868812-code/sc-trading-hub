"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronAuthGuard = void 0;
const common_1 = require("@nestjs/common");
let CronAuthGuard = class CronAuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const auth = request.headers['authorization'];
        const secret = process.env.CRON_SECRET;
        if (!secret)
            throw new Error('CRON_SECRET environment variable is required');
        if (!auth || auth !== `Bearer ${secret}`) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        return true;
    }
};
exports.CronAuthGuard = CronAuthGuard;
exports.CronAuthGuard = CronAuthGuard = __decorate([
    (0, common_1.Injectable)()
], CronAuthGuard);
//# sourceMappingURL=cron-auth.guard.js.map