import { UPVC_PNG, UPVC_SEQUENCES } from "./upvcAssets";
import type { OpeningType, ProductCategory } from "./types";

export interface Hero3DSlide {
  id: string;
  openingType: OpeningType;
  category: ProductCategory;
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
}

/** Home hero carousel — each slide is a live 3D unit (ADR 006). */
export const HERO_3D_SLIDES: Hero3DSlide[] = [
  {
    id: "french",
    openingType: "french",
    category: "doors",
    label: "French",
    eyebrow: "French Doors",
    title: "Double leaves. Unbroken elegance.",
    subtitle:
      "Two leaves swing apart from a slim meeting stile, leaving the whole opening clear. Multi-point locking on both.",
    href: "/products/doors/french-classic",
  },
  {
    id: "sliding",
    openingType: "sliding",
    category: "doors",
    label: "Sliding",
    eyebrow: "Sliding Patio",
    title: "Doors that glide. Views that breathe.",
    subtitle:
      "Floor-to-ceiling panels on stainless rollers. Nothing swings into the room, just an effortless glide.",
    href: "/products/doors/sliding-patio",
  },
  {
    id: "tilt-turn",
    openingType: "tilt-turn",
    category: "windows",
    label: "Tilt & Turn",
    eyebrow: "Tilt & Turn",
    title: "Two motions. One refined system.",
    subtitle:
      "Tilt in from the top for secure ventilation, or turn the handle again to swing the sash wide for cleaning.",
    href: "/products/windows/tilt-turn-classic",
  },
  {
    id: "casement",
    openingType: "casement",
    category: "windows",
    label: "Casement",
    eyebrow: "Casement Windows",
    title: "Light, sculpted by precision frames.",
    subtitle:
      "Multi-chamber profiles and friction stays that hold the sash at any angle. The widest clear opening of any window.",
    href: "/products/windows/casement-elegance",
  },
  {
    id: "folding",
    openingType: "folding",
    category: "doors",
    label: "Bi-Fold",
    eyebrow: "Bi-Fold Doors",
    title: "Walls that fold away entirely.",
    subtitle:
      "Panels concertina along a single track and stack to one side, opening the full width of the room.",
    href: "/products/doors/folding-living",
  },
];

export interface HeroSlide {
  id: string;
  openingType?: OpeningType;
  /** Background photo — used when no product sequence */
  image?: string;
  /** Isolated UPVC PNG — fallback static product */
  productPng?: string;
  /** Real frame sequence for open/close animation */
  sequenceFrames?: readonly string[];
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "sliding-doors",
    openingType: "sliding",
    sequenceFrames: UPVC_SEQUENCES.slidingDoor,
    productPng: UPVC_PNG.windowSliding,
    eyebrow: "Sliding Systems",
    title: "Doors that glide. Views that breathe.",
    subtitle:
      "Floor-to-ceiling UPVC sliding doors with whisper-quiet rollers, slim sightlines, and seamless indoor-outdoor flow.",
    badge: "Sliding Patio",
  },
  {
    id: "modern-windows",
    openingType: "casement",
    sequenceFrames: UPVC_SEQUENCES.casement,
    productPng: UPVC_PNG.windowCasement,
    eyebrow: "Window Collections",
    title: "Light sculpted by precision frames.",
    subtitle:
      "Multi-chamber profiles, advanced glazing, and clean architectural lines — engineered for thermal comfort year-round.",
    badge: "Casement Range",
  },
  {
    id: "tilt-turn",
    openingType: "tilt-turn",
    sequenceFrames: UPVC_SEQUENCES.tiltTurn,
    productPng: UPVC_PNG.windowOpen,
    eyebrow: "Tilt & Turn",
    title: "Two motions. One refined system.",
    subtitle:
      "Ventilate with a gentle tilt. Clean with a full turn. The most versatile opening for modern living spaces.",
    badge: "Best Seller",
  },
  {
    id: "french-doors",
    openingType: "french",
    sequenceFrames: [UPVC_SEQUENCES.frontDoor],
    productPng: UPVC_PNG.doorFrench,
    eyebrow: "French Doors",
    title: "Double leaves. Unbroken elegance.",
    subtitle:
      "Classic outward swing with multi-point locking — connecting rooms to terraces with architectural poise.",
    badge: "French Classic",
  },
  {
    id: "folding-doors",
    openingType: "folding",
    sequenceFrames: UPVC_SEQUENCES.foldingDoor,
    productPng: UPVC_PNG.doorFrench,
    eyebrow: "Bi-Fold Systems",
    title: "Walls that fold away entirely.",
    subtitle:
      "Stack panels to one side and open the full width of your space — perfect for entertaining and panoramic views.",
    badge: "Folding Living",
  },
  {
    id: "facade",
    image: UPVC_SEQUENCES.hero,
    eyebrow: "Hi-Tech uPVC",
    title: "Engineered for comfort. Built to last.",
    subtitle:
      "Windows, doors, and panels crafted for modern homes and commercial projects — installed by certified experts.",
    badge: "Full Range",
  },
];
