/**
 * Local UPVC product assets — PNG cutouts + real frame sequences from composite showcase.
 * Replace files in /public/images/upvc/ with owned photography before launch.
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

export const UPVC_PNG = {
  windowCasement: "/images/upvc/window-casement.png",
  windowSliding: "/images/upvc/window-sliding.png",
  windowModern: "/images/upvc/window-modern.png",
  windowOpen: "/images/upvc/window-open.png",
  doorFrench: "/images/upvc/door-french.png",
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

export const OPENING_TYPE_PNG: Record<OpeningType, string> = {
  sliding: UPVC_PNG.windowSliding,
  casement: UPVC_PNG.windowCasement,
  "tilt-turn": UPVC_PNG.windowOpen,
  folding: UPVC_PNG.doorFrench,
  french: UPVC_PNG.doorFrench,
  hinged: UPVC_PNG.doorFrench,
  fixed: UPVC_PNG.windowModern,
};

export const CATEGORY_PNG: Record<ProductCategory, string> = {
  windows: UPVC_PNG.windowModern,
  doors: UPVC_PNG.doorFrench,
  panels: UPVC_PNG.windowCasement,
};

export function getSequenceForOpening(type: OpeningType): readonly string[] {
  return OPENING_TYPE_SEQUENCE[type];
}

export function getUpvcPngForOpening(type: OpeningType): string {
  return OPENING_TYPE_PNG[type];
}

export function getUpvcPngForCategory(category: ProductCategory): string {
  return CATEGORY_PNG[category];
}
