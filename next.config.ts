import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Inline the (small) CSS into the HTML → no render-blocking stylesheet request on slow 3G/4G.
  experimental: { inlineCss: true },
  images: {
    // AVIF first (smallest), WebP fallback — the browser picks what it supports.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600],
    imageSizes: [64, 128, 256, 384],
    qualities: [70, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // ?v=<mtime> on real photos is a new URL, so a replaced file is not stuck in the 30-day cache.
    localPatterns: [
      { pathname: "/images/real/**" },
      { pathname: "/images/brand/**", search: "" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
