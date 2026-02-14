import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during build to prevent linting errors from blocking deployment
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/saved-ayahs',
        destination: '/profile/saved-ayahs',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
