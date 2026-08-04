import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  // Ensure the Prisma query engine (custom output dir) is bundled into serverless functions
  outputFileTracingIncludes: {
    "/**/*": ["./app/generated/prisma/**/*"],
  },
};

export default nextConfig;
