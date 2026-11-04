/**
 * Local UPVC product assets.
 *
 * Studio stills under `/images/hero/*.webp` are captures from our live parametric
 * renderer (no stock watermarks). Prefer those for posters and no-WebGL fallbacks.
 * The PNGs in `/images/upvc/` are legacy Vecteezy cutouts — do not use on marketing
 * surfaces until replaced with owned photography.
 */

import type { OpeningType, ProductCategory } from "./types";

const seq = (name: string, count: number) =>
  Array.from(
    { length: count },
    (_, i) => `/images/upvc/sequences/${name}-${i + 1}.webp`
  ) as readonly string[];

export const UPVC_SEQUENCES = {
  hero: "/images/upvc/sequences/hero-lifestyle.webp",
  handle: "/images/upvc/sequences/handle-detail.webp",
  frontDoor: "/images/upvc/sequences/front-door.webp",
  slidingWindow: seq("sliding-window", 3),
  casement: seq("casement", 3),
  foldingDoor: seq("folding-door", 3),
  slidingDoor: seq("sliding-door", 3),
  tiltTurn: seq("tilt-turn", 3),
} as const;

/** Prefer owned studio stills — Vecteezy PNGs under /images/upvc/*.png are watermarked. */
export const UPVC_PNG = {
  windowCasement: "/images/hero/casement.webp",
  windowSliding: "/images/hero/sliding.webp",
  windowModern: "/images/hero/casement.webp",
  windowOpen: "/images/hero/tilt-turn.webp",
  doorFrench: "/images/hero/french.webp",
} as const;

/** Frame sequences for opening/closing animation demos */
export const OPENING_TYPE_SEQUENCE: Record<OpeningType, readonly string[]> = {
  sliding: UPVC_SEQUENCES.slidingWindow,
  casement: UPVC_SEQUENCES.casement,
  "tilt-turn": UPVC_SEQUENCES.tiltTurn,
  folding: UPVC_SEQUENCES.foldingDoor,
  french: [UPVC_SEQUENCES.frontDoor],
  hinged: [UPVC_SEQUENCES.frontDoor],
  fixed: [UPVC_SEQUENCES.slidingWindow[0]],
};

/** Closed-pose stills from the live 3D stage — transparent, no watermarks. */
export const OPENING_TYPE_PNG: Record<OpeningType, string> = {
  sliding: "/images/hero/sliding.webp",
  casement: "/images/hero/casement.webp",
  "tilt-turn": "/images/hero/tilt-turn.webp",
  folding: "/images/hero/folding.webp",
  french: "/images/hero/french.webp",
  hinged: "/images/hero/french.webp",
  fixed: "/images/hero/casement.webp",
};

export const CATEGORY_PNG: Record<ProductCategory, string> = {
  windows: "/images/hero/casement.webp",
  doors: "/images/hero/french.webp",
  panels: "/images/hero/casement.webp",
};

/** Category posters for the home showcase. `null` = no still; use live or wash. */
export function categoryShowcasePoster(
  category: ProductCategory
): string | null {
  if (category === "windows") return CATEGORY_PNG.windows;
  if (category === "doors") return CATEGORY_PNG.doors;
  return null;
}

export function getSequenceForOpening(type: OpeningType): readonly string[] {
  return OPENING_TYPE_SEQUENCE[type];
}

export function getUpvcPngForOpening(type: OpeningType): string {
  return OPENING_TYPE_PNG[type];
}

export function getUpvcPngForCategory(category: ProductCategory): string {
  return CATEGORY_PNG[category];
}
