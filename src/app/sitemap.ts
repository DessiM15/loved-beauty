import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/shopify";
import { site } from "@/content/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/policies/shipping-returns`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/policies/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/policies/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticPages,
    ...collections.map((c) => ({
      url: `${base}/collections/${c.handle}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/products/${p.handle}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.map((i) => (i.url.startsWith("http") ? i.url : `${base}${i.url}`)),
    })),
  ];
}
