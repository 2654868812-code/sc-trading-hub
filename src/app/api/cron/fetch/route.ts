import { NextRequest, NextResponse } from 'next/server';
import { fullSync } from '@/lib/sync';

const CRON_SECRET = process.env.CRON_SECRET;
if (!CRON_SECRET) throw new Error('CRON_SECRET environment variable is required');

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fullSync();
    return NextResponse.json({ status: 'ok', message: 'Sync completed' });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: String(err) },
      { status: 500 }
    );
  }
}
