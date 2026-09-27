export type ProductCategory = "windows" | "doors" | "panels";

export type OpeningType =
  | "sliding"
  | "casement"
  | "tilt-turn"
  | "folding"
  | "french"
  | "hinged"
  | "fixed";

export interface ProductSpecs {
  frameDepth?: string;
  chambers?: number;
  glazingThickness?: string;
  [key: string]: string | number | undefined;
}

export interface Product {
  slug: string;
  category: ProductCategory;
  name: string;
  shortDescription: string;
  openingType?: OpeningType;
  heroImage: string;
  galleryImages: string[];
  profileSystem?: string;
  glazingOptions?: string[];
  colors: string[];
  features: string[];
  uValue?: string;
  warranty?: string;
  specs?: ProductSpecs;
  priceFrom?: string;
  badges?: string[];
}

export interface ColorSwatch {
  slug: string;
  name: string;
  hex: string;
  swatchImage?: string;
  type: "solid" | "woodgrain" | "dual";
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Navigation {
  main: NavItem[];
  products: {
    windows: NavItem[];
    doors: NavItem[];
    panels: NavItem[];
    featured?: {
      title: string;
      description: string;
      image: string;
      href: string;
    };
  };
  footer: NavItem[];
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  projectType: string;
  quote: string;
  rating: number;
  image?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  productCategory: ProductCategory;
  productSlug?: string;
  description: string;
  images: string[];
  beforeImage?: string;
  afterImage?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
}

export interface CompanyUSP {
  title: string;
  description: string;
  icon: string;
  value?: string;
}

export interface CompanyStats {
  yearsInBusiness: number;
  installations: number;
  citiesServed: number;
  satisfactionRate?: number;
}

export interface Company {
  companyName: string;
  tagline: string;
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    image: string;
  };
  usps: CompanyUSP[];
  stats: CompanyStats;
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    addresses: { label: string; address: string }[];
  };
  certifications: string[];
  social: { platform: string; url: string }[];
  process: { step: number; title: string; description: string }[];
}

export interface ProductIndexEntry {
  slug: string;
  category: ProductCategory;
  name: string;
  shortDescription: string;
  openingType?: OpeningType;
  heroImage: string;
  colors: string[];
  priceFrom?: string;
  badges?: string[];
}
