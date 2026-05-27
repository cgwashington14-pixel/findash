'use client';

import { useState, useEffect } from 'react';
import type { StockQuote } from '@/lib/types';
import { getMarketStatus, STATUS_COLOR } from '@/lib/market';

export default function TickerTape() {
  const [quotes,  setQuotes]  = useState<StockQuote[]>([]);
  const [status,  setStatus]  = useState(getMarketStatus());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/stocks');
        const { data } = await res.json();
        setQuotes((data ?? []).filter(Boolean));
      } catch {}
    };
    load();
    const stockInt  = setInterval(load,                          30_000);
    const statusInt = setInterval(() => setStatus(getMarketStatus()), 60_000);
    return () => { clearInterval(stockInt); clearInterval(statusInt); };
  }, []);

  /* placeholder strip while loading */
  if (!quotes.length) {
    return <div style={{ height: '28px', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }} />;
  }

  const items = [...quotes, ...quotes]; // duplicate for seamless loop

  return (
    <div
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-subtle)',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Market status — fixed left column */}
      <div
        style={{
          flexShrink: 0,
          paddingLeft: '1rem',
          paddingRight: '1rem',
          borderRight: '1px solid var(--border)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--bg-subtle)',
        }}
      >
        <span
          className={status === 'OPEN' ? 'live-dot' : ''}
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: STATUS_COLOR[status],
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span className="label" style={{ color: STATUS_COLOR[status], whiteSpace: 'nowrap' }}>
          {status}
        </span>
      </div>

      {/* Scrolling strip */}
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div className="ticker-track">
          {items.map((q, i) => {
            const up = q.changePercent >= 0;
            return (
              <span
                key={`${q.ticker}-${i}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0 1.25rem',
                  flexShrink: 0,
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em' }}
                >
                  {q.ticker}
                </span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-1)' }}>
                  ${q.price.toFixed(2)}
                </span>
                <span className="mono" style={{ fontSize: '10px', color: up ? 'var(--pos)' : 'var(--neg)' }}>
                  {up ? '+' : ''}{q.changePercent.toFixed(2)}%
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
