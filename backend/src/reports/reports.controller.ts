import { Controller, Get, Post, Req, Body, Res, UseGuards, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
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
  news: z.array(NewsItemSchema).max(100),
  routes: z.array(z.object({
    ship: z.string().max(100).optional().default(''),
    commodity: z.string().max(100).optional().default(''),
    origin: z.string().max(100).optional().default(''),
    dest: z.string().max(100).optional().default(''),
    profit: z.string().max(50).optional().default(''),
    note: z.string().max(200).optional().default(''),
  })).max(100),
});

const DATA_FILE = process.env.REPORTS_DATA_FILE || path.join(process.cwd(), '..', 'data', 'reports.json');
const UPLOAD_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), '..', 'public', 'uploads');

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readData() {
  ensureDir(DATA_FILE);
  if (!fs.existsSync(DATA_FILE)) return { news: [], routes: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

@Controller('reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  @Get()
  @Public()
  get() {
    try { return readData(); } catch { return { news: [], routes: [] }; }
  }

  @Post()
  @UseGuards(AuthGuard)
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
  auth(@Body() body: { password: string }) {
    const pwd = process.env.ADMIN_PASSWORD;
    if (!pwd) throw new Error('ADMIN_PASSWORD is required');
    if (body.password === pwd) {
      return { ok: true, token: signToken() };
    }
    return { ok: false };
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
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        const ws = fs.createWriteStream(path.join(UPLOAD_DIR, filename));
        file.pipe(ws);
        ws.on('finish', () => send(200, { ok: true, url: `/uploads/${filename}` }));
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
