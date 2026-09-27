import type { MetadataRoute } from "next";
import { getCaseStudySlugs } from "@/lib/case-studies";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = ["", "/about", ...getCaseStudySlugs().map((slug) => `/work/${slug}`)];

  return pages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
  }));
}
