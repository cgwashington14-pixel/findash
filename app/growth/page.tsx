'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import GrowthCard from '@/components/GrowthCard';
import { COMPANIES, GROWTH_TICKERS } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import type { StockQuote } from '@/lib/types';

export default function GrowthPage() {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks?tickers=${GROWTH_TICKERS.join(',')}`);
      const { data } = await res.json();
      const map: Record<string, StockQuote> = {};
      for (const q of data) if (q) map[q.ticker] = q;
      setQuotes(map);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  /* auto-refresh every 30s */
  useEffect(() => {
    const id = setInterval(fetchQuotes, 30_000);
    return () => clearInterval(id);
  }, [fetchQuotes]);

  const growthCompanies = COMPANIES.filter(c => GROWTH_TICKERS.includes(c.ticker));

  /* today's leader / laggard */
  const ranked = growthCompanies
    .map(c => ({ company: c, quote: quotes[c.ticker] ?? null }))
    .filter(x => x.quote !== null)
    .sort((a, b) => b.quote!.changePercent - a.quote!.changePercent);
  const leader  = ranked[0]                      ?? null;
  const laggard = ranked[ranked.length - 1]      ?? null;
  const showMovers = leader && laggard && leader.company.ticker !== laggard.company.ticker;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-end justify-between mb-8" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="mono font-bold text-2xl tracking-tight mb-1" style={{ color: 'var(--text-1)' }}>Growth</h1>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>
            {lastUpdated
              ? `Live · updated ${lastUpdated} · auto-refreshes every 30s`
              : 'High-conviction positions tied to AI, semiconductors, and consumer disruption.'}
          </p>
        </div>
        <button
          onClick={fetchQuotes}
          disabled={loading}
          className="flex items-center gap-2 text-xs px-3 py-1.5 disabled:opacity-40"
          style={{ border: '1px solid var(--border)', color: 'var(--text-2)', background: 'var(--bg-card)' }}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Updating' : 'Refresh'}
        </button>
      </div>

      {/* Today's Movers strip */}
      {showMovers && (
        <div className="grid grid-cols-2 gap-px mb-8" style={{ background: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ background: 'var(--bg-card)' }}>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 shrink-0" style={{ color: 'var(--pos)' }} />
              <div>
                <span className="label block mb-0.5" style={{ color: 'var(--pos)' }}>Today&apos;s Leader</span>
                <span className="mono font-bold text-sm" style={{ color: 'var(--text-1)' }}>{leader!.company.ticker}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--text-2)' }}>{leader!.company.name}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="mono font-semibold text-sm block" style={{ color: 'var(--pos)' }}>
                +{leader!.quote!.changePercent.toFixed(2)}%
              </span>
              <span className="mono text-xs" style={{ color: 'var(--text-3)' }}>
                {formatCurrency(leader!.quote!.price)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-3" style={{ background: 'var(--bg-card)' }}>
            <div className="flex items-center gap-3">
              <TrendingDown className="w-4 h-4 shrink-0" style={{ color: 'var(--neg)' }} />
              <div>
                <span className="label block mb-0.5" style={{ color: 'var(--neg)' }}>Today&apos;s Laggard</span>
                <span className="mono font-bold text-sm" style={{ color: 'var(--text-1)' }}>{laggard!.company.ticker}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--text-2)' }}>{laggard!.company.name}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="mono font-semibold text-sm block" style={{ color: 'var(--neg)' }}>
                {laggard!.quote!.changePercent.toFixed(2)}%
              </span>
              <span className="mono text-xs" style={{ color: 'var(--text-3)' }}>
                {formatCurrency(laggard!.quote!.price)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs mb-8" style={{ color: 'var(--text-3)' }}>
        Educational use only — not financial advice. Always do your own research before investing.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {growthCompanies.map(company => (
          <GrowthCard key={company.ticker} company={company} quote={quotes[company.ticker] ?? null} />
        ))}
      </div>

      {/* What makes a growth stock */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <span className="label block mb-5">WHAT QUALIFIES A GROWTH PICK</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { title: 'Rev Growth > 15% YoY', body: 'Growing top-line revenue rapidly indicates strong demand and expanding market share.' },
            { title: 'Large TAM',             body: 'A huge total addressable market means even small share gains translate to major revenue.' },
            { title: 'Secular Tailwinds',     body: "Multi-year macro trends — AI, cloud, beauty democratization — that don't depend on economic cycles." },
          ].map(({ title, body }) => (
            <div key={title}>
              <p className="mono text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
