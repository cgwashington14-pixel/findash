import type { Company } from './constants';
import type { StockQuote } from './types';
import { formatCurrency } from './format';

/* ── helpers ─────────────────────────────────────────────── */

function pctMagnitude(abs: number): string {
  if (abs >= 6)  return 'a sharp swing';
  if (abs >= 4)  return 'a significant move';
  if (abs >= 2)  return 'a notable move';
  if (abs >= 1)  return 'a moderate session';
  return 'a quiet, range-bound session';
}

function rangeContext(price: number, low52: number, high52: number): string {
  const range = high52 - low52;
  if (range <= 0) return '';
  const pos = (price - low52) / range; // 0 = at 52w low, 1 = at 52w high
  if (pos >= 0.95) return `, hovering near its 52-week high of ${formatCurrency(high52)}`;
  if (pos <= 0.05) return `, trading near its 52-week low of ${formatCurrency(low52)}`;
  if (pos >= 0.80) return `, approaching the upper end of its 52-week range`;
  if (pos <= 0.20) return `, near the lower end of its 52-week range`;
  return '';
}

function volSentence(volume: number, avgVolume: number, changePercent: number): string {
  const volM  = (volume / 1_000_000).toFixed(1);
  const avgM  = (avgVolume / 1_000_000).toFixed(1);
  const ratio = avgVolume > 0 ? volume / avgVolume : 1;
  const up    = changePercent >= 0;

  if (ratio >= 2.0) {
    const implication = up
      ? 'pointing to strong buyer conviction behind the rally'
      : 'a potential distribution signal worth monitoring';
    return `Volume surged to ${volM}M shares — more than twice the ${avgM}M daily average — ${implication}.`;
  }
  if (ratio >= 1.4) {
    const note = up ? 'supporting the upside move' : 'amplifying the selling pressure';
    return `Volume ran above average at ${volM}M shares versus the typical ${avgM}M, ${note}.`;
  }
  if (ratio >= 0.85) {
    return `Volume tracked near its daily average at ${volM}M shares, reflecting orderly, balanced trading conditions.`;
  }
  if (ratio >= 0.5) {
    const note = up
      ? 'suggesting the gain may lack broad-based conviction'
      : 'indicating the weakness was not accompanied by heavy selling pressure';
    return `Volume was lighter than usual at ${volM}M shares versus the ${avgM}M average, ${note}.`;
  }
  return `Volume was notably subdued at ${volM}M shares — well below the ${avgM}M average — signaling limited market participation.`;
}

function valuationSentence(ticker: string, quote: StockQuote): string {
  // Priority: analyst target > forward P/E > trailing P/E > P/S
  if (quote.analystTargetPrice && quote.price && quote.analystTargetPrice > 0) {
    const upside  = ((quote.analystTargetPrice - quote.price) / quote.price) * 100;
    const dir     = upside >= 0 ? 'upside' : 'downside';
    const rating  = quote.analystRating ?? 'Hold';
    return `Analyst consensus rates ${ticker} a ${rating} with a price target of ${formatCurrency(quote.analystTargetPrice)}, implying ${Math.abs(upside).toFixed(1)}% ${dir} from current levels.`;
  }

  if (quote.forwardPE != null && quote.forwardPE > 0 && quote.forwardPE < 500) {
    let context: string;
    if (quote.forwardPE > 60)      context = 'a premium multiple reflecting elevated growth expectations';
    else if (quote.forwardPE > 30) context = 'above the S&P 500 average, pricing in continued earnings growth';
    else if (quote.forwardPE > 18) context = 'broadly in line with the broader market';
    else                           context = 'a value-tilted multiple relative to the market';
    return `On a forward P/E of ${quote.forwardPE.toFixed(1)}×, ${ticker} carries ${context}.`;
  }

  if (quote.peRatio != null && quote.peRatio > 0 && quote.peRatio < 1000) {
    let context: string;
    if (quote.peRatio > 50)      context = 'well above market averages, pricing in significant future growth';
    else if (quote.peRatio > 25) context = 'at a modest premium to the broader market';
    else if (quote.peRatio > 15) context = 'roughly in line with the S&P 500 historical average';
    else                         context = 'a below-market multiple, reflecting value characteristics';
    return `${ticker} trades at ${quote.peRatio.toFixed(1)}× trailing earnings — ${context}.`;
  }

  if (quote.priceToSales != null && quote.priceToSales > 0) {
    return `Without trailing profits, ${ticker} is assessed on a P/S of ${quote.priceToSales.toFixed(1)}×, a metric investors use to gauge value relative to revenue scale.`;
  }

  return `${ticker} continues to trade on momentum and forward expectations, with investors focused on the company's ability to grow into its current valuation.`;
}

/* ── main export ─────────────────────────────────────────── */

export function generateRecap(company: Company, quote: StockQuote): string {
  const dir  = quote.changePercent >= 0 ? 'gained' : 'fell';
  const abs  = Math.abs(quote.changePercent);
  const pct  = abs.toFixed(2);
  const px   = formatCurrency(quote.price);

  // Sentence 1 — price action + 52-week context
  const magnitude = pctMagnitude(abs);
  const range     = rangeContext(quote.price, quote.fiftyTwoWeekLow, quote.fiftyTwoWeekHigh);
  const s1 = `${company.ticker} ${dir} ${pct}% to ${px}${range}, marking ${magnitude} for the ${company.sector} name.`;

  // Sentence 2 — volume with implication
  const s2 = volSentence(quote.volume, quote.avgVolume, quote.changePercent);

  // Sentence 3 — analyst target or valuation multiple
  const s3 = valuationSentence(company.ticker, quote);

  return `${s1} ${s2} ${s3}`;
}
