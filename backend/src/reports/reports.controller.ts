import { Controller, Get, Post, Req, Body, Res, Param, UseGuards, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { z } from 'zod';
import { AuthGuard } from '../common/guards/auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { signToken } from '../lib/auth';

const NewsItemSchema = z.object({
  date: z.string().max(20).optional().default(''),
  title: z.string().max(200).optional().default(''),
  body: z.string().max(10000).optional().default(''),
  image: z.string().max(500).optional().default(''),
  imagePosition: z.enum(['left', 'right']).optional().default('left'),
  imageScale: z.number().min(10).max(100).optional().default(45),
  style: z.enum(['default', 'left-half', 'right-half', 'flash']).optional().default('default'),
});

const ReportsSchema = z.object({
  date: z.string().max(20).optional().default(''),
  news: z.array(NewsItemSchema).max(100),
  routes: z.array(z.object({
    ship: z.string().max(100).optional().default(''),
    commodity: z.string().max(100).optional().default(''),
    origin: z.string().max(100).optional().default(''),
    dest: z.string().max(100).optional().default(''),
    profit: z.string().max(50).optional().default(''),
    note: z.string().max(200).optional().default(''),
  })).max(100),
  tips: z.array(z.string().max(500)).max(50).optional().default([]),
});

const DATA_FILE = process.env.REPORTS_DATA_FILE || path.join(process.cwd(), '..', 'data', 'reports.json');
const UPLOAD_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), '..', 'public', 'uploads');

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const DEFAULT_TIPS = [
  '大宗商品价格相对稳定，适合新手入门；小宗商品利润率高但风险也更大。',
  '进货前务必查看目的地的库存量，避免空仓白跑一趟。',
  '利润率高的商品往往流通速度慢，囤货需谨慎。',
  '建议同时关注利润率变化趋势（▲/▼），持续上升说明路线正变得热门。',
  '部分终端只支持特定尺寸货柜，选船前请确认终端的装卸能力。',
  '非法商品利润极高，但被查获会血本无归，风险自负。',
  '同一条路线往返利润率可能不同，善用"往返"模式对比。',
  '建议每次跑商前刷新数据，UEX 每 30 分钟更新一次价格。',
  'Hull 系列货船只能在有外部货柜设施的终端装卸货。',
  '泛天指数上涨表示整体市场活跃，下跌则需谨慎操作。',
  '终端设有医疗/精炼/加油/维修等设施，可在商品详情页查看。',
  '长期不交易的路线利润率可能失真，建议优先选择近期有成交的路线。',
];

function readData() {
  ensureDir(DATA_FILE);
  if (!fs.existsSync(DATA_FILE)) return { news: [], routes: [], tips: DEFAULT_TIPS };
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  if (!data.tips || data.tips.length === 0) data.tips = DEFAULT_TIPS;
  return data;
}

const MAGIC_SIGS: Record<string, string[]> = {
  'image/png':  ['89504e47'],
  'image/jpeg': ['ffd8ff'],
  'image/webp': ['52494646'],
  'image/gif':  ['47494638'],
};
function verifyMagicBytes(hex: string, mimeType: string): boolean {
  const sigs = MAGIC_SIGS[mimeType];
  if (!sigs) return false;
  return sigs.some(s => hex.startsWith(s));
}

@Controller('reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  @Get()
  @Public()
  get() {
    try { return readData(); } catch { return { news: [], routes: [], tips: DEFAULT_TIPS }; }
  }

  @Post()
  save(@Body() body: any, @Res() res: Response) {
    try {
      const data = ReportsSchema.parse(body);
      ensureDir(DATA_FILE);
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return res.status(200).json({ ok: true });
    } catch (err: any) {
      this.logger.error('Failed to save reports', err);
      return res.status(400).json({ error: 'Failed to save reports' });
    }
  }

  @Post('auth')
  @Public()
  auth(@Body() body: { password: string }, @Res() res: Response) {
    const pwd = process.env.ADMIN_PASSWORD;
    if (!pwd) { res.status(500).json({ error: 'Server misconfigured' }); return; }
    if (!body.password) { res.status(400).json({ error: 'Password required' }); return; }
    const bufA = Buffer.from(body.password);
    const bufB = Buffer.from(pwd);
    if (bufA.length !== bufB.length) { res.status(401).json({ ok: false }); return; }
    if (crypto.timingSafeEqual(bufA, bufB)) {
      const token = signToken();
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 30 * 60 * 1000, // 30 min
      });
      return res.status(200).json({ ok: true, token });
    }
    return res.status(401).json({ ok: false });
  }

  @Get('file/:filename')
  @Public()
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    // Sanitize filename: only allow alphanumeric, dash, dot, underscore
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    const filePath = path.join(UPLOAD_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.webp': 'image/webp', '.gif': 'image/gif',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    fs.createReadStream(filePath).pipe(res);
  }

  @Post('upload-image')
  @UseGuards(AuthGuard)
  async uploadImage(@Req() req: Request, @Res() res: Response) {
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
      const send = (status: number, body: any) => {
        if (!sent) { sent = true; res.status(status).json(body); }
      };

      let fileReceived = false;

      bb.on('file', (_fieldname: string, file: NodeJS.ReadableStream, info: { filename: string; mimeType: string }) => {
        if (!allowedTypes.includes(info.mimeType)) {
          file.resume();
          send(400, { error: 'Invalid file type' });
          return;
        }
        fileReceived = true;
        const mimeToExt: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };
        const ext = mimeToExt[info.mimeType] || 'png';
        const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
        const filePath = path.join(UPLOAD_DIR, filename);

        // Verify file magic bytes to prevent MIME spoofing
        const chunks: Buffer[] = [];
        let magicChecked = false;
        const ws = fs.createWriteStream(filePath);
        file.on('data', (chunk: Buffer) => {
          if (!magicChecked) {
            chunks.push(chunk);
            const totalLen = chunks.reduce((s, c) => s + c.length, 0);
            if (totalLen >= 8) {
              const magicBuf = Buffer.concat(chunks).subarray(0, 8);
              const sig = magicBuf.toString('hex');
              if (!verifyMagicBytes(sig, info.mimeType)) {
                file.unpipe();
                ws.destroy();
                try { fs.unlinkSync(filePath); } catch {}
                send(400, { error: 'File content does not match type' });
                return;
              }
              magicChecked = true;
              // Write buffered data then pipe the rest
              for (const c of chunks) ws.write(c);
              file.pipe(ws);
            }
          }
        });
        if (!magicChecked) {
          file.once('end', () => {
            // Small file: all data already buffered, write it
            for (const c of chunks) ws.write(c);
            ws.end();
          });
        }
        ws.on('finish', () => send(200, { ok: true, url: `/api/reports/file/${filename}` }));
        ws.on('error', () => send(500, { error: 'Failed to upload image' }));
      });

      bb.on('error', () => send(500, { error: 'Failed to upload image' }));
      bb.on('close', () => { if (!fileReceived && !sent) send(400, { error: 'No file uploaded' }); });

      req.pipe(bb);
    } catch (err: any) {
      this.logger.error('Upload error', err);
      if (!res.headersSent) res.status(500).json({ error: 'Failed to upload image' });
    }
  }
}
