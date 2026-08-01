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
var ReportsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const zod_1 = require("zod");
const auth_guard_1 = require("../common/guards/auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
const auth_1 = require("../lib/auth");
const NewsItemSchema = zod_1.z.object({
    date: zod_1.z.string().max(20).optional().default(''),
    title: zod_1.z.string().max(200).optional().default(''),
    body: zod_1.z.string().max(10000).optional().default(''),
    image: zod_1.z.string().max(500).optional().default(''),
    imagePosition: zod_1.z.enum(['left', 'right']).optional().default('left'),
    imageScale: zod_1.z.number().min(10).max(100).optional().default(45),
    style: zod_1.z.enum(['default', 'left-half', 'right-half', 'flash']).optional().default('default'),
});
const ReportsSchema = zod_1.z.object({
    news: zod_1.z.array(NewsItemSchema).max(100),
    routes: zod_1.z.array(zod_1.z.object({
        ship: zod_1.z.string().max(100).optional().default(''),
        commodity: zod_1.z.string().max(100).optional().default(''),
        origin: zod_1.z.string().max(100).optional().default(''),
        dest: zod_1.z.string().max(100).optional().default(''),
        profit: zod_1.z.string().max(50).optional().default(''),
        note: zod_1.z.string().max(200).optional().default(''),
    })).max(100),
});
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
let ReportsController = ReportsController_1 = class ReportsController {
    logger = new common_1.Logger(ReportsController_1.name);
    get() {
        try {
            return readData();
        }
        catch {
            return { news: [], routes: [] };
        }
    }
    save(body, res) {
        try {
            const data = ReportsSchema.parse(body);
            ensureDir(DATA_FILE);
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
            return res.status(200).json({ ok: true });
        }
        catch (err) {
            this.logger.error('Failed to save reports', err);
            return res.status(400).json({ error: 'Failed to save reports' });
        }
    }
    auth(body) {
        const pwd = process.env.ADMIN_PASSWORD;
        if (!pwd)
            throw new Error('ADMIN_PASSWORD is required');
        if (body.password === pwd) {
            return { ok: true, token: (0, auth_1.signToken)() };
        }
        return { ok: false };
    }
    async uploadImage(req, res) {
        try {
            await require('fs/promises').mkdir(UPLOAD_DIR, { recursive: true });
            const contentType = req.headers['content-type'] || '';
            if (!contentType.includes('multipart/form-data')) {
                return res.status(400).json({ error: 'Expected multipart/form-data' });
            }
            const busboy = require('busboy');
            const bb = busboy({ headers: req.headers, limits: { fileSize: 5 * 1024 * 1024 } });
            const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
            let sent = false;
            const send = (status, body) => {
                if (!sent) {
                    sent = true;
                    res.status(status).json(body);
                }
            };
            let fileReceived = false;
            bb.on('file', (_fieldname, file, info) => {
                if (!allowedTypes.includes(info.mimeType)) {
                    file.resume();
                    send(400, { error: 'Invalid file type' });
                    return;
                }
                fileReceived = true;
                const mimeToExt = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };
                const ext = mimeToExt[info.mimeType] || 'png';
                const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
                const ws = fs.createWriteStream(path.join(UPLOAD_DIR, filename));
                file.pipe(ws);
                ws.on('finish', () => send(200, { ok: true, url: `/uploads/${filename}` }));
                ws.on('error', () => send(500, { error: 'Failed to upload image' }));
            });
            bb.on('error', () => send(500, { error: 'Failed to upload image' }));
            bb.on('close', () => { if (!fileReceived && !sent)
                send(400, { error: 'No file uploaded' }); });
            req.pipe(bb);
        }
        catch (err) {
            this.logger.error('Upload error', err);
            if (!res.headersSent)
                res.status(500).json({ error: 'Failed to upload image' });
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
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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
exports.ReportsController = ReportsController = ReportsController_1 = __decorate([
    (0, common_1.Controller)('reports')
], ReportsController);
//# sourceMappingURL=reports.controller.js.map