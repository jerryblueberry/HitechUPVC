"use client";

/**
 * Frames a unit of known size in the canvas, solving for both the vertical and
 * horizontal field of view so tall windows and wide bi-folds are both framed
 * correctly at any aspect ratio.
 */

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import type * as THREE from "three";

export interface FitCameraProps {
  /** Subject size in metres */
  width: number;
  height: number;
  depth?: number;
  /** Extra room around the subject, 1 = tight */
  margin?: number;
  /** Camera orbit, in radians */
  azimuth?: number;
  elevation?: number;
  /** Vertical offset of the look-at point */
  targetY?: number;
}

export function FitCamera({
  width,
  height,
  depth = 0.2,
  margin = 1.25,
  azimuth = 0.32,
  elevation = 0.1,
  targetY = 0,
}: FitCameraProps) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const controls = useThree((state) => state.controls) as
    | { target: THREE.Vector3; update: () => void }
    | null;

  useLayoutEffect(() => {
    const aspect = size.width / Math.max(1, size.height);

    // Turning the unit toward the camera widens its silhouette.
    const projectedWidth =
      Math.abs(width * Math.cos(azimuth)) + Math.abs(depth * Math.sin(azimuth));

    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

    const distance =
      Math.max(
        height / 2 / Math.tan(vFov / 2),
        projectedWidth / 2 / Math.tan(hFov / 2)
      ) * margin;

    camera.position.set(
      Math.sin(azimuth) * Math.cos(elevation) * distance,
      Math.sin(elevation) * distance + targetY,
      Math.cos(azimuth) * Math.cos(elevation) * distance
    );
    camera.lookAt(0, targetY, 0);
    camera.updateProjectionMatrix();

    if (controls) {
      controls.target.set(0, targetY, 0);
      controls.update();
    }
    invalidate();
  }, [
    camera,
    controls,
    invalidate,
    size.width,
    size.height,
    width,
    height,
    depth,
    margin,
    azimuth,
    elevation,
    targetY,
  ]);

  return null;
}
