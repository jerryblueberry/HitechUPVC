import type { Metadata } from "next";
import { pageMetadata } from "./seo";
import type { OpeningType, ProductCategory } from "./types";

export interface CategoryPageCopy {
  title: string;
  description: string;
  keywords: string[];
  headline: string;
  body: string;
  openingType?: OpeningType;
  caption: string;
  posterAlt: string;
  whatsappPrefill: string;
}

export const CATEGORY_PAGES: Record<ProductCategory, CategoryPageCopy> = {
  windows: {
    title: "uPVC Windows",
    description:
      "Made-to-measure uPVC windows from Hi-Tech uPVC Profile Industries — sliding, casement, and tilt & turn for Kathmandu homes.",
    keywords: [
      "uPVC windows Nepal",
      "uPVC windows Kathmandu",
      "tilt and turn windows",
      "casement windows Nepal",
      "sliding windows Kathmandu",
      "Hi-Tech uPVC windows",
    ],
    headline: "Sliding, casement, and tilt & turn.",
    body: "Made-to-measure uPVC windows for Kathmandu light, dust, and monsoon rain. White, anthracite, or golden oak — without the paint cycle of timber.",
    openingType: "casement",
    caption: "Live 3D casement · multi-chamber profile",
    posterAlt: "White uPVC casement window — Hi-Tech uPVC Kathmandu",
    whatsappPrefill: "Hi Hi-Tech — I’d like to see the uPVC window range and request a quote.",
  },
  doors: {
    title: "uPVC Doors",
    description:
      "French, sliding, and folding uPVC doors from Hi-Tech uPVC Profile Industries. Wide openings for patios and living rooms in Kathmandu.",
    keywords: [
      "uPVC doors Kathmandu",
      "French doors Nepal",
      "sliding patio doors",
      "bi-fold doors Kathmandu",
      "Hi-Tech uPVC doors",
    ],
    headline: "French, sliding, and folding doors.",
    body: "Wide openings without the rot, warp, or paint of timber. Built for patios, terraces, and living rooms — made to measure in Tarakeshwar.",
    openingType: "french",
    caption: "Live 3D French door · made to measure",
    posterAlt: "White uPVC French doors — Hi-Tech uPVC Kathmandu",
    whatsappPrefill: "Hi Hi-Tech — I’d like to see the uPVC door range and request a quote.",
  },
  panels: {
    title: "uPVC Wall Panels",
    description:
      "Fluted woodgrain and smooth uPVC wall panels from Hi-Tech uPVC Profile Industries. Feature walls without paint or timber upkeep.",
    keywords: [
      "uPVC wall panels Nepal",
      "fluted wall panels Kathmandu",
      "woodgrain cladding Nepal",
      "uPVC cladding",
      "Hi-Tech uPVC panels",
    ],
    headline: "Fluted walls. No paint. No timber.",
    body: "Smooth and woodgrain cladding for feature walls — UV-stable foil, concealed fixings, no annual varnish.",
    caption: "Live 3D fluted slat wall · golden oak",
    posterAlt: "Fluted golden-oak uPVC wall panels — Hi-Tech uPVC Kathmandu",
    whatsappPrefill: "Hi Hi-Tech — I’d like to see the uPVC wall panel range and request a quote.",
  },
};

export function categoryMetadata(category: ProductCategory): Metadata {
  const copy = CATEGORY_PAGES[category];
  return pageMetadata(copy.title, copy.description, `/products/${category}`, undefined, {
    keywords: copy.keywords,
  });
}
