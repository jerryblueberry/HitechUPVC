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

export const PROCESS_STEPS = [
  { step: 1, title: "Consultation", description: "Discuss your needs and preferences" },
  { step: 2, title: "Measurement", description: "Precise on-site measurements" },
  { step: 3, title: "Manufacturing", description: "Custom-built to your specifications" },
  { step: 4, title: "Installation", description: "Expert fitting by certified installers" },
  { step: 5, title: "Aftercare", description: "Ongoing support and warranty service" },
] as const;
