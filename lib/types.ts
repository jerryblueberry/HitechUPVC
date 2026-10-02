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
  /** Neighbourhood or city in Nepal */
  location?: string;
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

export type GalleryCollection = "installations" | "factory" | "products";

export type GalleryOrientation = "landscape" | "portrait" | "square";

/**
 * Cloudinary-ready image entry. Plain URL strings in `images` still work —
 * resolve with `resolveGalleryImage` / `getProjectCover` in `lib/gallery.ts`.
 */
export interface GalleryImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  orientation?: GalleryOrientation;
  /** Optional Cloudinary public id for later transforms */
  publicId?: string;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  /** Gallery bucket — installations, factory floor, or product photography */
  collection: GalleryCollection;
  productCategory?: ProductCategory;
  productSlug?: string;
  description: string;
  images: Array<string | GalleryImage>;
  orientation?: GalleryOrientation;
  featured?: boolean;
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

export interface CompanyAddress {
  label: string;
  address: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  /** Google Maps embed URL — no API key (`maps/embed?pb=` or `output=embed`). */
  embedUrl: string;
}

export interface Company {
  companyName: string;
  logo: string;
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
    phones: string[];
    emails: string[];
    whatsapp: string;
    addresses: CompanyAddress[];
  };
  certifications: string[];
  social: { platform: string; url: string }[];
  process: { step: number; title: string; description: string }[];
}

export type QuoteProductId = "windows" | "doors" | "panels";

export interface QuoteContent {
  seo: { title: string; description: string; keywords: string[] };
  hero: { eyebrow: string; title: string; body: string };
  steps: string[];
  products: {
    id: QuoteProductId;
    label: string;
    styles: string[];
    /** Style label → 3D opening type; panels use the fluted panel viewer instead */
    previews?: Record<string, OpeningType>;
  }[];
  glass: string[];
  /** Glass label → 3D glazing slug in lib/upvc3d.ts; unlisted labels render clear */
  glassPreviews: Record<string, "clear" | "low-e" | "obscure" | "tinted">;
  units: string[];
  projectTypes: string[];
  timelines: string[];
  locations: string[];
  whatsappIntro: string;
  aside: { title: string; points: { title: string; body: string }[] };
}

export type AboutValueIcon = "mountain" | "ruler" | "chat" | "shield";

interface AboutSectionHeading {
  eyebrow: string;
  title: string;
}

export interface AboutContent {
  seo: { title: string; description: string; keywords: string[] };
  hero: AboutSectionHeading & {
    body: string;
    image: string;
    imageAlt: string;
    imageCaption: string;
  };
  story: AboutSectionHeading & { paragraphs: string[] };
  services: AboutSectionHeading & {
    items: { title: string; body: string; href: string }[];
  };
  sites: AboutSectionHeading & {
    body: string;
    /** `label` must match a `company.contact.addresses[].label` */
    roles: { label: string; role: string; description: string }[];
  };
  values: AboutSectionHeading & {
    body: string;
    highlight: { title: string; body: string; linkLabel: string; linkHref: string };
    items: {
      icon: AboutValueIcon;
      title: string;
      body: string;
      proof: string;
    }[];
  };
  serviceAreas: AboutSectionHeading & {
    body: string;
    /** First region is rendered as the featured (primary) card */
    regions: {
      id: string;
      label: string;
      badge: string;
      body: string;
      areas: string[];
      /** Optional trailing chip linking to `contactHref` */
      moreLabel?: string;
      features: string[];
    }[];
    contactLabel: string;
    contactHref: string;
  };
  cta: {
    title: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
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
