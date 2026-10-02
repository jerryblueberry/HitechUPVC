"use client";

/**
 * One render-quality policy for every 3D surface on the site.
 *
 * Phones used to be treated as a lesser class of device: half the pixel
 * ratio, no antialiasing, no contact shadow, the cheap glass. A current phone
 * renders a single uPVC unit comfortably, so the tier below is about what the
 * device actually reports — data saver, memory, connection — and a touch
 * screen on its own no longer costs quality.
 *
 * A phone and a laptop therefore run the same pipeline and differ only in
 * numbers, which keeps the model looking the same everywhere.
 */

import { useSyncExternalStore } from "react";
import type { RenderQuality } from "./materials";

export const HDRI_PATH = "/hdri/studio_small_09_1k.hdr";
/** Quarter-weight copy for metered connections: 410 KB instead of 1.6 MB */
export const HDRI_PATH_SMALL = "/hdri/studio_small_09_512.hdr";

export type DeviceTier = "high" | "mid" | "low";

type HintNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

let probed: DeviceTier | null = null;

/** Probed once per session: the media queries and hints never change mid-visit. */
export function probeDeviceTier(): DeviceTier {
  if (probed) return probed;

  const nav = navigator as HintNavigator;
  const connection = nav.connection;
  // Only explicit signals demote a device. hardwareConcurrency is not one of
  // them: iOS reports a low count on phones that render this scene at 60fps.
  const constrained =
    connection?.saveData === true ||
    (nav.deviceMemory !== undefined && nav.deviceMemory < 4) ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g";

  probed = constrained
    ? "low"
    : window.matchMedia("(hover: hover)").matches
      ? "high"
      : "mid";

  return probed;
}

const noopSubscribe = () => () => {};

export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(noopSubscribe, probeDeviceTier, () => "mid");
}

export function hdriFor(tier: DeviceTier): string {
  return tier === "low" ? HDRI_PATH_SMALL : HDRI_PATH;
}

export interface ViewerQuality {
  /** Device-pixel-ratio ceiling */
  dpr: number;
  antialias: boolean;
  contactShadow: boolean;
  material: RenderQuality;
}

/**
 * A still unit draws once and holds that frame, so it can afford the sharp
 * buffer and real refraction. An autoplaying or orbiting one draws every
 * frame, so it trades pixels for frame rate.
 */
const VIEWER: Record<DeviceTier, Record<"still" | "animated", ViewerQuality>> = {
  high: {
    still: { dpr: 2, antialias: true, contactShadow: true, material: "high" },
    animated: { dpr: 1.75, antialias: true, contactShadow: true, material: "high" },
  },
  mid: {
    still: { dpr: 1.9, antialias: true, contactShadow: true, material: "high" },
    animated: { dpr: 1.4, antialias: true, contactShadow: true, material: "balanced" },
  },
  low: {
    still: { dpr: 1.3, antialias: false, contactShadow: false, material: "balanced" },
    animated: { dpr: 1.15, antialias: false, contactShadow: false, material: "balanced" },
  },
};

export function viewerQuality(tier: DeviceTier, animated: boolean): ViewerQuality {
  return VIEWER[tier][animated ? "animated" : "still"];
}

const RANK: Record<RenderQuality, number> = { draft: 0, balanced: 1, high: 2 };

/** The lower of what the call site asked for and what the device can carry. */
export function capQuality(
  requested: RenderQuality,
  budget: RenderQuality
): RenderQuality {
  return RANK[requested] <= RANK[budget] ? requested : budget;
}

export interface SceneQuality {
  /** What the scene renders at */
  dpr: number;
  /** Where it steps down to if the device cannot hold a smooth frame */
  reducedDpr: number;
  antialias: boolean;
  contactShadow: boolean;
}

/**
 * The scroll sequence is full-screen and in motion the whole time it is on
 * screen, so it starts sharp and only steps down to `reducedDpr` if it
 * measures dropped frames — once per visit, never back and forth, since
 * resizing the buffer costs a frame of its own.
 *
 * Edges are carried by MSAA rather than raw resolution: it is the cheaper
 * half of the two on the tile-based GPU in a phone.
 */
const SCENE: Record<DeviceTier, SceneQuality> = {
  high: { dpr: 2, reducedDpr: 1.5, antialias: true, contactShadow: true },
  mid: { dpr: 1.9, reducedDpr: 1.35, antialias: true, contactShadow: true },
  low: { dpr: 1.15, reducedDpr: 1.15, antialias: false, contactShadow: false },
};

export function sceneQuality(tier: DeviceTier): SceneQuality {
  return SCENE[tier];
}
