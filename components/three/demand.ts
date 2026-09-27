"use client";

/**
 * Helpers for on-demand rendering. Canvases only draw a frame when something
 * asks for one, so anything that moves must keep invalidating until it settles.
 * Kept apart from hooks.ts, which non-3D components import — pulling
 * @react-three/fiber in there would put it in the initial bundle.
 */

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/** Below this, a damped value is snapped to its target and the scene can idle. */
export const SETTLE_EPSILON = 1e-3;

/** Requests a frame whenever any dependency changes. */
export function useInvalidateOn(deps: readonly unknown[]) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidate, ...deps]);
}

/**
 * A time-based open/shut loop would never see its target flip while the scene
 * is idle. This wakes the scene at each flip; the damped animation keeps
 * itself running from there until it settles.
 */
export function useAutoPlayWake(enabled: boolean, cycle: number, openFraction: number) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!enabled) return;

    let timer = 0;
    const schedule = () => {
      const t = (performance.now() / 1000) % cycle;
      const flipAt = cycle * openFraction;
      const wait = t < flipAt ? flipAt - t : cycle - t;
      timer = window.setTimeout(() => {
        invalidate();
        schedule();
      }, wait * 1000 + 16);
    };

    invalidate();
    schedule();
    return () => window.clearTimeout(timer);
  }, [enabled, cycle, openFraction, invalidate]);
}
