'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { COMPANIES } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import { getMarketStatus, STATUS_COLOR } from '@/lib/market';
import { generateRecap } from '@/lib/recap';
import type { StockQuote } from '@/lib/types';

function MarketLabel() {
  const [status, setStatus] = useState(getMarketStatus());
  useEffect(() => {
    const id = setInterval(() => setStatus(getMarketStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  const isLive   = status === 'OPEN';
  const heading  = isLive ? 'Intraday Snapshot' : 'Market Close Summary';
  const sub      = isLive
    ? 'Markets are open — figures update throughout the trading session.'
    : status === 'PRE-MARKET'
    ? 'Pre-market session — figures reflect the prior trading day\'s close.'
    : status === 'AFTER-HOURS'
    ? 'After-hours session — figures reflect today\'s official closing prices.'
    : 'Markets are closed — figures reflect the most recent trading day\'s close.';

  return (
    <div className="flex items-center gap-3">
      <span
        className={isLive ? 'live-dot' : ''}
        style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: STATUS_COLOR[status], display: 'inline-block', flexShrink: 0,
        }}
      />
      <div>
        <span className="label" style={{ color: STATUS_COLOR[status] }}>{heading}</span>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{sub}</p>
      </div>
    </div>
  );
}

interface RecapRow {
  company: (typeof COMPANIES)[number];
  quote: StockQuote;
  summary: string;
}

export default function RecapPage() {
  const [rows,   setRows]   = useState<RecapRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/stocks');
      const { data } = await res.json();
      const map: Record<string, StockQuote> = {};
      for (const q of (data ?? [])) if (q) map[q.ticker] = q;

      const built: RecapRow[] = COMPANIES
        .filter(c => map[c.ticker])
        .map(c => ({
          company: c,
          quote:   map[c.ticker],
          summary: generateRecap(c, map[c.ticker]),
        }));

      setRows(built);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* auto-refresh every 60s when market is open */
  useEffect(() => {
    const id = setInterval(() => {
      if (getMarketStatus() === 'OPEN') fetchData();
    }, 60_000);
    return () => clearInterval(id);
  }, [fetchData]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="mono font-bold text-2xl tracking-tight mb-2" style={{ color: 'var(--text-1)' }}>Daily Recap</h1>
          <MarketLabel />
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="label" style={{ color: 'var(--text-3)' }}>Updated {lastUpdated}</span>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 text-xs px-3 py-1.5 disabled:opacity-40"
            style={{ border: '1px solid var(--border)', color: 'var(--text-2)', background: 'var(--bg-card)' }}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="label mb-8" style={{ color: 'var(--text-3)' }}>
        Data via Yahoo Finance · Summaries generated from live market data · Not financial advice
      </p>

      {/* Loading state */}
      {loading && rows.length === 0 && (
        <div className="py-24 text-center">
          <span className="label" style={{ color: 'var(--text-3)' }}>GENERATING SUMMARIES…</span>
        </div>
      )}

      {/* Recap cards */}
      {rows.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {rows.map(({ company, quote, summary }, i) => {
            const up   = quote.changePercent >= 0;
            const chgColor = up ? 'var(--pos)' : 'var(--neg)';
            const isLast = i === rows.length - 1;

            return (
              <div
                key={company.ticker}
                style={{
                  borderBottom: isLast ? 'none' : '1px solid var(--border)',
                  padding: '1.5rem 0',
                }}
              >
                {/* Top row: identity + price */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-baseline gap-4">
                    <span
                      className="mono font-bold"
                      style={{ fontSize: '1.4rem', color: 'var(--text-1)', letterSpacing: '-0.02em' }}
                    >
                      {company.ticker}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-2)' }}>{company.name}</span>
                    <span className="label" style={{ color: 'var(--accent)' }}>{company.sector}</span>
                  </div>

                  {/* Price + change */}
                  <div className="flex items-baseline gap-3 shrink-0 ml-4">
                    <span className="mono font-semibold text-base" style={{ color: 'var(--text-1)' }}>
                      {formatCurrency(quote.price)}
                    </span>
                    <span
                      className="mono text-sm font-medium"
                      style={{
                        color: chgColor,
                        background: `color-mix(in srgb, ${up ? 'var(--pos)' : 'var(--neg)'} 10%, transparent)`,
                        padding: '0.1rem 0.4rem',
                      }}
                    >
                      {up ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </span>
                    <span className="mono text-xs" style={{ color: chgColor }}>
                      {up ? '+' : ''}{formatCurrency(Math.abs(quote.change))}
                    </span>
                  </div>
                </div>

                {/* Three-sentence summary */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-2)', maxWidth: '780px' }}
                >
                  {summary}
                </p>

                {/* Footer meta */}
                <div className="flex items-center gap-6 mt-3">
                  {[
                    { label: 'Vol',         value: `${(quote.volume / 1_000_000).toFixed(1)}M` },
                    { label: '52W Range',   value: `${formatCurrency(quote.fiftyTwoWeekLow)} – ${formatCurrency(quote.fiftyTwoWeekHigh)}` },
                    ...(quote.peRatio        ? [{ label: 'P/E', value: `${quote.peRatio.toFixed(1)}×` }] : []),
                    ...(quote.forwardPE      ? [{ label: 'Fwd P/E', value: `${quote.forwardPE.toFixed(1)}×` }] : []),
                    ...(quote.analystRating  ? [{ label: 'Rating', value: quote.analystRating }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="label">{label}</span>
                      <span className="mono text-xs" style={{ color: 'var(--text-2)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
