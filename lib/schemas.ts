import { z } from "zod";

export const openingTypeSchema = z.enum([
  "sliding",
  "casement",
  "tilt-turn",
  "folding",
  "french",
  "hinged",
  "fixed",
]);

export const productCategorySchema = z.enum(["windows", "doors", "panels"]);

export const productSchema = z.object({
  slug: z.string(),
  category: productCategorySchema,
  name: z.string(),
  shortDescription: z.string(),
  openingType: openingTypeSchema.optional(),
  heroImage: z.string(),
  galleryImages: z.array(z.string()),
  profileSystem: z.string().optional(),
  glazingOptions: z.array(z.string()).optional(),
  colors: z.array(z.string()),
  features: z.array(z.string()),
  uValue: z.string().optional(),
  warranty: z.string().optional(),
  specs: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .optional(),
  priceFrom: z.string().optional(),
  badges: z.array(z.string()).optional(),
});

export const companySchema = z.object({
  companyName: z.string(),
  logo: z.string(),
  tagline: z.string(),
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
    primaryCta: z.object({ label: z.string(), href: z.string() }),
    secondaryCta: z.object({ label: z.string(), href: z.string() }),
    image: z.string(),
  }),
  usps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
      value: z.string().optional(),
    })
  ),
  stats: z.object({
    yearsInBusiness: z.number(),
    installations: z.number(),
    citiesServed: z.number(),
    satisfactionRate: z.number().optional(),
  }),
  contact: z.object({
    phones: z.array(z.string()),
    emails: z.array(z.string()),
    whatsapp: z.string(),
    addresses: z.array(
      z.object({
        label: z.string(),
        address: z.string(),
        lat: z.number(),
        lng: z.number(),
        mapsUrl: z.string(),
        embedUrl: z.string(),
      })
    ),
  }),
  certifications: z.array(z.string()),
  social: z.array(z.object({ platform: z.string(), url: z.string() })),
  process: z.array(
    z.object({
      step: z.number(),
      title: z.string(),
      description: z.string(),
    })
  ),
});

export const productsArraySchema = z.array(productSchema);
