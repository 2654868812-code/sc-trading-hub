import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

// Only proxy to NestJS backend when BACKEND_URL is set (Docker production)
// In local dev, no rewrite → frontend handles /api/* via own SQLite routes
if (process.env.BACKEND_URL) {
  nextConfig.rewrites = async () => [
    { source: '/api/:path*', destination: `${process.env.BACKEND_URL}/api/:path*` },
  ];
}

export default nextConfig;
