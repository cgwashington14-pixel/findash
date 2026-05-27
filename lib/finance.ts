'server only';

/* eslint-disable @typescript-eslint/no-explicit-any */
import YahooFinanceClass from 'yahoo-finance2';
import type { StockQuote } from './types';
export type { StockQuote };

const yahooFinance = new (YahooFinanceClass as any)({ suppressNotices: ['yahooSurvey'] });

export async function fetchStockData(ticker: string): Promise<StockQuote | null> {
  try {
    const q: any = await yahooFinance.quote(ticker);
    if (!q) return null;

    let s: any = {};
    try {
      s = await yahooFinance.quoteSummary(ticker, {
        modules: ['summaryDetail', 'defaultKeyStatistics', 'financialData', 'recommendationTrend'],
      });
    } catch {
      // non-critical — continue with quote data only
    }

    const financial: any = s?.financialData ?? {};
    const keyStats: any = s?.defaultKeyStatistics ?? {};
    const detail: any = s?.summaryDetail ?? {};

    return {
      ticker,
      price: q.regularMarketPrice ?? 0,
      change: q.regularMarketChange ?? 0,
      changePercent: q.regularMarketChangePercent ?? 0,
      marketCap: q.marketCap ?? 0,
      peRatio: q.trailingPE ?? detail.trailingPE ?? null,
      forwardPE: q.forwardPE ?? null,
      priceToSales: keyStats.priceToSalesTrailing12Months ?? null,
      priceToBook: q.priceToBook ?? keyStats.priceToBook ?? null,
      dividendYield: detail.dividendYield ? detail.dividendYield * 100 : null,
      fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? 0,
      fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? 0,
      eps: q.epsTrailingTwelveMonths ?? null,
      revenueGrowth: financial.revenueGrowth ?? null,
      debtToEquity: financial.debtToEquity ?? null,
      freeCashflow: financial.freeCashflow ?? null,
      analystTargetPrice: financial.targetMeanPrice ?? null,
      analystRating: financial.recommendationKey ?? null,
      volume: q.regularMarketVolume ?? 0,
      avgVolume: q.averageDailyVolume3Month ?? 0,
      currency: q.currency ?? 'USD',
    };
  } catch {
    return null;
  }
}
