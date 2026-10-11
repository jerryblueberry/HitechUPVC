"use client";

import { prefetchUpvcScrollScene } from "./LazyUpvcScrollScene";
import { prefetchUpvcViewer } from "./LazyUpvcViewer";
import { hdriFor, probeDeviceTier } from "./quality";

let started = false;

/**
 * Starts the home 3D downloads the moment this module runs: the viewer chunk,
 * the scroll-door chunk, and the studio lighting. Called from the hero and
 * the door section so either one arriving first is enough.
 */
export function warmHomeScene() {
  if (started || typeof window === "undefined") return;
  started = true;

  void fetch(hdriFor(probeDeviceTier()), { cache: "force-cache" });
  prefetchUpvcViewer();
  prefetchUpvcScrollScene();
}
