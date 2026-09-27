import type { MetadataRoute } from "next";
import { getDoors, getPanels, getWindows } from "@/lib/getData";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const products = [
    ...getWindows().map((product) => `/products/windows/${product.slug}`),
    ...getDoors().map((product) => `/products/doors/${product.slug}`),
    ...getPanels().map((product) => `/products/panels/${product.slug}`),
  ];

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/why-upvc"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/products"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/products/windows"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/products/doors"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/products/panels"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...products.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
