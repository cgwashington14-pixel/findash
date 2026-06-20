/**
 * Standalone daily Slack digest — no dev server required.
 * Used by Cursor Automations and manual cron runs.
 *
 * Requires SLACK_BOT_TOKEN in the environment (Cursor Cloud secrets or .env.local locally).
 */
import { fetchAllNews } from '../lib/news';
import { postDailyDigest } from '../lib/slack';

async function main() {
  const result = await postDailyDigest(await fetchAllNews());
  if (result.ok) {
    console.log('[FinDash] Daily digest posted to Slack successfully.');
    return;
  }
  console.error('[FinDash] Slack post failed:', result.error);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
