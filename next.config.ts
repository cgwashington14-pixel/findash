import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['yahoo-finance2', 'rss-parser', '@slack/web-api'],
};

export default nextConfig;
