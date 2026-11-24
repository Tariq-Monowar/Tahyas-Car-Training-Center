/**
 * Admin PWA manifest — installing from any /admin page creates a separate
 * "Tahyas Admin" app that opens straight into the dashboard.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      id: "/admin",
      name: "Tahyas Admin — তাহয়াস অ্যাডমিন",
      short_name: "Tahyas Admin",
      description: "স্টুডেন্ট, ভর্তি ও সার্টিফিকেট ম্যানেজ করুন",
      lang: "bn",
      start_url: "/admin",
      scope: "/admin",
      display: "standalone",
      orientation: "any",
      background_color: "#0b0f15",
      theme_color: "#121821",
      icons: [
        { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
        { src: "/images/brand/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
        { src: "/images/brand/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
      ],
      shortcuts: [
        { name: "ড্যাশবোর্ড", url: "/admin" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
