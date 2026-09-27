"use client";

/**
 * Page-load intro: white French doors set into a wall the same colour as the
 * page. The doors swing open and the camera walks through, so the real page
 * underneath (the canvas is transparent) is revealed through the doorway.
 */

import { Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getFinish, getUpvcModel, GLAZING, HARDWARE } from "@/lib/upvc3d";
import { HDRI_PATH } from "./UpvcStage";
import { UpvcUnit } from "./UpvcUnit";

/** Must match `--color-surface` so the wall is indistinguishable from the page */
const WALL_COLOR = "#f7f6f3";

const FOV = 34;
const OPEN_START = 0.25;
const OPEN_DURATION = 1.15;
const WALK_START = 0.85;
const WALK_DURATION = 1.55;
const WALK_END_Z = -1.6;
export const DOORWAY_INTRO_SECONDS = WALK_START + WALK_DURATION;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function Wall({ holeWidth, holeHeight }: { holeWidth: number; holeHeight: number }) {
  const geometry = useMemo(() => {
    const size = 60;
    const shape = new THREE.Shape();
    shape.moveTo(-size, -size);
    shape.lineTo(size, -size);
    shape.lineTo(size, size);
    shape.lineTo(-size, size);
    shape.closePath();

    // Slightly inside the frame so the frame covers the cut edge.
    const hw = holeWidth / 2 - 0.012;
    const hh = holeHeight / 2 - 0.012;
    const hole = new THREE.Path();
    hole.moveTo(-hw, -hh);
    hole.lineTo(-hw, hh);
    hole.lineTo(hw, hh);
    hole.lineTo(hw, -hh);
    hole.closePath();
    shape.holes.push(hole);

    return new THREE.ShapeGeometry(shape);
  }, [holeWidth, holeHeight]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={WALL_COLOR} toneMapped={false} />
    </mesh>
  );
}

interface TimelineProps {
  clockRef: React.RefObject<number>;
  startZ: (aspect: number) => number;
  onReveal: () => void;
  onComplete: () => void;
}

function Timeline({ clockRef, startZ, onReveal, onComplete }: TimelineProps) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const done = useRef(false);
  const revealed = useRef(false);

  useFrame((_, delta) => {
    // Clamp so a slow first frame (shader compile) doesn't skip the swing.
    clockRef.current += Math.min(delta, 1 / 30);
    const t = clockRef.current;

    const z0 = startZ(size.width / Math.max(1, size.height));
    const walk = easeInOutCubic(clamp01((t - WALK_START) / WALK_DURATION));
    camera.position.set(0, 0.04 * (1 - walk), THREE.MathUtils.lerp(z0, WALK_END_Z, walk));
    camera.lookAt(0, 0, -8);

    if (!revealed.current && t >= WALK_START) {
      revealed.current = true;
      onReveal();
    }

    if (!done.current && t >= DOORWAY_INTRO_SECONDS) {
      done.current = true;
      onComplete();
    }
  });

  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

export interface UpvcDoorwaySceneProps {
  /** Fires once the HDRI has loaded and the first frame is about to draw */
  onReady: () => void;
  /** Fires as the camera starts walking through — the page behind should be ready to be seen */
  onReveal: () => void;
  onComplete: () => void;
  className?: string;
}

export function UpvcDoorwayScene({
  onReady,
  onReveal,
  onComplete,
  className,
}: UpvcDoorwaySceneProps) {
  const spec = useMemo(() => getUpvcModel("french", "doors"), []);
  const clockRef = useRef(0);

  const openSource = useMemo(
    () => () => easeOutCubic(clamp01((clockRef.current - OPEN_START) / OPEN_DURATION)),
    []
  );

  // Frame the doorway with a little wall showing, at any aspect ratio.
  const startZ = useMemo(() => {
    const vHalf = Math.tan(((FOV / 2) * Math.PI) / 180);
    return (aspect: number) =>
      Math.max((spec.height * 1.3) / 2 / vHalf, (spec.width * 1.35) / 2 / (vHalf * aspect));
  }, [spec]);

  const holeHeight = spec.height + (spec.hasThreshold ? 0.05 : 0);

  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      camera={{ position: [0, 0.04, 6], fov: FOV, near: 0.02, far: 80 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <directionalLight position={[2.4, 3.2, 3]} intensity={1.1} />
      <directionalLight position={[-2.5, 1, 2]} intensity={0.35} />

      <Suspense fallback={null}>
        <Environment files={HDRI_PATH} />
        <Wall holeWidth={spec.width} holeHeight={holeHeight} />
        <UpvcUnit
          spec={spec}
          finish={getFinish("white")}
          hardware={HARDWARE.chrome}
          glazing={GLAZING.clear}
          quality="balanced"
          isDoor
          openSource={openSource}
          damping={9}
        />
        <Timeline
          clockRef={clockRef}
          startZ={startZ}
          onReveal={onReveal}
          onComplete={onComplete}
        />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
