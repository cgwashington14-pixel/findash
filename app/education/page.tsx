'use client';

import { useState } from 'react';

interface Lesson { id: string; title: string; tag: string; body: React.ReactNode; }

function Row({ lesson }: { lesson: Lesson }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <div className="flex items-center gap-5">
          <span className="label w-24 shrink-0" style={{ color: 'var(--accent)' }}>{lesson.tag}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{lesson.title}</span>
        </div>
        <span className="mono text-xs transition-transform" style={{ color: 'var(--text-3)', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <div className="pb-6 pl-[7.25rem] pr-4">
          <div className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{lesson.body}</div>
        </div>
      )}
    </div>
  );
}

function Hl({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: 'var(--text-1)', fontWeight: 600 }}>{children}</strong>;
}
function Accent({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{children}</span>;
}
function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 p-3 text-xs" style={{ background: 'var(--bg-subtle)', borderLeft: '2px solid var(--accent)', fontFamily: 'monospace', color: 'var(--text-2)' }}>
      {children}
    </div>
  );
}

const LESSONS: Lesson[] = [
  {
    id: 'pe', tag: 'VALUATION', title: "P/E Ratio — What You're Paying per Dollar of Profit",
    body: (<>
      <p className="mb-3">Divide the stock price by earnings per share. A P/E of 25 means investors pay <Accent>$25</Accent> for every <Accent>$1</Accent> of profit. It's the market's price tag for future expectations.</p>
      <Block>P/E = Share Price ÷ Earnings Per Share (EPS)</Block>
      <p className="mb-2">Context matters enormously. The S&P 500 historically trades at 15–25×. Software companies like ServiceNow trade at 50×+ because investors pay for future growth, not today's profits.</p>
      <p><Hl>Low P/E</Hl> — may signal value, mature business, or a company the market is ignoring. <Hl>High P/E</Hl> — high expectations baked in; any miss on earnings creates outsized drops. Unprofitable companies have no P/E at all — use P/S ratio instead.</p>
    </>),
  },
  {
    id: 'mktcap', tag: 'SIZE', title: 'Market Cap — The Market\'s Verdict on Company Size',
    body: (<>
      <p className="mb-3">Share price multiplied by total shares outstanding. It tells you what the market currently values the entire business at — not what it&apos;s actually worth.</p>
      <Block>Market Cap = Share Price × Shares Outstanding</Block>
      <p className="mb-3">Size buckets: <Accent>Mega (&gt;$200B)</Accent> — Salesforce, Chevron. <Accent>Large ($10–200B)</Accent> — ServiceNow, Costco. <Accent>Mid ($2–10B)</Accent> — DocuSign, e.l.f. <Accent>Small (&lt;$2B)</Accent> — Cheesecake Factory.</p>
      <p>Larger caps are generally more stable; smaller caps have more upside but more volatility. <Hl>Market cap ≠ enterprise value</Hl> — EV adds debt and subtracts cash, giving a cleaner comparison between companies with different capital structures.</p>
    </>),
  },
  {
    id: 'gvv', tag: 'STRATEGY', title: 'Growth vs. Value — Two Lenses, Both Valid',
    body: (<>
      <p className="mb-3"><Hl>Growth investing</Hl> pays a premium P/E for companies expanding revenue fast — even at the expense of current profits. Revenue growth rate, P/S, and TAM matter more than dividends. AMD, Micron, e.l.f., DocuSign fit this mold.</p>
      <p className="mb-3"><Hl>Value investing</Hl> hunts for companies trading below intrinsic worth — the "margin of safety." P/E, P/B, dividend yield, and free cash flow are central. Chevron, Costco, and Cheesecake Factory lean here.</p>
      <p>Neither always wins. Growth outperforms in bull markets and rate-cut cycles; value holds up better in downturns. Many investors blend both via <Accent>GARP</Accent> — Growth at a Reasonable Price — buying quality growth companies when their multiples compress.</p>
    </>),
  },
  {
    id: 'ratios', tag: 'RATIOS', title: 'Key Ratios — Quick Reference',
    body: (
      <div className="space-y-3">
        {[
          ['P/E',         'Price ÷ EPS. Earnings multiple. Meaningless for unprofitable companies.'],
          ['Forward P/E', 'Price ÷ next-12-month est. EPS. More forward-looking; based on analyst forecasts.'],
          ['P/S',         'Market cap ÷ revenue. Best for pre-profit growth companies.'],
          ['P/B',         'Price ÷ book value. Below 1× means buying assets at a discount.'],
          ['Debt/Equity', 'Total debt ÷ equity. Under 0.5× is conservative; above 2× is high risk.'],
          ['Rev Growth',  'Year-over-year revenue change. The core growth engine signal.'],
          ['FCF Yield',   'Free cash flow ÷ market cap. Measures real cash return to investors.'],
        ].map(([label, desc]) => (
          <div key={label} className="flex gap-4">
            <span className="mono text-xs shrink-0 w-24" style={{ color: 'var(--accent)' }}>{label}</span>
            <span className="text-xs" style={{ color: 'var(--text-2)' }}>{desc}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'risk', tag: 'RISK', title: 'Risk — It\'s Multi-Dimensional',
    body: (
      <div className="space-y-3">
        {[
          ['Market Risk',       "Broad downturns drag everything down. Diversification helps but can't eliminate it."],
          ['Business Risk',     'Company-specific: competition, management, product failure. Research is your defense.'],
          ['Valuation Risk',    'Overpaying is a risk even for great businesses. A stock at P/E 100× can drop to 50× with zero business deterioration.'],
          ['Concentration Risk','Too much in one stock or sector. A 50% position in AMD is a high-volatility bet.'],
          ['Macro Risk',        'Interest rates, inflation, recession. Growth stocks are especially rate-sensitive — higher rates reduce the present value of future earnings.'],
        ].map(([label, desc]) => (
          <div key={label} className="flex gap-4">
            <span className="mono text-xs shrink-0 w-36" style={{ color: 'var(--neg)' }}>{label}</span>
            <span className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{desc as string}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'dcf', tag: 'MODELS', title: 'DCF — Discounted Cash Flow, the Gold Standard',
    body: (<>
      <p className="mb-3">Estimates intrinsic value by projecting future free cash flows and discounting them to today&apos;s dollars — because $100 in five years is worth less than $100 today.</p>
      <Block>
        1. Forecast FCF for next 5–10 years{'\n'}
        2. Estimate terminal value (what the business is worth after year 10){'\n'}
        3. Discount using WACC (your required rate of return){'\n'}
        4. Divide by shares outstanding → intrinsic value per share{'\n'}
        5. Compare to market price → margin of safety
      </Block>
      <p><Hl>Garbage in, garbage out.</Hl> Small changes in growth rate or discount rate produce wildly different outputs. Always model a bear, base, and bull scenario. A faster shortcut: if <Accent>PEG ratio ≈ 1.0</Accent> (P/E divided by growth rate), the stock may be fairly valued. Below 1.0 suggests undervaluation relative to growth.</p>
    </>),
  },
];

const GLOSSARY = [
  ['EPS',         'Earnings Per Share — net income ÷ shares outstanding'],
  ['WACC',        'Weighted Average Cost of Capital — discount rate for future cash flows'],
  ['TTM',         'Trailing Twelve Months — most recent 12-month period'],
  ['YoY',         'Year-over-Year — comparing to the same period last year'],
  ['Bull Market', 'Sustained price rise of 20%+ from a recent low'],
  ['Bear Market', 'Sustained price decline of 20%+ from a recent high'],
  ['Volatility',  "How much a stock's price swings — higher = higher risk and reward"],
  ['Short Squeeze','Heavily shorted stocks surge, forcing short sellers to buy at higher prices'],
  ['TAM',         'Total Addressable Market — total revenue opportunity for a product'],
  ['GARP',        'Growth at a Reasonable Price — blends growth and value approaches'],
];

export default function EducationPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-8" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <h1 className="mono font-bold text-2xl tracking-tight mb-1" style={{ color: 'var(--text-1)' }}>Learn</h1>
        <p className="text-xs" style={{ color: 'var(--text-2)' }}>
          Financial concepts explained simply — tied directly to what you see on the dashboard.
        </p>
      </div>

      {/* Disclaimer */}
      <p className="label mb-8" style={{ color: 'var(--text-3)' }}>
        Educational content only · Not financial advice · Consult a licensed advisor before investing
      </p>

      {/* Accordion lessons */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        {LESSONS.map(lesson => <Row key={lesson.id} lesson={lesson} />)}
      </div>

      {/* Glossary */}
      <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="label block mb-6">GLOSSARY</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
          {GLOSSARY.map(([term, def]) => (
            <div key={term} className="flex gap-3">
              <span className="mono text-xs shrink-0 w-24" style={{ color: 'var(--accent)' }}>{term}</span>
              <span className="text-xs" style={{ color: 'var(--text-2)' }}>{def}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
