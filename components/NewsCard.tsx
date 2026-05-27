'use client';

import type { NewsItem } from '@/lib/types';
import { formatTimeAgo } from '@/lib/format';
import { ArrowUpRight } from 'lucide-react';

const TICKER_ACCENTS: Record<string, string> = {
  AMD: '#10b981', MU: '#3b82f6', ELF: '#ec4899', NOW: '#a855f7',
  CRM: '#06b6d4', DOCU: '#eab308', CVX: '#f97316', COST: '#ef4444', CAKE: '#f59e0b',
};

export default function NewsCard({ item }: { item: NewsItem }) {
  const accent = TICKER_ACCENTS[item.ticker] ?? 'var(--text-2)';

  return (
    <div
      className="flex gap-5 py-4 transition-colors group"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Left: ticker pill */}
      <div className="shrink-0 pt-0.5">
        <span
          className="mono font-bold text-xs tracking-wider"
          style={{ color: accent }}
        >
          {item.ticker}
        </span>
      </div>

      {/* Center: content */}
      <div className="flex-1 min-w-0">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium leading-snug line-clamp-2 block mb-1.5 transition-colors group-hover:underline"
          style={{ color: 'var(--text-1)', textUnderlineOffset: '3px' }}
        >
          {item.title}
        </a>
        {item.summary && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-2)' }}>
            {item.summary}
          </p>
        )}
      </div>

      {/* Right: meta */}
      <div className="shrink-0 flex flex-col items-end justify-between pt-0.5 gap-2">
        <span className="label" style={{ color: 'var(--text-3)' }}>{formatTimeAgo(item.pubDate)}</span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-3)' }}
          className="transition-colors hover:text-[var(--accent)]"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
