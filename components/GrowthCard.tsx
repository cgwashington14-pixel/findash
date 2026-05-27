'use client';

import type { Company } from '@/lib/constants';
import type { StockQuote } from '@/lib/types';
import { formatMarketCap, formatCurrency } from '@/lib/format';
import { ArrowUpRight } from 'lucide-react';

const RISK_COLOR = { Low: 'var(--pos)', Medium: '#f59e0b', High: 'var(--neg)' };

export default function GrowthCard({ company, quote }: { company: Company; quote: StockQuote | null }) {
  const risk = company.riskRating ?? 'Medium';
  const up = (quote?.changePercent ?? 0) >= 0;
  const upside = quote?.analystTargetPrice && quote?.price
    ? ((quote.analystTargetPrice - quote.price) / quote.price) * 100 : null;
  const revG = quote?.revenueGrowth != null ? (quote.revenueGrowth * 100).toFixed(1) : null;

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      {/* Accent top bar */}
      <div style={{ height: '2px', background: 'var(--accent)' }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mono font-bold text-3xl tracking-tight transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--text-1)' }}
            >
              {company.ticker}
            </a>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>{company.name}</p>
            <p className="label mt-1" style={{ color: 'var(--text-3)' }}>{company.sector}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="label" style={{ color: RISK_COLOR[risk] }}>{risk.toUpperCase()} RISK</span>
            <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-3)' }}>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Price */}
        {quote ? (
          <div className="flex items-baseline gap-3 mb-5">
            <span className="mono font-semibold text-2xl" style={{ color: 'var(--text-1)' }}>
              {formatCurrency(quote.price)}
            </span>
            <span className="mono text-sm font-medium" style={{ color: up ? 'var(--pos)' : 'var(--neg)' }}>
              {up ? '+' : ''}{quote.changePercent.toFixed(2)}%
            </span>
          </div>
        ) : (
          <div className="h-8 w-32 animate-pulse mb-5" style={{ background: 'var(--bg-subtle)' }} />
        )}

        {/* Metrics grid */}
        <div
          className="grid grid-cols-2 gap-px mb-5"
          style={{ background: 'var(--border)' }}
        >
          {[
            { label: 'Mkt Cap',    value: quote ? formatMarketCap(quote.marketCap) : '—', color: 'var(--text-1)' },
            { label: 'Rev Growth', value: revG ? `+${revG}%` : '—', color: revG && parseFloat(revG) > 0 ? 'var(--pos)' : 'var(--text-1)' },
            { label: 'P/S Ratio',  value: quote?.priceToSales != null ? `${quote.priceToSales.toFixed(1)}×` : '—', color: 'var(--text-1)' },
            { label: 'Upside',     value: upside != null ? `${upside > 0 ? '+' : ''}${upside.toFixed(1)}%` : '—', color: upside != null && upside > 0 ? 'var(--pos)' : 'var(--text-1)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-3" style={{ background: 'var(--bg-subtle)' }}>
              <span className="label block mb-1">{label}</span>
              <span className="mono text-sm font-medium" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>

        {/* TAM */}
        {company.tam && (
          <div className="mb-4">
            <span className="label block mb-1.5" style={{ color: 'var(--accent)' }}>TAM</span>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{company.tam}</p>
          </div>
        )}

        {/* Thesis */}
        {company.thesis && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <span className="label block mb-1.5">Thesis</span>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{company.thesis}</p>
          </div>
        )}
      </div>
    </div>
  );
}
