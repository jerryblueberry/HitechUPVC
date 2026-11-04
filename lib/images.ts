/**
 * Local stock photography under `public/images/stock/`.
 * Mirrored from Unsplash so the browser never hits a remote CDN on load.
 * Replace with owned photography before launch — see docs/CONTENT-CHECKLIST.md
 */

const stock = (name: string) => `/images/stock/${name}.webp`;

export const IMAGES = {
  hero: stock("modern-home-exterior"),

  /** Curtain + window interior shots for reveal animations */
  curtains: {
    sheer: stock("curtain-sheer"),
    beige: stock("curtain-beige"),
    openLight: stock("curtain-open-light"),
    modern: stock("modern-interior"),
  },

  categories: {
    windows: "/images/hero/casement.webp",
    doors: "/images/hero/folding.webp",
    /** Placeholder until owned panel photography ships */
    panels: "/images/hero/casement.webp",
  },

  scrollStory: {
    window: stock("curtain-sheer"),
    door: stock("patio-doors"),
    interior: stock("curtain-open-light"),
  },

  openingTypes: {
    sliding: "/images/hero/sliding.webp",
    casement: "/images/hero/casement.webp",
    "tilt-turn": "/images/hero/tilt-turn.webp",
    folding: "/images/hero/folding.webp",
    french: "/images/hero/folding.webp",
  },

  gallery: [
    stock("gallery-home-1"),
    stock("gallery-home-2"),
    stock("modern-interior"),
  ],

  beforeAfter: {
    before: stock("before-house"),
    after: stock("modern-home-exterior"),
  },
} as const;

export type OpeningTypeImageKey = keyof typeof IMAGES.openingTypes;
