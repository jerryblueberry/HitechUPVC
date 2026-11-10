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
    title: "uPVC Windows in Kathmandu & Nepal",
    description:
      "Sliding, casement, and tilt & turn uPVC windows made to measure by Hi-Tech uPVC at our Tarakeshwar factory — installed across Kathmandu, Lalitpur, Bhaktapur, and Pokhara.",
    keywords: [
      "uPVC windows Kathmandu",
      "uPVC windows Nepal",
      "uPVC window price Nepal",
      "uPVC windows Lalitpur",
      "uPVC windows Bhaktapur",
      "uPVC windows Pokhara",
      "sliding windows Kathmandu",
      "casement windows Nepal",
      "tilt and turn windows Nepal",
      "double glazed windows Kathmandu",
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
    title: "uPVC Doors in Kathmandu & Nepal",
    description:
      "French, sliding, and folding uPVC doors made to measure by Hi-Tech uPVC in Tarakeshwar — wide openings for homes and terraces across Kathmandu, Lalitpur, Bhaktapur, and Pokhara.",
    keywords: [
      "uPVC doors Kathmandu",
      "uPVC doors Nepal",
      "uPVC door price Nepal",
      "uPVC doors Lalitpur",
      "uPVC doors Bhaktapur",
      "uPVC doors Pokhara",
      "uPVC French doors Nepal",
      "uPVC sliding doors Kathmandu",
      "folding doors Kathmandu",
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
    title: "uPVC Wall Panels in Kathmandu & Nepal",
    description:
      "Fluted woodgrain and smooth uPVC wall panels by Hi-Tech uPVC — feature walls without paint or timber upkeep, made in Tarakeshwar for Kathmandu and Nepal.",
    keywords: [
      "uPVC wall panels Kathmandu",
      "uPVC wall panels Nepal",
      "uPVC panel price Nepal",
      "fluted wall panels Kathmandu",
      "uPVC cladding Nepal",
      "woodgrain wall panels Nepal",
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
