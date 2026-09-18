import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Do NOT use output: "standalone" on Vercel — Vercel uses its own build system.
  // outputFileTracingIncludes only applies to standalone mode; handled via db.ts for Vercel.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

