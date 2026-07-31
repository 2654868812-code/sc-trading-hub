import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
  try {
    const body = await request.json();
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
