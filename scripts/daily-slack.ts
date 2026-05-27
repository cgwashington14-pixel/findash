#!/usr/bin/env node
/**
 * Run this script via cron to post a daily digest to Slack at 6 PM:
 *
 *   crontab -e
 *   0 18 * * * /usr/local/bin/node /Users/coreywashington/Finance\ Project/scripts/daily-slack.js
 *
 * Or, if the Next.js dev server is running, just hit the API:
 *   0 18 * * * curl -s -X POST http://localhost:3000/api/slack
 */

import 'dotenv/config';

async function main() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${base}/api/slack`, { method: 'POST' });
  const data = await res.json();
  if (data.ok) {
    console.log('[FinDash] Daily digest posted to Slack successfully.');
  } else {
    console.error('[FinDash] Slack post failed:', data.error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
