import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    start: '2026-02-18',
    end: '2026-04-02',
    totalDays: 43
  });
}
