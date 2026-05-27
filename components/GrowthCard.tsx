'use client';

import { TrendingUp, AlertTriangle, Target, ExternalLink } from 'lucide-react';
import type { Company } from '@/lib/constants';
import type { StockQuote } from '@/lib/types';
import { formatMarketCap, formatCurrency } from '@/lib/format';

interface GrowthCardProps {
  company: Company;
  quote: StockQuote | null;
}

const RISK_CONFIG = {
  Low:    { color: '#10b981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.30)' },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)' },
  High:   { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.30)'  },
};

export default function GrowthCard({ company, quote }: GrowthCardProps) {
  const risk = company.riskRating ?? 'Medium';
  const rc = RISK_CONFIG[risk];
  const changePositive = (quote?.changePercent ?? 0) >= 0;

  const upside = quote?.analystTargetPrice && quote?.price
    ? ((quote.analystTargetPrice - quote.price) / quote.price) * 100
    : null;

  const revenueGrowthPct = quote?.revenueGrowth !== null && quote?.revenueGrowth !== undefined
    ? (quote.revenueGrowth * 100).toFixed(1)
    : null;

  return (
    <div
      className="rounded-xl overflow-hidden border transition-colors"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-500">
                {company.ticker}
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded border"
                style={{ background: rc.bg, color: rc.color, borderColor: rc.border }}
              >
                {risk} Risk
              </span>
            </div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-1)' }}>{company.name}</h3>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>{company.sector}</p>
          </div>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-3)' }}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Price */}
        {quote ? (
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold" style={{ color: 'var(--text-1)' }}>
              {formatCurrency(quote.price)}
            </span>
            <span className="text-sm font-semibold" style={{ color: changePositive ? '#10b981' : '#ef4444' }}>
              {changePositive ? '▲' : '▼'} {Math.abs(quote.changePercent).toFixed(2)}%
            </span>
          </div>
        ) : (
          <div className="h-9 rounded animate-pulse mb-4" style={{ background: 'var(--bg-subtle)' }} />
        )}

        {/* Key Growth Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Market Cap', value: quote ? formatMarketCap(quote.marketCap) : '—', color: 'var(--text-1)' },
            {
              label: 'Rev Growth YoY',
              value: revenueGrowthPct ? `+${revenueGrowthPct}%` : '—',
              color: revenueGrowthPct && parseFloat(revenueGrowthPct) > 0 ? '#10b981' : 'var(--text-1)',
            },
            {
              label: 'P/S Ratio',
              value: quote?.priceToSales != null ? `${quote.priceToSales.toFixed(1)}x` : '—',
              color: 'var(--text-1)',
            },
            {
              label: 'Analyst Upside',
              value: upside !== null ? `${upside > 0 ? '+' : ''}${upside.toFixed(1)}%` : '—',
              color: upside !== null && upside > 0 ? '#10b981' : 'var(--text-1)',
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg p-3" style={{ background: 'var(--bg-subtle)' }}>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>
                {label}
              </div>
              <div className="font-semibold text-sm" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* TAM */}
        {company.tam && (
          <div
            className="flex items-start gap-2 mb-3 rounded-lg p-3 border"
            style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.25)' }}
          >
            <Target className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5 text-blue-500">
                Total Addressable Market
              </div>
              <div className="text-sm" style={{ color: 'var(--text-1)' }}>{company.tam}</div>
            </div>
          </div>
        )}

        {/* Thesis */}
        {company.thesis && (
          <div
            className="flex items-start gap-2 mb-3 rounded-lg p-3 border"
            style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' }}
          >
            <TrendingUp className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5 text-emerald-500">
                Investment Thesis
              </div>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--text-1)' }}>{company.thesis}</div>
            </div>
          </div>
        )}

        {/* Risk note */}
        <div
          className="flex items-start gap-2 rounded-lg p-3 border"
          style={{ background: rc.bg, borderColor: rc.border }}
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: rc.color }} />
          <div className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
            <span className="font-semibold" style={{ color: rc.color }}>{risk} Risk: </span>
            {risk === 'High' && 'High volatility expected. Growth stocks can swing 30–50%+ in either direction. Size positions appropriately.'}
            {risk === 'Medium' && 'Moderate risk profile. Monitor earnings and macro conditions closely. Diversify within sector.'}
            {risk === 'Low' && 'Relatively stable with lower drawdown risk. Still subject to market conditions and sector headwinds.'}
          </div>
        </div>
      </div>
    </div>
  );
}
