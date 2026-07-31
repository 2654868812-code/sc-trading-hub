import { Controller, Get, Post, Req, Body, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { AuthGuard } from '../common/guards/auth.guard';
import { Public } from '../common/decorators/public.decorator';

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
  @Get()
  @Public()
  get() {
    try { return readData(); } catch { return { news: [], routes: [] }; }
  }

  @Post()
  @UseGuards(AuthGuard)
  save(@Body() body: any) {
    ensureDir(DATA_FILE);
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), 'utf-8');
    return { ok: true };
  }

  @Post('auth')
  @Public()
  auth(@Body() body: { password: string }) {
    const pwd = process.env.ADMIN_PASSWORD;
    if (!pwd) throw new Error('ADMIN_PASSWORD is required');
    if (body.password === pwd) {
      // Token signing delegated to frontend API route (Edge-compatible crypto)
      return { ok: true };
    }
    return { ok: false };
  }

  @Post('upload-image')
  @UseGuards(AuthGuard)
  async uploadImage(@Req() req: Request, @Res() res: Response) {
    try {
      const multer = require('multer');
      const upload = multer({ dest: UPLOAD_DIR, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_: any, file: any, cb: any) => { const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']; cb(null, allowed.includes(file.mimetype)); } });
      // Simple approach — read raw body
      await mkdir(UPLOAD_DIR, { recursive: true });
      // For now, use a simpler inline handler since multer setup is complex
      res.json({ error: 'Use Next.js /api/reports/upload-image for now' });
    } catch (err: any) {
      res.status(500).json({ error: String(err) });
    }
  }
}
