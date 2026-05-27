// Shared types — safe to import anywhere

export interface NewsItem {
  ticker: string;
  companyName: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  pubDate: string;
  guid: string;
}

export interface StockQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number | null;
  forwardPE: number | null;
  priceToSales: number | null;
  priceToBook: number | null;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  eps: number | null;
  revenueGrowth: number | null;
  debtToEquity: number | null;
  freeCashflow: number | null;
  analystTargetPrice: number | null;
  analystRating: string | null;
  volume: number;
  avgVolume: number;
  currency: string;
}
