"use client";

/**
 * uPVC cladding panel: a run of chamfered boards on a backing rail. Opening
 * turns it to a three-quarter view and eases the boards apart, so the board
 * profile and fixing rail read the way an exploded product shot does.
 */

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getFinish } from "@/lib/upvc3d";
import { SETTLE_EPSILON, useAutoPlayWake, useInvalidateOn } from "./demand";
import { FitCamera } from "./FitCamera";
import { slabGeometry } from "./geometry";
import { useUpvcMaterial } from "./materials";
import { UpvcStage } from "./UpvcStage";

const BOARDS = 7;
const BOARD_W = 1.1;
const BOARD_H = 0.16;
const BOARD_D = 0.022;
const SHADOW_GAP = 0.008;
const PANEL_H = BOARDS * BOARD_H + (BOARDS - 1) * SHADOW_GAP;

const AUTOPLAY_CYCLE = 7;
const AUTOPLAY_OPEN_FRACTION = 3.6 / 7;

const smooth = (t: number) => t * t * (3 - 2 * t);

function PanelStack({
  finishSlug,
  open,
  autoPlay,
}: {
  finishSlug: string;
  open: number;
  autoPlay: boolean;
}) {
  const boardMat = useUpvcMaterial(getFinish(finishSlug));
  const railMat = useUpvcMaterial(getFinish("anthracite-grey"));
  const group = useRef<THREE.Group>(null);
  const boards = useRef<Array<THREE.Mesh | null>>([]);
  const progress = useRef(0);

  const boardGeo = useMemo(() => slabGeometry(BOARD_W, BOARD_H, BOARD_D, 0.004), []);
  const railGeo = useMemo(() => slabGeometry(0.05, PANEL_H + 0.06, 0.03, 0.003), []);

  useInvalidateOn([open]);
  useAutoPlayWake(autoPlay, AUTOPLAY_CYCLE, AUTOPLAY_OPEN_FRACTION);

  useFrame((state, delta) => {
    const target = autoPlay
      ? (performance.now() / 1000) % AUTOPLAY_CYCLE < AUTOPLAY_CYCLE * AUTOPLAY_OPEN_FRACTION
        ? 1
        : 0
      : open;
    progress.current = THREE.MathUtils.damp(progress.current, target, 3, Math.min(delta, 0.1));
    if (Math.abs(target - progress.current) < SETTLE_EPSILON) {
      progress.current = target;
    } else {
      state.invalidate();
    }
    const p = smooth(progress.current);

    if (group.current) group.current.rotation.y = -0.18 - 0.5 * p;

    boards.current.forEach((board, i) => {
      if (!board) return;
      const fromCentre = i - (BOARDS - 1) / 2;
      board.position.y = fromCentre * (BOARD_H + SHADOW_GAP) * (1 + 0.09 * p);
      board.position.z = BOARD_D / 2 + 0.015 + p * 0.06 * (1 - Math.abs(fromCentre) / BOARDS);
    });
  });

  return (
    <group ref={group}>
      {[-0.38, 0.38].map((x) => (
        <mesh key={x} geometry={railGeo} material={railMat} position={[x, 0, -0.005]} />
      ))}
      {Array.from({ length: BOARDS }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            boards.current[i] = el;
          }}
          geometry={boardGeo}
          material={boardMat}
        />
      ))}
    </group>
  );
}

export interface UpvcPanelViewerProps {
  finishSlug?: string;
  /** 0 = flat elevation, 1 = turned and exploded */
  open?: number;
  autoPlay?: boolean;
  className?: string;
}

export function UpvcPanelViewer({
  finishSlug = "golden-oak",
  open = 0,
  autoPlay = false,
  className,
}: UpvcPanelViewerProps) {
  // No photo of a panel exists, so the fallback draws the boards in CSS.
  const poster = (
    <div className="flex h-full w-full items-center justify-center" role="img" aria-label="uPVC cladding panel">
      <div className="flex w-1/2 flex-col gap-[3px]">
        {Array.from({ length: BOARDS }, (_, i) => (
          <div key={i} className="h-5 rounded-[2px] bg-gradient-to-b from-[#c79a62] to-[#a97b45] shadow-sm" />
        ))}
      </div>
    </div>
  );

  return (
    <UpvcStage
      className={className}
      fallback={poster}
      fov={30}
      groundY={-PANEL_H / 2 - 0.08}
      renderWhenReduced={!autoPlay}
    >
      <FitCamera width={BOARD_W} height={PANEL_H} depth={0.3} margin={1.35} azimuth={0.2} elevation={0.12} />
      <PanelStack finishSlug={finishSlug} open={open} autoPlay={autoPlay} />
    </UpvcStage>
  );
}
