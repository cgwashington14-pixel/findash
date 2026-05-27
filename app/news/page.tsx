'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Newspaper, Bell } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { COMPANIES, ALL_TICKERS } from '@/lib/constants';
import type { NewsItem } from '@/lib/types';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicker, setActiveTicker] = useState<string>('ALL');
  const [slackStatus, setSlackStatus] = useState<{ configured: boolean; message?: string } | null>(null);
  const [posting, setPosting] = useState(false);

  const fetchNews = useCallback(async (ticker?: string) => {
    setLoading(true);
    try {
      const url = ticker && ticker !== 'ALL' ? `/api/news?tickers=${ticker}` : '/api/news';
      const res = await fetch(url);
      const { articles: data } = await res.json();
      setArticles(data ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchNews();
    fetch('/api/slack').then(r => r.json()).then(setSlackStatus).catch(() => {});
  }, [fetchNews]);

  const handleTickerFilter = (ticker: string) => {
    setActiveTicker(ticker);
    fetchNews(ticker === 'ALL' ? undefined : ticker);
  };

  const handleSlackPost = async () => {
    setPosting(true);
    try {
      const res = await fetch('/api/slack', { method: 'POST' });
      const data = await res.json();
      alert(data.ok ? 'Posted to #finance-project on Slack!' : `Could not post: ${data.error}`);
    } finally { setPosting(false); }
  };

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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Newspaper className="w-6 h-6 text-blue-500" />
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-1)' }}>News Feed</h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Latest headlines from Yahoo Finance for all tracked companies, with 3-sentence summaries.
            </p>
          </div>
          <button
            onClick={() => fetchNews(activeTicker === 'ALL' ? undefined : activeTicker)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50"
            style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-1)' }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Slack Banner */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3 border"
        style={{
          background: slackStatus?.configured ? 'rgba(16,185,129,0.08)' : 'var(--bg-card)',
          borderColor: slackStatus?.configured ? 'rgba(16,185,129,0.30)' : 'var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5" style={{ color: slackStatus?.configured ? '#10b981' : 'var(--text-3)' }} />
          <div>
            <div
              className="text-sm font-semibold"
              style={{ color: slackStatus?.configured ? '#10b981' : 'var(--text-2)' }}
            >
              {slackStatus?.configured ? 'Slack Connected — #finance-project' : 'Slack Not Connected'}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-3)' }}>
              {slackStatus?.configured
                ? 'Daily digest posts at 6 PM via cron job (see setup guide below)'
                : 'Add SLACK_BOT_TOKEN to .env.local to enable daily 6 PM posts'}
            </div>
          </div>
        </div>
        <button
          onClick={handleSlackPost}
          disabled={posting || !slackStatus?.configured}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white font-medium transition-colors"
          style={{ background: posting || !slackStatus?.configured ? '#7c3aed80' : '#7c3aed' }}
        >
          {posting ? 'Posting…' : 'Post Digest Now'}
        </button>
      </div>

      {/* Ticker Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleTickerFilter('ALL')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors"
          style={
            activeTicker === 'ALL'
              ? { background: 'var(--bg-hover)', borderColor: 'var(--border-md)', color: 'var(--text-1)' }
              : { background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-2)' }
          }
        >
          ALL
        </button>
        {ALL_TICKERS.map(ticker => {
          const c = TICKER_COLORS[ticker] ?? { bg: 'var(--bg-subtle)', text: 'var(--text-2)' };
          const active = activeTicker === ticker;
          return (
            <button
              key={ticker}
              onClick={() => handleTickerFilter(ticker)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors"
              style={
                active
                  ? { background: c.bg, color: c.text, borderColor: c.text + '60' }
                  : { background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-2)' }
              }
            >
              {ticker}
            </button>
          );
        })}
      </div>

      {/* Articles */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4 border h-28 animate-pulse"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-3)' }}>
          <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No articles found. Try refreshing or selecting a different company.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(item => <NewsCard key={item.guid} item={item} />)}
        </div>
      )}

      {/* Slack Setup Guide */}
      {!slackStatus?.configured && (
        <div
          className="mt-10 rounded-xl p-6 border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-1)' }}>Slack Setup Guide</h2>
          <ol className="space-y-3 text-sm list-decimal list-inside" style={{ color: 'var(--text-2)' }}>
            {[
              <>Go to <strong style={{ color: 'var(--text-1)' }}>api.slack.com/apps</strong> → Create New App → From scratch</>,
              <>Name it <strong style={{ color: 'var(--text-1)' }}>FinDash Bot</strong> and select your workspace</>,
              <>Under <strong style={{ color: 'var(--text-1)' }}>OAuth &amp; Permissions</strong>, add scopes: <code className="text-xs rounded px-1 py-0.5" style={{ background: 'var(--bg-subtle)' }}>channels:write</code>, <code className="text-xs rounded px-1 py-0.5" style={{ background: 'var(--bg-subtle)' }}>chat:write</code>, <code className="text-xs rounded px-1 py-0.5" style={{ background: 'var(--bg-subtle)' }}>channels:read</code></>,
              <>Click <strong style={{ color: 'var(--text-1)' }}>Install to Workspace</strong> and copy the Bot User OAuth Token</>,
              <>Add to <code className="text-xs rounded px-1 py-0.5" style={{ background: 'var(--bg-subtle)' }}>.env.local</code>: <code className="text-xs rounded px-1 py-0.5" style={{ background: 'var(--bg-subtle)' }}>SLACK_BOT_TOKEN=xoxb-your-token</code></>,
              <>Restart the dev server — FinDash will auto-create the <strong style={{ color: 'var(--text-1)' }}>#finance-project</strong> channel</>,
              <>Set up daily 6 PM cron: <code className="text-xs rounded px-1 py-0.5" style={{ background: 'var(--bg-subtle)' }}>0 18 * * * curl -X POST http://localhost:3001/api/slack</code></>,
            ].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
