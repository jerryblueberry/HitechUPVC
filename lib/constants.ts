import type { OpeningType, ProductCategory } from "./types";

export const OPENING_TYPE_LABELS: Record<OpeningType, string> = {
  sliding: "Sliding",
  casement: "Casement",
  "tilt-turn": "Tilt & Turn",
  folding: "Folding",
  french: "French",
  hinged: "Hinged",
  fixed: "Fixed",
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  windows: "Windows",
  doors: "Doors",
  panels: "Panels",
};

export const CATEGORY_PATHS: Record<ProductCategory, string> = {
  windows: "/products/windows",
  doors: "/products/doors",
  panels: "/products/panels",
};

export const CATEGORY_BLURBS: Record<ProductCategory, string> = {
  windows: "Sliding, casement, tilt & turn — made to measure.",
  doors: "French, sliding, and folding for indoor-outdoor living.",
  panels: "Fluted woodgrain wall panels — the feature wall, no paint.",
};

/** `wa.me` requires digits only, no plus or spaces. */
export function whatsappHref(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const url = `https://wa.me/${digits}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}

/** `tel:` link for Nepal numbers — keeps +977 even if the display form omits it. */
export function telHref(number: string): string {
  const digits = number.replace(/\D/g, "");
  const withCountry = digits.startsWith("977") ? digits : `977${digits}`;
  return `tel:+${withCountry}`;
}

export const PROCESS_STEPS = [
  { step: 1, title: "Consultation", description: "Discuss your needs and preferences" },
  { step: 2, title: "Measurement", description: "Precise on-site measurements" },
  { step: 3, title: "Manufacturing", description: "Custom-built to your specifications" },
  { step: 4, title: "Installation", description: "Expert fitting by certified installers" },
  { step: 5, title: "Aftercare", description: "Ongoing support and warranty service" },
] as const;
