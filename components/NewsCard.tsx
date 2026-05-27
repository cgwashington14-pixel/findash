'use client';

import { ExternalLink, Clock } from 'lucide-react';
import type { NewsItem } from '@/lib/types';
import { formatTimeAgo } from '@/lib/format';

interface NewsCardProps {
  item: NewsItem;
}

const TICKER_COLORS: Record<string, { bg: string; text: string }> = {
  AMD:  { bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
  MU:   { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  ELF:  { bg: 'rgba(236,72,153,0.15)', text: '#ec4899' },
  NOW:  { bg: 'rgba(168,85,247,0.15)', text: '#a855f7' },
  CRM:  { bg: 'rgba(6,182,212,0.15)',  text: '#06b6d4' },
  DOCU: { bg: 'rgba(234,179,8,0.15)',  text: '#ca8a04' },
  CVX:  { bg: 'rgba(249,115,22,0.15)', text: '#f97316' },
  COST: { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444' },
  CAKE: { bg: 'rgba(245,158,11,0.15)', text: '#d97706' },
};

export default function NewsCard({ item }: NewsCardProps) {
  const colors = TICKER_COLORS[item.ticker] ?? { bg: 'var(--bg-subtle)', text: 'var(--text-2)' };

  return (
    <div
      className="rounded-xl p-4 border transition-colors"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{ background: colors.bg, color: colors.text }}
            >
              {item.ticker}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>{item.companyName}</span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-4)' }}>
              <Clock className="w-3 h-3" />
              {formatTimeAgo(item.pubDate)}
            </span>
          </div>

          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold leading-snug line-clamp-2 block transition-colors hover:text-emerald-500"
            style={{ color: 'var(--text-1)' }}
          >
            {item.title}
          </a>

          {item.summary && (
            <p className="text-xs mt-2 leading-relaxed line-clamp-3" style={{ color: 'var(--text-2)' }}>
              {item.summary}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs" style={{ color: 'var(--text-4)' }}>{item.source}</span>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors ml-auto"
            >
              Read article <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
