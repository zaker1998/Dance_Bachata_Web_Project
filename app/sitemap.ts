import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    "",
    "/videos",
    "/book",
    "/contact",
    "/impressum",
    "/datenschutz",
  ];
  const lowPriority = new Set(["/impressum", "/datenschutz"]);

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : lowPriority.has(path) ? 0.3 : 0.7,
  }));
}
