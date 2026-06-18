import type { MetadataRoute } from "next";
import { allComparisons, allBestFor } from "@/lib/data";
import { SITE_URL as BASE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls = ["", "/compare", "/best"].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const comparisonUrls = allComparisons().map((c) => ({
    url: `${BASE}/compare/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const bestForUrls = allBestFor().map((b) => ({
    url: `${BASE}/best/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...comparisonUrls, ...bestForUrls];
}
