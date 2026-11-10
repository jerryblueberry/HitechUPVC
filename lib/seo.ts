import type { Metadata } from "next";
import { getCompany } from "./getData";

export const OG_IMAGE = "/images/upvc/sequences/hero-lifestyle.webp";

/** Short brand used in title templates — keeps titles under ~60 characters. */
export const BRAND_SHORT = "Hi-Tech uPVC";

/** Spellings people actually search; mirrored in Organization `alternateName`. */
export const BRAND_ALIASES = [
  "Hi-Tech uPVC",
  "Hitech uPVC",
  "Hi Tech uPVC",
  "High Tech uPVC",
  "Hitech UPVC Nepal",
  "Hi-Tech Group Nepal",
  "Hitech Group Nepal",
  "Hi-Tech uPVC Windows",
] as const;

export const CORE_KEYWORDS = [
  "Hi-Tech uPVC Profile Industries",
  ...BRAND_ALIASES,
  "uPVC windows Kathmandu",
  "uPVC doors Kathmandu",
  "uPVC windows Nepal",
  "uPVC doors Nepal",
  "uPVC panels Nepal",
  "uPVC manufacturer Nepal",
  "uPVC company Kathmandu",
  "uPVC windows price Nepal",
  "uPVC Pokhara",
  "uPVC Tarakeshwar",
] as const;

const BRAND_KEYWORDS = [
  "Hi-Tech uPVC Profile Industries",
  "Hi-Tech uPVC",
  "Hitech uPVC",
  "Hi-Tech Group Nepal",
];

const MAX_KEYWORDS = 20;

/** Page keywords first, then brand terms, deduped case-insensitively. */
export function mergeKeywords(pageKeywords: readonly string[] = []): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const keyword of [...pageKeywords, ...BRAND_KEYWORDS]) {
    const key = keyword.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(keyword);
    if (out.length >= MAX_KEYWORDS) break;
  }
  return out;
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function defaultMetadata(): Metadata {
  const company = getCompany();
  const title = `uPVC Windows & Doors in Kathmandu, Nepal | ${BRAND_SHORT}`;
  const description =
    "Hi-Tech uPVC (Hitech uPVC) manufactures uPVC windows, doors, and panels at its Tarakeshwar factory — installed across Kathmandu, Lalitpur, Bhaktapur, Pokhara, and Nepal. Free site measurement.";

  const verificationToken =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s | ${BRAND_SHORT}`,
    },
    description,
    applicationName: company.companyName,
    keywords: [...CORE_KEYWORDS],
    authors: [
      {
        name: company.companyName,
        url: "https://www.instagram.com/hitechgroupnepal/",
      },
    ],
    creator: company.companyName,
    publisher: company.companyName,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    ...(verificationToken
      ? { verification: { google: verificationToken } }
      : {}),
    openGraph: {
      type: "website",
      locale: "en_NP",
      url: "/",
      siteName: company.companyName,
      title,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Hi-Tech uPVC windows and doors in Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = OG_IMAGE,
  extras?: { keywords?: readonly string[]; absoluteTitle?: boolean }
): Metadata {
  const company = getCompany();
  const url = absoluteUrl(path);
  const fullTitle = extras?.absoluteTitle ? title : `${title} | ${BRAND_SHORT}`;

  return {
    title: extras?.absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergeKeywords(extras?.keywords),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_NP",
      url,
      siteName: company.companyName,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/** `"French Classic"` + `"doors"` → `"French Classic uPVC Door, Kathmandu"`. */
export function productSeoTitle(name: string, category: "windows" | "doors" | "panels") {
  const noun = { windows: "Window", doors: "Door", panels: "Wall Panel" }[category];
  return `${name} uPVC ${noun}, Kathmandu`;
}

export function productSeoKeywords(
  name: string,
  category: "windows" | "doors" | "panels"
): string[] {
  const plural = { windows: "windows", doors: "doors", panels: "wall panels" }[category];
  return [
    `${name} uPVC`,
    `uPVC ${plural} Kathmandu`,
    `uPVC ${plural} Nepal`,
    `uPVC ${plural} price Nepal`,
    `uPVC ${plural} Lalitpur`,
    `uPVC ${plural} Pokhara`,
    `Hi-Tech uPVC ${plural}`,
  ];
}
