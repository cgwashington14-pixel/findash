'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, BarChart2, TrendingUp, Scale, Shield } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  icon: React.ElementType;
  accentColor: string;
  summary: string;
  content: React.ReactNode;
}

function Accordion({ lesson }: { lesson: Lesson }) {
  const [open, setOpen] = useState(false);
  const Icon = lesson.icon;

  return (
    <div
      className="rounded-xl overflow-hidden border transition-colors"
      style={{ background: 'var(--bg-card)', borderColor: open ? 'var(--border-md)' : 'var(--border)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: lesson.accentColor + '20', color: lesson.accentColor }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold" style={{ color: 'var(--text-1)' }}>{lesson.title}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{lesson.summary}</div>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'var(--text-3)' }} />
          : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--text-3)' }} />}
      </button>
      {open && (
        <div
          className="px-5 pb-5 border-t pt-4 text-sm leading-relaxed space-y-3"
          style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
        >
          {lesson.content}
        </div>
      )}
    </div>
  );
}

function MetricRow({ label, desc, good, bad }: { label: string; desc: string; good: string; bad: string }) {
  return (
    <div className="rounded-lg p-3 space-y-1" style={{ background: 'var(--bg-subtle)' }}>
      <div className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>{label}</div>
      <p className="text-xs" style={{ color: 'var(--text-2)' }}>{desc}</p>
      <div className="text-xs text-emerald-500">✓ {good}</div>
      <div className="text-xs" style={{ color: '#f97316', opacity: 0.85 }}>⚠ {bad}</div>
    </div>
  );
}

function TwoCol({ a, b }: { a: { title: string; color: string; bg: string; border: string; points: string[] }; b: typeof a }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[a, b].map(col => (
        <div key={col.title} className="rounded-lg p-4 border" style={{ background: col.bg, borderColor: col.border }}>
          <div className="font-bold mb-2" style={{ color: col.color }}>{col.title}</div>
          <ul className="text-xs space-y-1.5 list-disc list-inside" style={{ color: 'var(--text-2)' }}>
            {col.points.map(p => <li key={p}>{p}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

const LESSONS: Lesson[] = [
  {
    id: 'pe',
    title: "P/E Ratio — The Market's Expectations Meter",
    icon: BarChart2,
    accentColor: '#3b82f6',
    summary: 'The most-cited valuation multiple. Learn when it matters and when it misleads.',
    content: (
      <div className="space-y-3">
        <p>The <strong style={{ color: 'var(--text-1)' }}>Price-to-Earnings (P/E) ratio</strong> divides a stock&apos;s current price by its earnings per share. A P/E of 25 means investors pay $25 for every $1 of profit.</p>
        <div className="rounded-lg p-3" style={{ background: 'rgba(59,130,246,0.08)', borderLeft: '3px solid #3b82f6' }}>
          <div className="text-xs font-semibold text-blue-500 mb-1">Formula</div>
          <code className="text-sm" style={{ color: 'var(--text-1)' }}>P/E = Stock Price ÷ Earnings Per Share (EPS)</code>
        </div>
        <p><strong style={{ color: 'var(--text-1)' }}>Context matters.</strong> The S&P 500 historically trades 15–25x. Growth companies like NOW often trade at 50x+ because investors pay for future earnings. Value stocks like CVX may trade at 10–15x.</p>
        <TwoCol
          a={{ title: 'Low P/E Signals', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', points: ['Potentially undervalued vs. peers', 'Mature/stable business', 'Market may be overlooking it'] }}
          b={{ title: 'High P/E Signals', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', points: ['High growth expectations priced in', 'Any earnings miss = large drop', "May not be 'expensive' if growth delivers"] }}
        />
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>Watch out: unprofitable companies have no P/E. Use P/S ratio instead for high-growth companies with thin or negative margins.</p>
      </div>
    ),
  },
  {
    id: 'marketcap',
    title: 'Market Capitalization — Company Size at a Glance',
    icon: Scale,
    accentColor: '#a855f7',
    summary: "Understand what market cap actually tells you — and what it doesn't.",
    content: (
      <div className="space-y-3">
        <p><strong style={{ color: 'var(--text-1)' }}>Market cap</strong> = share price × shares outstanding. It&apos;s the market&apos;s real-time verdict on what a company is worth.</p>
        <div className="rounded-lg p-3" style={{ background: 'rgba(168,85,247,0.08)', borderLeft: '3px solid #a855f7' }}>
          <div className="text-xs font-semibold text-purple-500 mb-1">Formula</div>
          <code className="text-sm" style={{ color: 'var(--text-1)' }}>Market Cap = Share Price × Shares Outstanding</code>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { label: 'Mega Cap', range: '> $200B', example: 'Salesforce, Chevron' },
            { label: 'Large Cap', range: '$10B–$200B', example: 'ServiceNow, Costco' },
            { label: 'Mid Cap', range: '$2B–$10B', example: 'DocuSign, e.l.f.' },
            { label: 'Small Cap', range: '< $2B', example: 'Cheesecake Factory' },
          ].map(c => (
            <div key={c.label} className="rounded-lg p-2 space-y-0.5" style={{ background: 'var(--bg-subtle)' }}>
              <div className="font-semibold" style={{ color: 'var(--text-1)' }}>{c.label}</div>
              <div style={{ color: 'var(--text-2)' }}>{c.range}</div>
              <div style={{ color: 'var(--text-3)' }}>{c.example}</div>
            </div>
          ))}
        </div>
        <p>Larger caps = more stability, less explosive growth potential. Smaller caps = more upside but more volatility and liquidity risk.</p>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}><strong style={{ color: 'var(--text-2)' }}>Market cap ≠ company value.</strong> Enterprise Value (EV) adds debt and subtracts cash for a more complete picture — especially relevant when comparing companies with different capital structures.</p>
      </div>
    ),
  },
  {
    id: 'growth-vs-value',
    title: 'Growth vs Value Investing',
    icon: TrendingUp,
    accentColor: '#10b981',
    summary: 'Two philosophies, both proven. Know which lens to apply to each company.',
    content: (
      <div className="space-y-3">
        <TwoCol
          a={{ title: 'Growth Investing', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', points: ['Pay premium P/E for high future earnings growth', 'Revenue growth matters more than current profits', 'P/S, EV/Revenue key metrics', 'Examples: AMD, Micron, e.l.f. Beauty, DocuSign'] }}
          b={{ title: 'Value Investing', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', points: ['Buy below intrinsic value — "margin of safety"', 'Profits, cash flow, and dividends matter now', 'P/E, P/B, dividend yield key metrics', 'Examples: Chevron, Costco, Cheesecake Factory'] }}
        />
        <p>Neither approach is universally better. Growth outperforms in bull markets; value tends to hold up better in downturns. Many investors blend both: buying quality growth companies at reasonable prices (GARP — Growth at a Reasonable Price).</p>
        <p><strong style={{ color: 'var(--text-1)' }}>The risk:</strong> Growth stocks can drop 40–70% when earnings disappoint. Value traps exist when cheap stocks keep getting cheaper because the business is declining.</p>
      </div>
    ),
  },
  {
    id: 'key-ratios',
    title: 'Key Financial Ratios Cheat Sheet',
    icon: Lightbulb,
    accentColor: '#f59e0b',
    summary: 'Quick-reference guide to every ratio shown on this dashboard.',
    content: (
      <div className="space-y-2">
        <MetricRow label="P/E (Price-to-Earnings)" desc="Price ÷ EPS. How much you pay per $1 of profit." good="Lower P/E vs. peers may indicate value" bad="Meaningless for unprofitable companies" />
        <MetricRow label="Forward P/E" desc="Price ÷ next-12-month expected EPS. More forward-looking." good="Lower than trailing P/E = earnings expected to grow" bad="Based on analyst estimates that are often optimistic" />
        <MetricRow label="P/S (Price-to-Sales)" desc="Market cap ÷ annual revenue. Used when profits are thin." good="Useful for pre-profit growth companies" bad="Doesn't account for margins — high sales ≠ high value" />
        <MetricRow label="P/B (Price-to-Book)" desc="Price ÷ book value (assets − liabilities per share)." good="Below 1.0 means buying assets at a discount" bad="Intangible assets (brand, software) are often excluded" />
        <MetricRow label="Debt/Equity" desc="Total debt ÷ shareholder equity. Measures leverage." good="< 0.5 generally safe; lower is more conservative" bad="> 2.0 is high risk — especially if rates are rising" />
        <MetricRow label="Revenue Growth (YoY)" desc="Year-over-year revenue change. The growth engine." good="> 20% YoY is strong for mid/large cap companies" bad="Slowing growth usually leads to multiple compression" />
        <MetricRow label="Free Cash Flow (FCF)" desc="Cash from operations minus capex. Real cash the business generates." good="Positive FCF = self-funded, healthy business" bad="Negative FCF is fine for early-stage growth, worrisome for mature cos" />
      </div>
    ),
  },
  {
    id: 'risk',
    title: 'Understanding Investment Risk',
    icon: Shield,
    accentColor: '#ef4444',
    summary: "Risk isn't just volatility — learn how to think about multiple dimensions.",
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Market Risk', desc: "Broad market downturns affect all stocks. Diversification helps but doesn't eliminate it." },
            { label: 'Business Risk', desc: 'Company-specific: competition, management, product failure. Research mitigates this.' },
            { label: 'Valuation Risk', desc: "Overpaying for a stock even if the business is great. A $200 stock at P/E 100x can drop to P/E 50x without any business change." },
            { label: 'Liquidity Risk', desc: 'Smaller stocks (CAKE, ELF) trade fewer shares daily. Large orders can move the price against you.' },
            { label: 'Concentration Risk', desc: 'Putting too much of a portfolio in one stock or sector. Sector diversification is key.' },
            { label: 'Macro Risk', desc: 'Interest rates, inflation, recession. Tech stocks are especially sensitive to rate changes.' },
          ].map(r => (
            <div key={r.label} className="rounded-lg p-3" style={{ background: 'var(--bg-subtle)' }}>
              <div className="font-semibold text-xs mb-1" style={{ color: 'var(--text-1)' }}>{r.label}</div>
              <p className="text-xs" style={{ color: 'var(--text-2)' }}>{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg p-3 text-xs border" style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.30)', color: 'var(--text-2)' }}>
          <strong style={{ color: '#ca8a04' }}>Rule of thumb:</strong> Never invest money you might need within 1–3 years in individual stocks. Higher potential return = higher potential loss.
        </div>
      </div>
    ),
  },
  {
    id: 'dcf',
    title: 'Discounted Cash Flow (DCF) — The Gold Standard',
    icon: TrendingUp,
    accentColor: '#06b6d4',
    summary: 'The intrinsic value method used by professional analysts everywhere.',
    content: (
      <div className="space-y-3">
        <p>A <strong style={{ color: 'var(--text-1)' }}>DCF</strong> estimates intrinsic value by projecting future cash flows and discounting them back to today&apos;s dollars — because a dollar in the future is worth less than a dollar today.</p>
        <div className="rounded-lg p-3" style={{ background: 'rgba(6,182,212,0.08)', borderLeft: '3px solid #06b6d4' }}>
          <div className="text-xs font-semibold text-cyan-500 mb-2">Simplified Steps</div>
          <ol className="space-y-1.5 text-xs list-decimal list-inside" style={{ color: 'var(--text-2)' }}>
            <li>Forecast free cash flow for the next 5–10 years</li>
            <li>Estimate a terminal value (business worth after year 10)</li>
            <li>Discount all future cash flows back using WACC</li>
            <li>Divide total by shares outstanding → intrinsic value per share</li>
            <li>Compare to current price → margin of safety</li>
          </ol>
        </div>
        <p><strong style={{ color: 'var(--text-1)' }}>Garbage in, garbage out.</strong> Small changes in growth rate or discount rate dramatically change the result. Always run a range of scenarios (bear, base, bull).</p>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>Shortcut: if a stock&apos;s P/E ≈ its earnings growth rate (PEG ≈ 1.0), it may be fairly valued. Below 1.0 suggests potential undervaluation relative to growth.</p>
      </div>
    ),
  },
];

export default function EducationPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-yellow-500" />
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-1)' }}>Education Center</h1>
        </div>
        <p className="text-sm max-w-2xl" style={{ color: 'var(--text-2)' }}>
          Build your financial literacy. Click any lesson to expand it. These concepts directly apply to the
          metrics you see on the Dashboard.
        </p>
      </div>

      <div
        className="rounded-xl p-4 mb-6 text-sm border"
        style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.30)', color: 'var(--text-2)' }}
      >
        <strong style={{ color: '#ca8a04' }}>Disclaimer:</strong> Educational content only — not financial advice.
        All investing involves risk. Consult a licensed financial advisor before making investment decisions.
      </div>

      <div className="space-y-3">
        {LESSONS.map(lesson => <Accordion key={lesson.id} lesson={lesson} />)}
      </div>

      {/* Glossary */}
      <div
        className="mt-10 rounded-xl p-6 border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-1)' }}>Quick Glossary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {[
            ['EPS',        'Earnings Per Share — net income divided by shares outstanding'],
            ['WACC',       'Weighted Average Cost of Capital — rate used to discount future cash flows'],
            ['TTM',        'Trailing Twelve Months — the most recent 12-month period'],
            ['YoY',        'Year-over-Year — comparing this year to the same period last year'],
            ['Bull Market','Sustained period of rising prices (20%+ from a recent low)'],
            ['Bear Market','Sustained period of falling prices (20%+ decline from a recent high)'],
            ['Volatility', "How much a stock's price swings — higher volatility = higher risk + reward potential"],
            ['Div Yield',  'Annual dividend per share ÷ stock price. Income return on investment'],
            ['Short Squeeze','When heavily shorted stocks surge, forcing short sellers to buy at higher prices'],
            ['TAM',        'Total Addressable Market — total revenue opportunity for a product/service'],
          ].map(([term, def]) => (
            <div key={term} className="flex gap-2">
              <span className="text-blue-500 font-semibold shrink-0 w-28">{term}</span>
              <span style={{ color: 'var(--text-2)' }}>{def}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
