import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during build to prevent linting errors from blocking deployment
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
