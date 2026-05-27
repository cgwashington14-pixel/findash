import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/news';
import { postDailyDigest, ensureChannel } from '@/lib/slack';

export const dynamic = 'force-dynamic';

export async function POST() {
  const articles = await fetchAllNews();
  const result = await postDailyDigest(articles);
  return NextResponse.json(result);
}

export async function GET() {
  const hasToken = !!process.env.SLACK_BOT_TOKEN;
  if (!hasToken) {
    return NextResponse.json({
      configured: false,
      message: 'Add SLACK_BOT_TOKEN to .env.local to enable Slack posting',
    });
  }
  const channelId = await ensureChannel();
  return NextResponse.json({ configured: true, channelId, channel: 'finance-project' });
}
