/**
 * Parametric uPVC model specs — pure data, no three.js import so this stays
 * server-safe. Geometry is built from these numbers in components/three/.
 *
 * All dimensions are in metres, matching real profile sizes (ADR 006).
 */

import type { OpeningType, ProductCategory } from "./types";

export type HingeSide = "left" | "right";

/** How the leaves of a unit move as opening progress goes 0 → 1. */
export type OpeningRig =
  | { kind: "fixed" }
  | { kind: "swing"; hinges: HingeSide[]; maxAngle: number }
  | { kind: "slide"; travel: number }
  | { kind: "tilt-turn"; hinge: HingeSide; tiltAngle: number; turnAngle: number }
  | { kind: "fold"; hinge: HingeSide; maxAngle: number };

export interface UpvcModelSpec {
  /** Overall structural opening */
  width: number;
  height: number;
  /** Visible face width of the outer frame profile */
  frameFace: number;
  /** Front-to-back depth of the outer frame */
  frameDepth: number;
  /** Visible face width of the sash profile */
  sashFace: number;
  sashDepth: number;
  /** Glazing bead that retains the sealed unit */
  beadFace: number;
  beadDepth: number;
  /** Number of leaves filling the structural opening */
  leaves: number;
  rig: OpeningRig;
  /** Which leaf carries the handle (index into leaves) */
  handleLeaf: number;
  /** Handle centre height, relative to unit centre */
  handleY: number;
  /** Horizontal glazing bars per leaf (0 = single pane) */
  glazingBars: number;
  /** Solid uPVC panel across the lower third instead of glass */
  lowerPanel: boolean;
  hasSill: boolean;
  hasThreshold: boolean;
}

const WINDOW_BASE = {
  frameFace: 0.062,
  frameDepth: 0.07,
  sashFace: 0.058,
  sashDepth: 0.056,
  beadFace: 0.014,
  beadDepth: 0.012,
  handleY: 0,
  glazingBars: 0,
  lowerPanel: false,
  hasSill: true,
  hasThreshold: false,
} as const;

const DOOR_BASE = {
  frameFace: 0.07,
  frameDepth: 0.078,
  sashFace: 0.09,
  sashDepth: 0.07,
  beadFace: 0.016,
  beadDepth: 0.013,
  handleY: -0.06,
  glazingBars: 0,
  lowerPanel: false,
  hasSill: false,
  hasThreshold: true,
} as const;

const DEG = Math.PI / 180;

/**
 * Build the model spec for an opening type. Doors and windows share the same
 * geometry generator but differ in profile weight, proportion and hardware.
 */
export function getUpvcModel(
  openingType: OpeningType,
  category: ProductCategory = "windows"
): UpvcModelSpec {
  const isDoor = category === "doors";

  switch (openingType) {
    case "casement":
      return {
        ...WINDOW_BASE,
        width: 0.95,
        height: 1.25,
        leaves: 1,
        handleLeaf: 0,
        rig: { kind: "swing", hinges: ["left"], maxAngle: 62 * DEG },
      };

    // Sliders run on two tracks, so the outer frame is far deeper than a
    // casement frame — without that depth the leaves sit outside the frame.
    case "sliding":
      return isDoor
        ? {
            ...DOOR_BASE,
            width: 2.4,
            height: 2.1,
            frameDepth: 0.17,
            sashFace: 0.07,
            leaves: 2,
            handleLeaf: 1,
            rig: { kind: "slide", travel: 0.96 },
          }
        : {
            ...WINDOW_BASE,
            width: 1.6,
            height: 1.2,
            frameDepth: 0.13,
            leaves: 2,
            handleLeaf: 1,
            rig: { kind: "slide", travel: 0.96 },
          };

    case "tilt-turn":
      return {
        ...WINDOW_BASE,
        width: 0.9,
        height: 1.35,
        leaves: 1,
        handleLeaf: 0,
        rig: {
          kind: "tilt-turn",
          hinge: "left",
          tiltAngle: 13 * DEG,
          turnAngle: 58 * DEG,
        },
      };

    case "folding":
      return {
        ...DOOR_BASE,
        width: 2.8,
        height: 2.1,
        leaves: 4,
        handleLeaf: 3,
        sashFace: 0.075,
        rig: { kind: "fold", hinge: "left", maxAngle: 84 * DEG },
      };

    case "french":
      return {
        ...DOOR_BASE,
        width: 1.7,
        height: 2.1,
        leaves: 2,
        handleLeaf: 1,
        glazingBars: 2,
        rig: { kind: "swing", hinges: ["left", "right"], maxAngle: 72 * DEG },
      };

    case "hinged":
      return {
        ...DOOR_BASE,
        width: 1.0,
        height: 2.1,
        leaves: 1,
        handleLeaf: 0,
        lowerPanel: true,
        rig: { kind: "swing", hinges: ["left"], maxAngle: 78 * DEG },
      };

    case "fixed":
    default:
      return {
        ...WINDOW_BASE,
        width: 1.2,
        height: 1.2,
        leaves: 1,
        handleLeaf: -1,
        rig: { kind: "fixed" },
      };
  }
}

/* ------------------------------------------------------------------ */
/* Finishes                                                            */
/* ------------------------------------------------------------------ */

export interface FinishSpec {
  /** Matches a slug in data/colors.json */
  slug: string;
  /** Base albedo. Slightly desaturated from the swatch hex so it reads as a
   *  lit surface rather than flat colour. */
  color: string;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  woodgrain: boolean;
}

export const FINISHES: Record<string, FinishSpec> = {
  white: {
    slug: "white",
    color: "#eeece7",
    roughness: 0.36,
    clearcoat: 0.6,
    clearcoatRoughness: 0.3,
    woodgrain: false,
  },
  cream: {
    slug: "cream",
    color: "#e4ded4",
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.34,
    woodgrain: false,
  },
  "anthracite-grey": {
    slug: "anthracite-grey",
    color: "#32373a",
    roughness: 0.48,
    clearcoat: 0.42,
    clearcoatRoughness: 0.42,
    woodgrain: false,
  },
  slate: {
    slug: "slate",
    color: "#424d5c",
    roughness: 0.46,
    clearcoat: 0.45,
    clearcoatRoughness: 0.4,
    woodgrain: false,
  },
  "golden-oak": {
    slug: "golden-oak",
    color: "#b1915f",
    roughness: 0.56,
    clearcoat: 0.3,
    clearcoatRoughness: 0.5,
    woodgrain: true,
  },
  rosewood: {
    slug: "rosewood",
    color: "#5d4232",
    roughness: 0.58,
    clearcoat: 0.28,
    clearcoatRoughness: 0.52,
    woodgrain: true,
  },
  sage: {
    slug: "sage",
    color: "#7c8b6f",
    roughness: 0.44,
    clearcoat: 0.44,
    clearcoatRoughness: 0.4,
    woodgrain: false,
  },
  champagne: {
    slug: "champagne",
    color: "#c2b39c",
    roughness: 0.42,
    clearcoat: 0.48,
    clearcoatRoughness: 0.36,
    woodgrain: false,
  },
};

export const DEFAULT_FINISH = "white";

export function getFinish(slug: string | undefined): FinishSpec {
  return FINISHES[slug ?? DEFAULT_FINISH] ?? FINISHES[DEFAULT_FINISH];
}

/* ------------------------------------------------------------------ */
/* Hardware                                                            */
/* ------------------------------------------------------------------ */

export type HardwareSlug = "chrome" | "brushed" | "black" | "gold" | "white";

export interface HardwareSpec {
  slug: HardwareSlug;
  label: string;
  color: string;
  metalness: number;
  roughness: number;
}

export const HARDWARE: Record<HardwareSlug, HardwareSpec> = {
  chrome: {
    slug: "chrome",
    label: "Polished Chrome",
    color: "#dfe2e4",
    metalness: 1,
    roughness: 0.08,
  },
  brushed: {
    slug: "brushed",
    label: "Brushed Steel",
    color: "#b9bcbe",
    metalness: 1,
    roughness: 0.34,
  },
  black: {
    slug: "black",
    label: "Matt Black",
    color: "#1d1f21",
    metalness: 0.5,
    roughness: 0.46,
  },
  gold: {
    slug: "gold",
    label: "Brushed Gold",
    color: "#b69a6b",
    metalness: 1,
    roughness: 0.26,
  },
  white: {
    slug: "white",
    label: "Powder White",
    color: "#ecebe7",
    metalness: 0.15,
    roughness: 0.4,
  },
};

export const HARDWARE_ORDER: HardwareSlug[] = [
  "chrome",
  "brushed",
  "black",
  "gold",
  "white",
];

/* ------------------------------------------------------------------ */
/* Glazing                                                             */
/* ------------------------------------------------------------------ */

export type GlazingSlug = "clear" | "low-e" | "obscure" | "tinted";

export interface GlazingSpec {
  slug: GlazingSlug;
  label: string;
  color: string;
  roughness: number;
  /** 0 = fully transparent, 1 = fully opaque */
  density: number;
}

export const GLAZING: Record<GlazingSlug, GlazingSpec> = {
  clear: {
    slug: "clear",
    label: "Clear Double",
    color: "#eaf3f2",
    roughness: 0.02,
    density: 0.1,
  },
  "low-e": {
    slug: "low-e",
    label: "Low-E Argon",
    color: "#d8ece9",
    roughness: 0.03,
    density: 0.2,
  },
  obscure: {
    slug: "obscure",
    label: "Obscure",
    color: "#e7edec",
    roughness: 0.45,
    density: 0.42,
  },
  tinted: {
    slug: "tinted",
    label: "Solar Tint",
    color: "#9fb2b6",
    roughness: 0.04,
    density: 0.4,
  },
};

export const GLAZING_ORDER: GlazingSlug[] = [
  "clear",
  "low-e",
  "obscure",
  "tinted",
];

/** Opening types that have something worth animating in 3D. */
export const DEMO_OPENING_TYPES: OpeningType[] = [
  "tilt-turn",
  "casement",
  "sliding",
  "french",
  "folding",
  "hinged",
];
