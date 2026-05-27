'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import StockCard from '@/components/StockCard';
import { COMPANIES } from '@/lib/constants';
import { formatMarketCap } from '@/lib/format';
import type { StockQuote } from '@/lib/types';

type Filter = 'all' | 'core' | 'growth';

export default function Dashboard() {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stocks');
      const { data } = await res.json();
      const map: Record<string, StockQuote> = {};
      for (const q of data) if (q) map[q.ticker] = q;
      setQuotes(map);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch { /* keep stale */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const filtered = COMPANIES.filter(c => filter === 'all' || c.category === filter);
  const gainers  = Object.values(quotes).filter(q => q.changePercent > 0).length;
  const losers   = Object.values(quotes).filter(q => q.changePercent < 0).length;
  const totalCap = Object.values(quotes).reduce((s, q) => s + (q.marketCap ?? 0), 0);
  const avgChg   = Object.values(quotes).length
    ? Object.values(quotes).reduce((s, q) => s + q.changePercent, 0) / Object.values(quotes).length : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Page header */}
      <div className="flex items-end justify-between mb-8" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="mono font-bold text-2xl tracking-tight mb-1" style={{ color: 'var(--text-1)' }}>Markets</h1>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>
            {lastUpdated ? `Updated ${lastUpdated}` : 'Fetching live data…'}
          </p>
        </div>
        <button
          onClick={fetchQuotes}
          disabled={loading}
          className="flex items-center gap-2 text-xs px-3 py-1.5 transition-colors disabled:opacity-40"
          style={{ border: '1px solid var(--border)', color: 'var(--text-2)', background: 'var(--bg-card)' }}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Updating' : 'Refresh'}
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-px mb-8" style={{ background: 'var(--border)' }}>
        {[
          { label: 'Portfolio Cap', value: loading ? '…' : formatMarketCap(totalCap), color: 'var(--text-1)' },
          { label: 'Gainers',  value: loading ? '…' : String(gainers), color: gainers > 0 ? 'var(--pos)' : 'var(--text-1)' },
          { label: 'Losers',   value: loading ? '…' : String(losers),  color: losers > 0 ? 'var(--neg)' : 'var(--text-1)' },
          { label: 'Avg Move', value: loading ? '…' : `${avgChg >= 0 ? '+' : ''}${avgChg.toFixed(2)}%`, color: avgChg > 0 ? 'var(--pos)' : avgChg < 0 ? 'var(--neg)' : 'var(--text-1)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-4 py-3" style={{ background: 'var(--bg-card)' }}>
            <span className="label block mb-1.5">{label}</span>
            <span className="mono font-semibold text-base" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-6 mb-5">
        {([['all', 'All'], ['core', 'Core'], ['growth', 'Growth']] as [Filter, string][]).map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="label transition-colors pb-2"
            style={{
              color: filter === f ? 'var(--text-1)' : 'var(--text-3)',
              borderBottom: filter === f ? '1px solid var(--accent)' : '1px solid transparent',
            }}
          >
            {label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Stock ledger */}
      {loading && Object.keys(quotes).length === 0 ? (
        <div className="py-24 text-center">
          <span className="label" style={{ color: 'var(--text-3)' }}>LOADING MARKET DATA…</span>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)' }}>
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
    </div>
  );
}
