import { NextRequest, NextResponse } from 'next/server';
import { fullSync } from '@/lib/sync';

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error('CRON_SECRET environment variable is required');

  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fullSync();
    return NextResponse.json({ status: 'ok', message: 'Sync completed' });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Sync failed — check server logs' },
      { status: 500 }
    );
  }
}
