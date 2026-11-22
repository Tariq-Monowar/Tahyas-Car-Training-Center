import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name.bn,
    short_name: site.shortName.bn,
    description: site.tagline.bn,
    lang: "bn",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1220",
    theme_color: "#0b1324",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/images/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/images/brand/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
