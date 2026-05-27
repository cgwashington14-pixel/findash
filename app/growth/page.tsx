'use client';

import { useState, useEffect, useCallback } from 'react';
import { Zap, RefreshCw } from 'lucide-react';
import GrowthCard from '@/components/GrowthCard';
import { COMPANIES, GROWTH_TICKERS } from '@/lib/constants';
import type { StockQuote } from '@/lib/types';

export default function GrowthPage() {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(true);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks?tickers=${GROWTH_TICKERS.join(',')}`);
      const { data } = await res.json();
      const map: Record<string, StockQuote> = {};
      for (const q of data) if (q) map[q.ticker] = q;
      setQuotes(map);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const growthCompanies = COMPANIES.filter(c => GROWTH_TICKERS.includes(c.ticker));

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-6 h-6 text-purple-500" />
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-1)' }}>Growth Picks</h1>
            </div>
            <p className="text-sm max-w-2xl" style={{ color: 'var(--text-2)' }}>
              High-conviction growth opportunities with significant upside potential. These stocks carry higher
              volatility but offer outsized return potential tied to secular trends in AI, semiconductors, and
              consumer disruption.
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
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-xl p-4 mb-6 text-sm border"
        style={{
          background: 'rgba(234,179,8,0.08)',
          borderColor: 'rgba(234,179,8,0.30)',
          color: 'var(--text-2)',
        }}
      >
        <strong style={{ color: '#ca8a04' }}>Educational use only.</strong> Nothing here is financial advice.
        These are illustrative analyses for learning how to evaluate growth companies. Always do your own research
        and consult a licensed financial advisor before investing.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {growthCompanies.map(company => (
          <GrowthCard
            key={company.ticker}
            company={company}
            quote={quotes[company.ticker] ?? null}
          />
        ))}
      </div>

      {/* What makes a growth stock */}
      <div
        className="mt-10 rounded-xl p-6 border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-1)' }}>
          What makes these high-growth candidates?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { title: 'Revenue Growth > 15% YoY', desc: 'Growing top-line revenue rapidly indicates strong demand and expanding market share.' },
            { title: 'Large TAM', desc: 'A huge total addressable market means even small share gains can translate to major revenue.' },
            { title: 'Secular Tailwinds', desc: "Exposure to multi-year macro trends (AI, cloud, beauty democratization) that don't depend on economic cycles." },
          ].map(({ title, desc }) => (
            <div key={title} className="space-y-1">
              <div className="font-semibold text-purple-500">{title}</div>
              <p style={{ color: 'var(--text-2)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
