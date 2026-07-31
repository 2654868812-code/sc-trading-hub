import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const NewsItemSchema = z.object({
  date: z.string().max(20).optional().default(''),
  title: z.string().max(200).optional().default(''),
  body: z.string().max(10000).optional().default(''),
  image: z.string().max(500).optional().default(''),
  imagePosition: z.enum(['left', 'right']).optional().default('left'),
  imageScale: z.number().min(10).max(100).optional().default(45),
});

const RouteItemSchema = z.object({
  ship: z.string().max(100).optional().default(''),
  commodity: z.string().max(100).optional().default(''),
  origin: z.string().max(100).optional().default(''),
  dest: z.string().max(100).optional().default(''),
  profit: z.string().max(50).optional().default(''),
  note: z.string().max(200).optional().default(''),
});

const ReportsSchema = z.object({
  news: z.array(NewsItemSchema).max(100),
  routes: z.array(RouteItemSchema).max(100),
});

// In Docker, reports.json lives on the /data volume (same as SQLite) for persistence.
// In local dev, it's under <cwd>/data/.
const DATA_FILE = process.env.REPORTS_DATA_FILE
  || path.join(process.cwd(), 'data', 'reports.json');

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readData() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return { news: [], routes: [] };
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ news: [], routes: [] });
  }
}

export async function POST(request: NextRequest) {
  // Auth check — password required for writes
  const auth = request.headers.get('authorization');
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) throw new Error('ADMIN_PASSWORD environment variable is required');
  if (auth !== `Bearer ${pwd}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const raw = await request.json();
    const body = ReportsSchema.parse(raw); // Strips unknown keys (__proto__, etc.)
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
