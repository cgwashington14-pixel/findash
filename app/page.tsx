'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import StockCard from '@/components/StockCard';
import { COMPANIES } from '@/lib/constants';
import { formatMarketCap } from '@/lib/format';
import type { StockQuote } from '@/lib/types';

type ViewMode = 'grid' | 'table';
type Filter = 'all' | 'core' | 'growth';

function StatBadge({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  const valueColor = positive === true ? '#10b981' : positive === false ? '#ef4444' : 'var(--text-1)';
  return (
    <div className="rounded-lg px-4 py-3 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>{label}</div>
      <div className="text-lg font-bold" style={{ color: valueColor }}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<ViewMode>('grid');

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stocks');
      const { data } = await res.json();
      const map: Record<string, StockQuote> = {};
      for (const q of data) if (q) map[q.ticker] = q;
      setQuotes(map);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch { /* keep stale data */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const filtered = COMPANIES.filter(c => filter === 'all' || c.category === filter);
  const gainers = Object.values(quotes).filter(q => q.changePercent > 0).length;
  const losers  = Object.values(quotes).filter(q => q.changePercent < 0).length;
  const totalMarketCap = Object.values(quotes).reduce((s, q) => s + (q.marketCap ?? 0), 0);
  const avgChange = Object.values(quotes).length
    ? Object.values(quotes).reduce((s, q) => s + q.changePercent, 0) / Object.values(quotes).length
    : 0;

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-1)' }}>Company Dashboard</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-2)' }}>
              Track valuations, key metrics, and analyst sentiment for 9 companies in real time.
            </p>
          </div>
          <button
            onClick={fetchQuotes}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50"
            style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-1)' }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        {lastUpdated && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-4)' }}>Last updated: {lastUpdated}</p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatBadge label="Combined Mkt Cap" value={loading ? '…' : formatMarketCap(totalMarketCap)} />
        <StatBadge label="Gainers / Losers" value={loading ? '…' : `${gainers} / ${losers}`} />
        <StatBadge
          label="Avg Daily Change"
          value={loading ? '…' : `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`}
          positive={avgChange > 0 ? true : avgChange < 0 ? false : undefined}
        />
        <div
          className="rounded-lg px-4 py-3 flex items-center gap-2 border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          {avgChange >= 0
            ? <TrendingUp className="w-5 h-5 text-emerald-500" />
            : <TrendingDown className="w-5 h-5 text-red-500" />}
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Sentiment</div>
            <div className="text-sm font-bold" style={{ color: avgChange >= 0 ? '#10b981' : '#ef4444' }}>
              {gainers > losers ? 'Risk-On' : gainers < losers ? 'Risk-Off' : 'Mixed'}
            </div>
          </div>
        </div>
      </div>

      {/* Filters + View Toggle */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {(['all', 'core', 'growth'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize"
              style={
                filter === f
                  ? { background: '#2563eb', color: '#ffffff' }
                  : { background: 'var(--bg-subtle)', color: 'var(--text-2)' }
              }
            >
              {f === 'all' ? 'All Companies' : f === 'growth' ? 'Growth Picks' : 'Core Holdings'}
            </button>
          ))}
        </div>
        <div
          className="flex items-center gap-1 rounded-lg p-1"
          style={{ background: 'var(--bg-subtle)' }}
        >
          {(['grid', 'table'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1 rounded text-xs font-medium transition-colors capitalize"
              style={
                view === v
                  ? { background: 'var(--bg-hover)', color: 'var(--text-1)' }
                  : { color: 'var(--text-2)' }
              }
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(company => (
            <StockCard
              key={company.ticker}
              company={company}
              quote={quotes[company.ticker] ?? null}
              loading={loading && !quotes[company.ticker]}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-xs uppercase tracking-wider"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-3)' }}
              >
                {['Company','Price','Change','Mkt Cap','P/E','P/S','Fwd P/E','Rev Growth','Analyst'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(company => {
                const q = quotes[company.ticker];
                const up = (q?.changePercent ?? 0) >= 0;
                return (
                  <tr
                    key={company.ticker}
                    className="border-t transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded">
                          {company.ticker}
                        </span>
                        <span className="font-medium hidden sm:inline" style={{ color: 'var(--text-1)' }}>
                          {company.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-1)' }}>
                      {q ? `$${q.price.toFixed(2)}` : loading ? <span style={{ color: 'var(--text-4)' }}>…</span> : '—'}
                    </td>
                    <td className="text-right px-4 py-3 font-semibold" style={{ color: up ? '#10b981' : '#ef4444' }}>
                      {q ? `${up ? '+' : ''}${q.changePercent.toFixed(2)}%` : '—'}
                    </td>
                    <td className="text-right px-4 py-3" style={{ color: 'var(--text-2)' }}>
                      {q ? formatMarketCap(q.marketCap) : '—'}
                    </td>
                    <td className="text-right px-4 py-3" style={{ color: 'var(--text-2)' }}>
                      {q?.peRatio != null ? q.peRatio.toFixed(1) : '—'}
                    </td>
                    <td className="text-right px-4 py-3" style={{ color: 'var(--text-2)' }}>
                      {q?.priceToSales != null ? `${q.priceToSales.toFixed(1)}x` : '—'}
                    </td>
                    <td className="text-right px-4 py-3" style={{ color: 'var(--text-2)' }}>
                      {q?.forwardPE != null ? q.forwardPE.toFixed(1) : '—'}
                    </td>
                    <td
                      className="text-right px-4 py-3 font-medium"
                      style={{ color: q?.revenueGrowth != null && q.revenueGrowth > 0 ? '#10b981' : 'var(--text-2)' }}
                    >
                      {q?.revenueGrowth != null ? `${(q.revenueGrowth * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className="text-right px-4 py-3">
                      {q?.analystRating ? (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded"
                          style={
                            q.analystRating.includes('buy')
                              ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                              : q.analystRating === 'hold'
                              ? { background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
                              : { background: 'rgba(239,68,68,0.15)', color: '#ef4444' }
                          }
                        >
                          {q.analystRating.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {loading && Object.keys(quotes).length === 0 && (
        <div className="flex items-center justify-center gap-3 py-20" style={{ color: 'var(--text-2)' }}>
          <Activity className="w-5 h-5 animate-pulse" />
          <span>Fetching live market data…</span>
        </div>
      )}
    </div>
  );
}
