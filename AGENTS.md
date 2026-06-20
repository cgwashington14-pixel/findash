<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

FinDash is a Next.js 16 app. Cloud agents and automations should use the repo's `.cursor/environment.json` (`npm install` on boot).

### Daily Slack digest (scheduled automation)

When triggered to post the daily digest:

1. Confirm `SLACK_BOT_TOKEN` is set in the environment.
2. Run: `npm run daily-slack`
3. Exit 0 only if the script prints success. On failure, report the error text and do not retry more than once.

The digest posts to Slack channel `#finance-project`. The script fetches Yahoo Finance RSS headlines and does **not** require the Next.js dev server.

### Local development

- Dev server: `npm run dev` (port 3001)
- Lint: `npm run lint`
- Build: `npm run build`

### Required secrets (Cloud Agents dashboard)

| Variable | Purpose |
|----------|---------|
| `SLACK_BOT_TOKEN` | Slack Web API bot token for posting digests |

Optional: `NEXT_PUBLIC_BASE_URL` for dashboard links in Slack messages.
