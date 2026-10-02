import type {
  AboutContent,
  ColorSwatch,
  Company,
  FAQ,
  Navigation,
  Product,
  ProductCategory,
  ProductIndexEntry,
  Project,
  QuoteContent,
  TeamMember,
  Testimonial,
} from "./types";

import aboutData from "@/data/about.json";
import colorsData from "@/data/colors.json";
import companyData from "@/data/company.json";
import doorsData from "@/data/doors.json";
import faqsData from "@/data/faqs.json";
import navigationData from "@/data/navigation.json";
import panelsData from "@/data/panels.json";
import productsData from "@/data/products.json";
import projectsData from "@/data/projects.json";
import quoteData from "@/data/quote.json";
import teamData from "@/data/team.json";
import testimonialsData from "@/data/testimonials.json";
import windowsData from "@/data/windows.json";

const categoryData: Record<ProductCategory, Product[]> = {
  windows: windowsData as Product[],
  doors: doorsData as Product[],
  panels: panelsData as Product[],
};

export function getCompany(): Company {
  return companyData as Company;
}

export function getAbout(): AboutContent {
  return aboutData as AboutContent;
}

export function getQuote(): QuoteContent {
  return quoteData as QuoteContent;
}

export function getNavigation(): Navigation {
  return navigationData as Navigation;
}

export function getWindows(): Product[] {
  return categoryData.windows;
}

export function getDoors(): Product[] {
  return categoryData.doors;
}

export function getPanels(): Product[] {
  return categoryData.panels;
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return categoryData[category];
}

export function getProductBySlug(
  category: ProductCategory,
  slug: string
): Product | undefined {
  return categoryData[category].find((p) => p.slug === slug);
}

export function getProducts(): ProductIndexEntry[] {
  return productsData as ProductIndexEntry[];
}

export function getColors(): ColorSwatch[] {
  return colorsData as ColorSwatch[];
}

export function getColorBySlug(slug: string): ColorSwatch | undefined {
  return (colorsData as ColorSwatch[]).find((c) => c.slug === slug);
}

export function getTestimonials(): Testimonial[] {
  return testimonialsData as Testimonial[];
}

export function getFAQs(category?: string): FAQ[] {
  const all = faqsData as FAQ[];
  if (!category) return all;
  return all.filter((faq) => faq.category === category);
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getTeam(): TeamMember[] {
  return teamData as TeamMember[];
}

export function getAllProducts(): Product[] {
  return [
    ...categoryData.windows,
    ...categoryData.doors,
    ...categoryData.panels,
  ];
}
