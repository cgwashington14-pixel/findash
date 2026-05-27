export type MarketStatus = 'OPEN' | 'PRE-MARKET' | 'AFTER-HOURS' | 'CLOSED';

export function getMarketStatus(): MarketStatus {
  const now  = new Date();
  const et   = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day  = et.getDay();          // 0=Sun, 6=Sat
  const mins = et.getHours() * 60 + et.getMinutes();

  if (day === 0 || day === 6) return 'CLOSED';
  if (mins >= 570 && mins <  960) return 'OPEN';        // 9:30–16:00
  if (mins >= 240 && mins <  570) return 'PRE-MARKET';  // 4:00–9:30
  if (mins >= 960 && mins < 1200) return 'AFTER-HOURS'; // 16:00–20:00
  return 'CLOSED';
}

export const STATUS_COLOR: Record<MarketStatus, string> = {
  'OPEN':        'var(--pos)',
  'PRE-MARKET':  '#f59e0b',
  'AFTER-HOURS': '#f59e0b',
  'CLOSED':      'var(--neg)',
};
