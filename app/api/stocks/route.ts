import { NextRequest, NextResponse } from 'next/server';
import { fetchStockData } from '@/lib/finance';
import { ALL_TICKERS } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tickersParam = searchParams.get('tickers');
  const tickers = tickersParam ? tickersParam.split(',') : ALL_TICKERS;

  const results = await Promise.allSettled(tickers.map(t => fetchStockData(t)));

  const data = results
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof fetchStockData>>> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(Boolean);

  return NextResponse.json({ data, fetchedAt: new Date().toISOString() });
}
