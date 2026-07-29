import { NextResponse } from 'next/server';
import { fullSync } from '@/lib/sync';

export async function GET() {
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
