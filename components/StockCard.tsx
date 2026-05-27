'use client';

import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { StockQuote } from '@/lib/types';
import { formatMarketCap, formatCurrency, get52WeekPosition, getAnalystRatingLabel } from '@/lib/format';
import type { Company } from '@/lib/constants';
import MetricBadge from './MetricBadge';

interface StockCardProps {
  company: Company;
  quote: StockQuote | null;
  loading?: boolean;
}

function fmt(n: number | null, decimals = 2): string {
  if (n === null || n === undefined) return '—';
  return n.toFixed(decimals);
}

function fmtMultiple(n: number | null): string {
  if (n === null || n === undefined) return '—';
  return `${n.toFixed(1)}x`;
}

export default function StockCard({ company, quote, loading }: StockCardProps) {
  const [expanded, setExpanded] = useState(false);

  const changePositive = (quote?.changePercent ?? 0) >= 0;
  const pos52 = quote ? get52WeekPosition(quote.price, quote.fiftyTwoWeekLow, quote.fiftyTwoWeekHigh) : 50;
  const upside = quote?.analystTargetPrice && quote.price
    ? ((quote.analystTargetPrice - quote.price) / quote.price) * 100
    : null;

  const ratingColors: Record<string, string> = {
    'Strong Buy': '#10b981', Buy: '#10b981',
    Hold: '#f59e0b', Sell: '#ef4444', 'Strong Sell': '#ef4444', 'N/A': 'var(--text-3)',
  };

  return (
    <div
      className="rounded-xl overflow-hidden border transition-colors"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded">
                {company.ticker}
              </span>
              {company.category === 'growth' && (
                <span className="text-xs font-bold bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded">
                  GROWTH
                </span>
              )}
            </div>
            <p className="font-semibold mt-1 text-sm leading-tight" style={{ color: 'var(--text-1)' }}>
              {company.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{company.sector}</p>
          </div>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors mt-1"
            style={{ color: 'var(--text-3)' }}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-8 rounded w-32" style={{ background: 'var(--bg-subtle)' }} />
            <div className="h-4 rounded w-20" style={{ background: 'var(--bg-subtle)' }} />
          </div>
        ) : quote ? (
          <>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>
                {formatCurrency(quote.price)}
              </span>
              <span className="text-sm font-semibold" style={{ color: changePositive ? '#10b981' : '#ef4444' }}>
                {changePositive ? '+' : ''}{fmt(quote.changePercent)}%
              </span>
            </div>
            <span className="text-xs" style={{ color: changePositive ? '#10b981' : '#ef4444', opacity: 0.75 }}>
              {changePositive ? '+' : ''}{formatCurrency(quote.change)} today
            </span>

            {/* 52-week range */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--text-3)' }}>
                <span>52W Low: {formatCurrency(quote.fiftyTwoWeekLow)}</span>
                <span>52W High: {formatCurrency(quote.fiftyTwoWeekHigh)}</span>
              </div>
              <div className="relative h-1.5 rounded-full" style={{ background: 'var(--bg-subtle)' }}>
                <div
                  className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-full"
                  style={{ width: `${pos52}%` }}
                />
                <div
                  className="absolute w-2 h-2 bg-white rounded-full top-1/2 -translate-y-1/2 -translate-x-1 shadow"
                  style={{ left: `${pos52}%` }}
                />
              </div>
              <div className="text-center text-[10px] mt-1" style={{ color: 'var(--text-2)' }}>
                {pos52}% of 52-week range
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm" style={{ color: 'var(--text-3)' }}>Data unavailable</div>
        )}
      </div>

      {/* Key Metrics Row */}
      {quote && (
        <div className="px-4 pb-3 grid grid-cols-3 gap-2">
          <MetricBadge label="Mkt Cap" value={formatMarketCap(quote.marketCap)} neutral size="sm" />
          <MetricBadge label="P/E" value={fmt(quote.peRatio, 1)} neutral size="sm" />
          <MetricBadge label="P/S" value={fmtMultiple(quote.priceToSales)} neutral size="sm" />
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs transition-colors border-t"
        style={{ color: 'var(--text-3)', borderColor: 'var(--border)' }}
      >
        {expanded ? 'Less detail' : 'Full valuation'}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Expanded Detail */}
      {expanded && quote && (
        <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 gap-3 pt-3">
            <MetricBadge label="Forward P/E" value={fmt(quote.forwardPE, 1)} neutral size="sm" />
            <MetricBadge label="P/B" value={fmtMultiple(quote.priceToBook)} neutral size="sm" />
            <MetricBadge
              label="EPS (TTM)"
              value={quote.eps !== null ? formatCurrency(quote.eps) : '—'}
              positive={quote.eps !== null && quote.eps > 0}
              size="sm"
            />
            <MetricBadge
              label="Div Yield"
              value={quote.dividendYield !== null ? `${fmt(quote.dividendYield)}%` : 'None'}
              positive={quote.dividendYield !== null && quote.dividendYield > 0}
              size="sm"
            />
            <MetricBadge
              label="Debt/Equity"
              value={fmt(quote.debtToEquity, 2)}
              positive={quote.debtToEquity !== null && quote.debtToEquity < 1}
              size="sm"
            />
            <MetricBadge
              label="Rev Growth"
              value={quote.revenueGrowth !== null ? `${(quote.revenueGrowth * 100).toFixed(1)}%` : '—'}
              positive={quote.revenueGrowth !== null && quote.revenueGrowth > 0}
              size="sm"
            />
          </div>

          {quote.analystTargetPrice && (
            <div className="rounded-lg p-3 space-y-1" style={{ background: 'var(--bg-subtle)' }}>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--text-2)' }}>Analyst Target</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                  {formatCurrency(quote.analystTargetPrice)}
                </span>
              </div>
              {upside !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: 'var(--text-2)' }}>Implied Upside</span>
                  <span className="text-sm font-semibold" style={{ color: upside > 0 ? '#10b981' : '#ef4444' }}>
                    {upside > 0 ? '+' : ''}{upside.toFixed(1)}%
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--text-2)' }}>Consensus</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: ratingColors[getAnalystRatingLabel(quote.analystRating)] ?? 'var(--text-2)' }}
                >
                  {getAnalystRatingLabel(quote.analystRating)}
                </span>
              </div>
            </div>
          )}

          <div className="text-xs italic" style={{ color: 'var(--text-3)' }}>
            {company.description}
          </div>
        </div>
      )}
    </div>
  );
}
