'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { ALL_TICKERS } from '@/lib/constants';
import type { NewsItem } from '@/lib/types';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicker, setActiveTicker] = useState('ALL');
  const [slackStatus, setSlackStatus] = useState<{ configured: boolean } | null>(null);
  const [posting, setPosting] = useState(false);

  const fetchNews = useCallback(async (ticker?: string) => {
    setLoading(true);
    try {
      const url = ticker && ticker !== 'ALL' ? `/api/news?tickers=${ticker}` : '/api/news';
      const { articles: data } = await (await fetch(url)).json();
      setArticles(data ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchNews();
    fetch('/api/slack').then(r => r.json()).then(setSlackStatus).catch(() => {});
  }, [fetchNews]);

  const handlePost = async () => {
    setPosting(true);
    try {
      const data = await (await fetch('/api/slack', { method: 'POST' })).json();
      alert(data.ok ? 'Posted to #finance-project!' : `Error: ${data.error}`);
    } finally { setPosting(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-end justify-between mb-8" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="mono font-bold text-2xl tracking-tight mb-1" style={{ color: 'var(--text-1)' }}>News</h1>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>
            Live headlines for all tracked companies · 3-sentence summaries
          </p>
        </div>
        <div className="flex items-center gap-3">
          {slackStatus?.configured && (
            <button
              onClick={handlePost}
              disabled={posting}
              className="text-xs px-3 py-1.5 disabled:opacity-40 transition-colors"
              style={{ background: 'var(--accent)', color: '#000', fontFamily: 'monospace', fontWeight: 600 }}
            >
              {posting ? 'POSTING…' : 'POST TO SLACK'}
            </button>
          )}
          <button
            onClick={() => fetchNews(activeTicker === 'ALL' ? undefined : activeTicker)}
            disabled={loading}
            className="flex items-center gap-2 text-xs px-3 py-1.5 disabled:opacity-40"
            style={{ border: '1px solid var(--border)', color: 'var(--text-2)', background: 'var(--bg-card)' }}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Slack note */}
      {!slackStatus?.configured && (
        <p className="text-xs mb-6" style={{ color: 'var(--text-3)' }}>
          Add <span className="mono" style={{ color: 'var(--text-2)' }}>SLACK_BOT_TOKEN</span> to{' '}
          <span className="mono" style={{ color: 'var(--text-2)' }}>.env.local</span> to enable daily 6 PM Slack digests →{' '}
          <span className="mono" style={{ color: 'var(--text-2)' }}>0 18 * * * curl -X POST http://localhost:3001/api/slack</span>
        </p>
      )}

      {/* Ticker filter */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6">
        {['ALL', ...ALL_TICKERS].map(t => (
          <button
            key={t}
            onClick={() => { setActiveTicker(t); fetchNews(t === 'ALL' ? undefined : t); }}
            className="label transition-colors pb-1"
            style={{
              color: activeTicker === t ? 'var(--text-1)' : 'var(--text-3)',
              borderBottom: activeTicker === t ? '1px solid var(--accent)' : '1px solid transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Articles */}
      {loading ? (
        <div className="py-24 text-center">
          <span className="label" style={{ color: 'var(--text-3)' }}>LOADING ARTICLES…</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-24 text-center">
          <span className="label" style={{ color: 'var(--text-3)' }}>NO ARTICLES FOUND</span>
        </div>
      ) : (
        <div>
          {articles.map(item => <NewsCard key={item.guid} item={item} />)}
        </div>
      )}
    </div>
  );
}
