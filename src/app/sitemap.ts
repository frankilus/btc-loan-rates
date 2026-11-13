import type { MetadataRoute } from "next";
import { SITE_URL, getAllComparePairs } from "@/lib/compares";
import { LAST_UPDATED, lenders } from "@/lib/lenders";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${LAST_UPDATED}T12:00:00-05:00`);
  const pairs = getAllComparePairs();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/methodology`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/calculator`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/compare`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/lenders`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/rate-changes`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...lenders.map((l) => ({
      url: `${SITE_URL}/lenders/${l.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...pairs.map((p) => ({
      url: `${SITE_URL}/compare/${p.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
