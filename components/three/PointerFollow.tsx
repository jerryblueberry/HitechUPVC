"use client";

/**
 * Turns its children toward the cursor — no click or drag needed. Tracks the
 * pointer across the whole window (relative to the canvas), so the unit
 * responds as soon as the cursor is anywhere near it.
 */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { SETTLE_EPSILON } from "./demand";

export interface PointerFollowProps {
  children: ReactNode;
  /** Max turn left/right and up/down, in radians */
  yaw?: number;
  pitch?: number;
  /** Higher follows faster */
  damping?: number;
  enabled?: boolean;
}

export function PointerFollow({
  children,
  yaw = 0.42,
  pitch = 0.12,
  damping = 3.2,
  enabled = true,
}: PointerFollowProps) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const canvas = useThree((state) => state.gl.domElement);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      invalidate();
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      // Normalised so the canvas edges are ±1; beyond that it saturates.
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      target.current.x = THREE.MathUtils.clamp(x, -1.4, 1.4) / 1.4;
      target.current.y = THREE.MathUtils.clamp(y, -1.4, 1.4) / 1.4;
    };
    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
      invalidate();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [canvas, enabled, invalidate]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.1);
    const tx = enabled ? target.current.x * yaw : 0;
    const ty = enabled ? target.current.y * pitch : 0;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, tx, damping, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, ty, damping, dt);
    if (
      Math.abs(tx - g.rotation.y) > SETTLE_EPSILON ||
      Math.abs(ty - g.rotation.x) > SETTLE_EPSILON
    ) {
      state.invalidate();
    }
  });

  return <group ref={group}>{children}</group>;
}
