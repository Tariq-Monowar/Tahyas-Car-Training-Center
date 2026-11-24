import { site } from "@/config/site";

/**
 * Public site PWA manifest. Served as a plain route (not app/manifest.ts) so it
 * is NOT auto-linked on the admin pages, which have their own manifest
 * (/admin/manifest.webmanifest). Linked from the site metadata in lib/seo.ts.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      id: "/",
      name: site.name.bn,
      short_name: site.shortName.bn,
      description: site.tagline.bn,
      lang: "bn",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#0a1220",
      theme_color: "#0b1324",
      icons: [
        { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
        { src: "/images/brand/icon-192.png", type: "image/png", sizes: "192x192" },
        { src: "/images/brand/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
