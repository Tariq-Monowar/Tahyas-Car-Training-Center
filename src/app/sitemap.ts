import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (bn: string, en: string, priority: number) => {
    const languages = { bn: `${site.url}${bn}`, en: `${site.url}${en}` };
    return [
      { url: `${site.url}${bn}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority, alternates: { languages } },
      { url: `${site.url}${en}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.2, alternates: { languages } },
    ];
  };
  return [...page("/", "/en", 1), ...page("/license", "/en/license", 0.9), ...page("/road-rules", "/en/road-rules", 0.9)];
}
