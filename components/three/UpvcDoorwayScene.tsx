"use client";

/**
 * Page-load intro: white French doors in a surface-coloured wall. Lights only
 * (no 1.5 MB HDRI) so the first frame can compile immediately. The camera
 * walks through a transparent canvas onto the real page.
 */

import "./patchClock";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getFinish, getUpvcModel, GLAZING, HARDWARE } from "@/lib/upvc3d";
import { UpvcUnit } from "./UpvcUnit";

/** Must match `--color-surface` so the wall is indistinguishable from the page */
const WALL_COLOR = "#f7f6f3";

const FOV = 34;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

/** Slightly shorter on touch so phones finish before the fail-open timeout. */
function introTiming(coarse: boolean) {
  const OPEN_START = 0.04;
  const OPEN_DURATION = coarse ? 0.5 : 0.58;
  const WALK_START = coarse ? 0.26 : 0.34;
  const WALK_DURATION = coarse ? 0.72 : 0.86;
  const WALK_END_Z = -1.6;
  return {
    OPEN_START,
    OPEN_DURATION,
    WALK_START,
    WALK_DURATION,
    WALK_END_Z,
    TOTAL: WALK_START + WALK_DURATION,
  };
}

function Wall({ holeWidth, holeHeight }: { holeWidth: number; holeHeight: number }) {
  const geometry = useMemo(() => {
    const size = 60;
    const shape = new THREE.Shape();
    shape.moveTo(-size, -size);
    shape.lineTo(size, -size);
    shape.lineTo(size, size);
    shape.lineTo(-size, size);
    shape.closePath();

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

interface Timing {
  OPEN_START: number;
  OPEN_DURATION: number;
  WALK_START: number;
  WALK_DURATION: number;
  WALK_END_Z: number;
  TOTAL: number;
}

interface TimelineProps {
  clockRef: React.RefObject<number>;
  playingRef: React.RefObject<boolean>;
  startZ: (aspect: number) => number;
  timing: Timing;
  onReveal: () => void;
  onComplete: () => void;
}

function Timeline({
  clockRef,
  playingRef,
  startZ,
  timing,
  onReveal,
  onComplete,
}: TimelineProps) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const done = useRef(false);
  const revealed = useRef(false);
  const placed = useRef(false);

  useFrame((_, delta) => {
    const z0 = startZ(size.width / Math.max(1, size.height));

    // Park the camera on the first frame so compile / first paint aren't wrong.
    if (!placed.current) {
      placed.current = true;
      camera.position.set(0, 0.04, z0);
      camera.lookAt(0, 0, -8);
    }

    if (!playingRef.current) return;
    clockRef.current += Math.min(delta, 1 / 30);
    const t = clockRef.current;

    const walk = easeInOutCubic(
      clamp01((t - timing.WALK_START) / timing.WALK_DURATION)
    );
    camera.position.set(
      0,
      0.04 * (1 - walk),
      THREE.MathUtils.lerp(z0, timing.WALK_END_Z, walk)
    );
    camera.lookAt(0, 0, -8);

    if (!revealed.current && t >= timing.WALK_START) {
      revealed.current = true;
      onReveal();
    }

    if (!done.current && t >= timing.TOTAL) {
      done.current = true;
      onComplete();
    }
  });

  return null;
}

function IntroReady({
  playingRef,
  onReady,
  onLive,
}: {
  playingRef: React.RefObject<boolean>;
  onReady: () => void;
  onLive: () => void;
}) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      playingRef.current = true;
      onLive();
      invalidate();
      requestAnimationFrame(() => {
        if (!cancelled) onReady();
      });
    };
    const compile = gl.compileAsync?.(scene, camera) ?? Promise.resolve();
    compile.then(start, start);
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, invalidate, playingRef, onReady, onLive]);

  return null;
}

export interface UpvcDoorwaySceneProps {
  onReady: () => void;
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
  const playingRef = useRef(false);
  const [live, setLive] = useState(false);
  const coarse = useMemo(() => isCoarsePointer(), []);
  const timing = useMemo(() => introTiming(coarse), [coarse]);
  const handleLive = useMemo(() => () => setLive(true), []);

  const openSource = useMemo(
    () => () =>
      easeOutCubic(
        clamp01((clockRef.current - timing.OPEN_START) / timing.OPEN_DURATION)
      ),
    [timing]
  );

  const startZ = useMemo(() => {
    const vHalf = Math.tan(((FOV / 2) * Math.PI) / 180);
    return (aspect: number) =>
      Math.max((spec.height * 1.3) / 2 / vHalf, (spec.width * 1.35) / 2 / (vHalf * aspect));
  }, [spec]);

  const holeHeight = spec.height + (spec.hasThreshold ? 0.05 : 0);

  return (
    <Canvas
      className={className}
      frameloop={live ? "always" : "demand"}
      dpr={[1, coarse ? 1.05 : 1.35]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "default",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0.04, 6], fov: FOV, near: 0.02, far: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <hemisphereLight args={["#f7f4ee", "#c9c2b6", 0.9]} />
      <directionalLight position={[2.4, 3.2, 3]} intensity={1.35} />
      <directionalLight position={[-2.2, 1.2, 2]} intensity={0.4} />

      <Wall holeWidth={spec.width} holeHeight={holeHeight} />
      <UpvcUnit
        spec={spec}
        finish={getFinish("white")}
        hardware={HARDWARE.chrome}
        glazing={GLAZING.clear}
        quality="draft"
        isDoor
        openSource={openSource}
        damping={coarse ? 22 : 18}
      />
      <Timeline
        clockRef={clockRef}
        playingRef={playingRef}
        startZ={startZ}
        timing={timing}
        onReveal={onReveal}
        onComplete={onComplete}
      />
      <IntroReady playingRef={playingRef} onReady={onReady} onLive={handleLive} />
    </Canvas>
  );
}
