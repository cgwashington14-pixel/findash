'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { StockQuote } from '@/lib/types';
import { formatMarketCap, formatCurrency, get52WeekPosition, getAnalystRatingLabel } from '@/lib/format';
import type { Company } from '@/lib/constants';

interface StockCardProps {
  company: Company;
  quote: StockQuote | null;
  loading?: boolean;
}

function fmt(n: number | null, d = 2) { return n == null ? '—' : n.toFixed(d); }
function fmtM(n: number | null) { return n == null ? '—' : `${n.toFixed(1)}×`; }

export default function StockCard({ company, quote, loading }: StockCardProps) {
  const [expanded, setExpanded] = useState(false);
  const up = (quote?.changePercent ?? 0) >= 0;
  const pos52 = quote ? get52WeekPosition(quote.price, quote.fiftyTwoWeekLow, quote.fiftyTwoWeekHigh) : 50;
  const upside = quote?.analystTargetPrice && quote.price
    ? ((quote.analystTargetPrice - quote.price) / quote.price) * 100 : null;

  return (
    <div
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}
      className="transition-colors"
    >
      {/* Main row */}
      <div className="px-5 py-4">
        {/* Top: ticker + name + link */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <a
                href={`https://finance.yahoo.com/quote/${company.ticker}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mono font-bold text-2xl tracking-tight transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--text-1)' }}
              >
                {company.ticker}
              </a>
              {company.category === 'growth' && (
                <span className="label" style={{ color: 'var(--accent)' }}>GROWTH</span>
              )}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-2)' }}>{company.name}</p>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-6 rounded-none animate-pulse" style={{ background: 'var(--bg-subtle)' }} />
            ) : quote ? (
              <div className="text-right">
                <div className="mono font-semibold text-lg" style={{ color: 'var(--text-1)' }}>
                  {formatCurrency(quote.price)}
                </div>
                <div className="mono text-xs font-medium" style={{ color: up ? 'var(--pos)' : 'var(--neg)' }}>
                  {up ? '+' : ''}{fmt(quote.changePercent)}%
                </div>
              </div>
            ) : null}
            <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-3)' }}>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Metrics row */}
        {quote && (
          <div className="grid grid-cols-4 gap-4 mb-3">
            <div>
              <span className="label block mb-1">Mkt Cap</span>
              <span className="mono text-sm" style={{ color: 'var(--text-1)' }}>{formatMarketCap(quote.marketCap)}</span>
            </div>
            <div>
              <span className="label block mb-1">P/E</span>
              <span className="mono text-sm" style={{ color: 'var(--text-1)' }}>{fmt(quote.peRatio, 1)}</span>
            </div>
            <div>
              <span className="label block mb-1">P/S</span>
              <span className="mono text-sm" style={{ color: 'var(--text-1)' }}>{fmtM(quote.priceToSales)}</span>
            </div>
            <div>
              <span className="label block mb-1">Rev ↑</span>
              <span className="mono text-sm" style={{ color: quote.revenueGrowth != null && quote.revenueGrowth > 0 ? 'var(--pos)' : 'var(--text-1)' }}>
                {quote.revenueGrowth != null ? `${(quote.revenueGrowth * 100).toFixed(1)}%` : '—'}
              </span>
            </div>
          </div>
        )}

        {/* 52-week bar */}
        {quote && (
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="label">{formatCurrency(quote.fiftyTwoWeekLow)} 52W</span>
              <span className="label">{formatCurrency(quote.fiftyTwoWeekHigh)} 52W</span>
            </div>
            <div className="h-[2px] relative" style={{ background: 'var(--border-md)' }}>
              <div
                className="absolute top-0 left-0 h-full transition-all"
                style={{ width: `${pos52}%`, background: 'var(--accent)' }}
              />
            </div>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="label transition-colors"
          style={{ color: expanded ? 'var(--accent)' : 'var(--text-3)' }}
        >
          {expanded ? '↑ LESS' : '↓ FULL DETAIL'}
        </button>
      </div>

      {/* Expanded */}
      {expanded && quote && (
        <div
          className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-5"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
        >
          <div>
            <span className="label block mb-1">Fwd P/E</span>
            <span className="mono text-sm" style={{ color: 'var(--text-1)' }}>{fmt(quote.forwardPE, 1)}</span>
          </div>
          <div>
            <span className="label block mb-1">P/B</span>
            <span className="mono text-sm" style={{ color: 'var(--text-1)' }}>{fmtM(quote.priceToBook)}</span>
          </div>
          <div>
            <span className="label block mb-1">EPS (TTM)</span>
            <span className="mono text-sm" style={{ color: quote.eps != null && quote.eps > 0 ? 'var(--pos)' : 'var(--neg)' }}>
              {quote.eps != null ? formatCurrency(quote.eps) : '—'}
            </span>
          </div>
          <div>
            <span className="label block mb-1">Div Yield</span>
            <span className="mono text-sm" style={{ color: 'var(--text-1)' }}>
              {quote.dividendYield != null ? `${fmt(quote.dividendYield)}%` : 'None'}
            </span>
          </div>
          <div>
            <span className="label block mb-1">Debt / Equity</span>
            <span className="mono text-sm" style={{ color: quote.debtToEquity != null && quote.debtToEquity < 1 ? 'var(--pos)' : 'var(--text-1)' }}>
              {fmt(quote.debtToEquity, 2)}
            </span>
          </div>
          {quote.analystTargetPrice && (
            <div>
              <span className="label block mb-1">Analyst Target</span>
              <span className="mono text-sm" style={{ color: 'var(--text-1)' }}>{formatCurrency(quote.analystTargetPrice)}</span>
            </div>
          )}
          {upside != null && (
            <div>
              <span className="label block mb-1">Upside</span>
              <span className="mono text-sm" style={{ color: upside > 0 ? 'var(--pos)' : 'var(--neg)' }}>
                {upside > 0 ? '+' : ''}{upside.toFixed(1)}%
              </span>
            </div>
          )}
          {quote.analystRating && (
            <div>
              <span className="label block mb-1">Consensus</span>
              <span className="mono text-sm" style={{
                color: quote.analystRating.includes('buy') ? 'var(--pos)' : quote.analystRating === 'hold' ? 'var(--text-2)' : 'var(--neg)'
              }}>
                {getAnalystRatingLabel(quote.analystRating).toUpperCase()}
              </span>
            </div>
          )}
          <div className="col-span-2 sm:col-span-4">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{company.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
