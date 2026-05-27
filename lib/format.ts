// Pure formatting utilities — safe to import in client components

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function get52WeekPosition(price: number, low: number, high: number): number {
  if (high === low) return 50;
  return Math.round(((price - low) / (high - low)) * 100);
}

export function getAnalystRatingLabel(key: string | null): string {
  const map: Record<string, string> = {
    strongBuy: 'Strong Buy',
    buy: 'Buy',
    hold: 'Hold',
    sell: 'Sell',
    strongSell: 'Strong Sell',
  };
  return key ? (map[key] ?? key) : 'N/A';
}

export function getAnalystRatingColor(key: string | null): string {
  if (!key) return 'text-gray-400';
  if (key === 'strongBuy' || key === 'buy') return 'text-emerald-400';
  if (key === 'hold') return 'text-yellow-400';
  return 'text-red-400';
}
