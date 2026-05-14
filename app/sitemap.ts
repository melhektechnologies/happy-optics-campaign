import { MetadataRoute } from "next";

// Marketing routes change rarely. Using a fixed lastModified pinned at the
// most recent meaningful content change keeps the sitemap deterministic so
// crawlers and CDN caches don't see a "fresh" timestamp on every request.
const LAST_MODIFIED = new Date("2026-05-13T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://happyoptics.com";

  const routes: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/services", changeFrequency: "monthly", priority: 0.8 },
    { path: "/branches", changeFrequency: "monthly", priority: 0.8 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.7 },
    { path: "/unity", changeFrequency: "weekly", priority: 0.9 },
    { path: "/book", changeFrequency: "monthly", priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
