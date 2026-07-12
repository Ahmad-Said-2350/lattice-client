import type { NextConfig } from "next";
import path from "node:path";

const API_ORIGIN = process.env.API_PROXY_TARGET ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    // Same-origin /api/* → Express, so Better Auth cookies live on localhost:3000
    return [
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
