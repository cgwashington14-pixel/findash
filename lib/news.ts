'server only';

import Parser from 'rss-parser';
import { COMPANIES } from './constants';
import type { NewsItem } from './types';
export type { NewsItem };

const parser = new Parser({
  timeout: 8000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FinDash/1.0)' },
});

function extractSummary(content: string, maxSentences = 3): string {
  const cleaned = content
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) ?? [];
  return sentences.slice(0, maxSentences).join(' ').trim() || cleaned.slice(0, 300);
}

async function fetchTickerNews(ticker: string, companyName: string): Promise<NewsItem[]> {
  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=US&lang=en-US`;
  try {
    const feed = await parser.parseURL(url);
    return (feed.items ?? []).slice(0, 5).map((item, i) => ({
      ticker,
      companyName,
      title: item.title ?? 'No title',
      summary: extractSummary(item.contentSnippet ?? item.content ?? item.title ?? ''),
      link: item.link ?? '#',
      source: feed.title ?? 'Yahoo Finance',
      pubDate: item.pubDate ?? new Date().toISOString(),
      guid: item.guid ?? `${ticker}-${i}`,
    }));
  } catch {
    return [];
  }
}

export async function fetchAllNews(tickers?: string[]): Promise<NewsItem[]> {
  const targets = tickers
    ? COMPANIES.filter(c => tickers.includes(c.ticker))
    : COMPANIES;

  const results = await Promise.allSettled(
    targets.map(c => fetchTickerNews(c.ticker, c.name))
  );

  const all = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value);

  return all.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
