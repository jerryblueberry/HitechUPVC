"use client";

import { useEffect, type ReactNode } from "react";
import {
  claimHomeDoorCanvas,
  releaseHomeDoorCanvas,
} from "@/lib/homeCanvasBudget";

/**
 * Claims the single home WebGL slot for as long as the door live canvas is
 * mounted. Must wrap the door scene *inside* ApproachedMount so the hero
 * keeps live open/close until the pin is actually near.
 */
export function ClaimDoorCanvas({ children }: { children: ReactNode }) {
  useEffect(() => {
    claimHomeDoorCanvas();
    return () => releaseHomeDoorCanvas();
  }, []);

  return children;
}
