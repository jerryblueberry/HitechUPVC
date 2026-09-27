import type { Metadata } from "next";
import { getCompany } from "./getData";

export const OG_IMAGE = "/images/upvc/sequences/hero-lifestyle.webp";

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
  const title = `${company.companyName} | uPVC Windows, Doors & Panels in Nepal`;
  const description =
    "Hi-Tech uPVC Profile Industries makes energy-efficient uPVC windows, doors, and panels in Nepal. Visit Tarakeshwar, Lambagar, or Tokha — or write to us on WhatsApp.";

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s | ${company.companyName}`,
    },
    description,
    applicationName: company.companyName,
    keywords: [
      "Hi-Tech uPVC",
      "uPVC windows Nepal",
      "uPVC doors Kathmandu",
      "uPVC profiles Tarakeshwar",
      "Hi-Tech Group Nepal",
    ],
    authors: [{ name: company.companyName, url: "https://www.instagram.com/hitechgroupnepal/" }],
    creator: company.companyName,
    publisher: company.companyName,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
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
          alt: "Hi-Tech uPVC windows and doors",
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
  extras?: { keywords?: string[] }
): Metadata {
  const company = getCompany();
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: extras?.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_NP",
      url,
      siteName: company.companyName,
      title: `${title} | ${company.companyName}`,
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
      title: `${title} | ${company.companyName}`,
      description,
      images: [image],
    },
  };
}
