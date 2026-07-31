"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const promises_1 = require("fs/promises");
const auth_guard_1 = require("../common/guards/auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
const DATA_FILE = process.env.REPORTS_DATA_FILE || path.join(process.cwd(), '..', 'data', 'reports.json');
const UPLOAD_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), '..', 'public', 'uploads');
function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
}
function readData() {
    ensureDir(DATA_FILE);
    if (!fs.existsSync(DATA_FILE))
        return { news: [], routes: [] };
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
let ReportsController = class ReportsController {
    get() {
        try {
            return readData();
        }
        catch {
            return { news: [], routes: [] };
        }
    }
    save(body) {
        ensureDir(DATA_FILE);
        fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), 'utf-8');
        return { ok: true };
    }
    auth(body) {
        const pwd = process.env.ADMIN_PASSWORD;
        if (!pwd)
            throw new Error('ADMIN_PASSWORD is required');
        if (body.password === pwd) {
            return { ok: true };
        }
        return { ok: false };
    }
    async uploadImage(req, res) {
        try {
            const multer = require('multer');
            const upload = multer({ dest: UPLOAD_DIR, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_, file, cb) => { const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']; cb(null, allowed.includes(file.mimetype)); } });
            await (0, promises_1.mkdir)(UPLOAD_DIR, { recursive: true });
            res.json({ error: 'Use Next.js /api/reports/upload-image for now' });
        }
        catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "save", null);
__decorate([
    (0, common_1.Post)('auth'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "auth", null);
__decorate([
    (0, common_1.Post)('upload-image'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "uploadImage", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports')
], ReportsController);
//# sourceMappingURL=reports.controller.js.map