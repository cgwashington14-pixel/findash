import { NextRequest, NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/news';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tickersParam = searchParams.get('tickers');
  const tickers = tickersParam ? tickersParam.split(',') : undefined;

  const articles = await fetchAllNews(tickers);
  return NextResponse.json({ articles, fetchedAt: new Date().toISOString() });
}
