"use client";

/**
 * Installed fluted uPVC wall — tight vertical woodgrain slats filling the
 * crop, matching the interior feature-wall product.
 */

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getFinish } from "@/lib/upvc3d";
import { SETTLE_EPSILON, useAutoPlayWake, useInvalidateOn } from "./demand";
import { FitCamera } from "./FitCamera";
import { flutedPanelGeometry } from "./geometry";
import { useUpvcMaterial } from "./materials";
import { UpvcStage } from "./UpvcStage";

const PANEL_W = 0.92;
const PANEL_H = 1.42;
const PANEL_D = 0.016;
const SLATS = 34;

const AUTOPLAY_CYCLE = 8;
const AUTOPLAY_OPEN_FRACTION = 4 / 8;

const smooth = (t: number) => t * t * (3 - 2 * t);

function FlutedWall({
  open,
  autoPlay,
}: {
  open: number;
  autoPlay: boolean;
}) {
  const oak = useUpvcMaterial({
    ...getFinish("golden-oak"),
    color: "#c19d66",
    roughness: 0.64,
    clearcoat: 0.16,
    clearcoatRoughness: 0.58,
  });
  const group = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const geo = useMemo(
    () => flutedPanelGeometry(PANEL_W, PANEL_H, PANEL_D, SLATS),
    []
  );

  useInvalidateOn([open]);
  useAutoPlayWake(autoPlay, AUTOPLAY_CYCLE, AUTOPLAY_OPEN_FRACTION);

  useFrame((state, delta) => {
    const target = autoPlay
      ? (performance.now() / 1000) % AUTOPLAY_CYCLE <
        AUTOPLAY_CYCLE * AUTOPLAY_OPEN_FRACTION
        ? 1
        : 0
      : open;
    progress.current = THREE.MathUtils.damp(
      progress.current,
      target,
      3,
      Math.min(delta, 0.1)
    );
    if (Math.abs(target - progress.current) < SETTLE_EPSILON) {
      progress.current = target;
    } else {
      state.invalidate();
    }
    const p = smooth(progress.current);
    if (group.current) {
      group.current.rotation.y = -0.08 - 0.22 * p;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geo} material={oak} />
    </group>
  );
}

export interface UpvcPanelViewerProps {
  open?: number;
  autoPlay?: boolean;
  className?: string;
}

export function UpvcPanelViewer({
  open = 0,
  autoPlay = false,
  className,
}: UpvcPanelViewerProps) {
  const poster = (
    <div
      className="h-full w-full"
      role="img"
      aria-label="Fluted uPVC woodgrain wall panels"
      style={{
        background:
          "repeating-linear-gradient(90deg, #8f6c38 0px, #b58a4e 3px, #c9a66a 7px, #d4b47a 10px, #c19d66 13px, #a07a42 16px, #8f6c38 18px)",
      }}
    />
  );

  return (
    <UpvcStage
      className={className}
      fallback={poster}
      fov={28}
      contactShadow={false}
      environmentIntensity={0.72}
      renderWhenReduced={!autoPlay}
    >
      <FitCamera
        width={PANEL_W}
        height={PANEL_H}
        depth={PANEL_D}
        margin={0.9}
        azimuth={0.18}
        elevation={0.01}
      />
      <FlutedWall open={open} autoPlay={autoPlay} />
    </UpvcStage>
  );
}
