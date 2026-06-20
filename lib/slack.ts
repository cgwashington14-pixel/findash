import { WebClient } from '@slack/web-api';
import type { NewsItem } from './types';

const CHANNEL_NAME = 'finance-project';

function getSlackClient(): WebClient | null {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return null;
  return new WebClient(token);
}

export async function ensureChannel(): Promise<string | null> {
  const client = getSlackClient();
  if (!client) return null;

  try {
    const list = await client.conversations.list({ types: 'public_channel,private_channel', limit: 200 });
    const existing = list.channels?.find(c => c.name === CHANNEL_NAME);
    if (existing?.id) return existing.id;

    const created = await client.conversations.create({ name: CHANNEL_NAME, is_private: false });
    return created.channel?.id ?? null;
  } catch {
    return null;
  }
}

export function buildDailyDigest(articles: NewsItem[]): string {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const grouped: Record<string, NewsItem[]> = {};
  for (const article of articles) {
    if (!grouped[article.ticker]) grouped[article.ticker] = [];
    if (grouped[article.ticker].length < 2) grouped[article.ticker].push(article);
  }

  let text = `📈 *FinDash Daily Digest — ${date}*\n\n`;

  for (const [ticker, items] of Object.entries(grouped)) {
    if (items.length === 0) continue;
    text += `*${ticker} — ${items[0].companyName}*\n`;
    for (const item of items) {
      text += `• <${item.link}|${item.title}>\n`;
      text += `  _${item.summary.slice(0, 200)}${item.summary.length > 200 ? '…' : ''}_\n`;
    }
    text += '\n';
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001';
  text += `_Powered by FinDash • <${baseUrl}|Open Dashboard>_`;
  return text;
}

export async function postDailyDigest(articles: NewsItem[]): Promise<{ ok: boolean; error?: string }> {
  const client = getSlackClient();
  if (!client) return { ok: false, error: 'SLACK_BOT_TOKEN not set in .env.local' };

  const channelId = await ensureChannel();
  if (!channelId) return { ok: false, error: 'Could not find or create #finance-project channel' };

  try {
    const text = buildDailyDigest(articles);
    await client.chat.postMessage({ channel: channelId, text, mrkdwn: true });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
