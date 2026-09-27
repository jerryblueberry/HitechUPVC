/**
 * Curated free stock images (Unsplash) for Hi-Tech uPVC Profile Industries.
 * Replace with owned photography before launch — see docs/CONTENT-CHECKLIST.md
 */

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero: unsplash("photo-1600585154340-be6161a56a0c", 1920),

  /** Curtain + window interior shots for reveal animations */
  curtains: {
    sheer: unsplash("photo-1761824615207-ae7cdaddbca4", 1600),
    beige: unsplash("photo-1771039621924-562a5df5c68f", 1600),
    openLight: unsplash("photo-1761824615063-52a426692aab", 1600),
    modern: unsplash("photo-1771970777748-e1042cd7a0e7", 1600),
  },

  categories: {
    windows: "/images/upvc/window-modern.png",
    doors: "/images/upvc/door-french.png",
    panels: "/images/upvc/window-casement.png",
  },

  scrollStory: {
    window: unsplash("photo-1761824615207-ae7cdaddbca4", 1400),
    door: unsplash("photo-1600566753190-17f0baa2a6c3", 1400),
    interior: unsplash("photo-1761824615063-52a426692aab", 1400),
  },

  openingTypes: {
    sliding: "/images/upvc/window-sliding.png",
    casement: "/images/upvc/window-casement.png",
    "tilt-turn": "/images/upvc/window-open.png",
    folding: "/images/upvc/door-french.png",
    french: "/images/upvc/door-french.png",
  },

  gallery: [
    unsplash("photo-1600596542815-ffad4c1539a9", 800),
    unsplash("photo-1600607687644-c7171b42498f", 800),
    unsplash("photo-1771970777748-e1042cd7a0e7", 800),
  ],

  beforeAfter: {
    before: unsplash("photo-1564013799919-ab600027ffc6", 1400),
    after: unsplash("photo-1600585154340-be6161a56a0c", 1400),
  },
} as const;

export type OpeningTypeImageKey = keyof typeof IMAGES.openingTypes;
