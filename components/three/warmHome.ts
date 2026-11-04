"use client";

import { prefetchSequence } from "@/components/sequence/frameStore";
import { doorSequenceFor, heroSequenceOrNull } from "@/lib/sequences";
import { HERO_3D_SLIDES } from "@/lib/heroSlides";
import { prefetchUpvcScrollScene } from "./LazyUpvcScrollScene";
import { prefetchUpvcViewer } from "./LazyUpvcViewer";
import { prefetchHdri } from "./prefetchHdri";
import { hdriFor, probeDeviceTier } from "./quality";

let started = false;

function idle(cb: () => void, timeout: number) {
  const ric = (
    window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number }
      ) => number;
    }
  ).requestIdleCallback;
  if (ric) ric(cb, { timeout });
  else window.setTimeout(cb, Math.min(timeout, 1400));
}

/**
 * Warms home motion without racing the hero poster.
 *
 * High + mid: shared HDRI (1k / 512) + idle Three.js chunks — same live
 * pipeline on phones and laptops. Low: idle-prefetch frame sequences only.
 */
export function warmHomeScene() {
  if (started || typeof window === "undefined") return;
  started = true;

  const tier = probeDeviceTier();

  if (tier === "low") {
    idle(() => {
      const hero = heroSequenceOrNull(HERO_3D_SLIDES[0].id);
      if (hero) prefetchSequence(hero);
      const door = doorSequenceFor(
        window.matchMedia("(min-width: 1024px), (min-aspect-ratio: 1/1)").matches
      );
      if (door) prefetchSequence(door);
    }, 3200);
    return;
  }

  void prefetchHdri(hdriFor(tier));
  idle(() => {
    prefetchUpvcViewer();
    prefetchUpvcScrollScene();
  }, tier === "high" ? 1600 : 2400);
}
