"use client";

/**
 * Scroll-driven product sequence: the camera moves through a set of shots
 * while the door opens, all keyed off a single scroll value.
 *
 * Progress arrives through a ref rather than a prop so scrolling never
 * re-renders React — the whole sequence runs inside one useFrame.
 *
 * Raw scroll is exponentially smoothed first (trackpad / finger jitter), then
 * the camera and open angle read that smoothed value. One damp stage — not
 * two — keeps the motion locked to the finger the way Apple product pages do.
 * Touch and pointer use the same constant, so the sequence answers a flick and
 * a wheel the same way.
 */

import { useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { OpeningType, ProductCategory } from "@/lib/types";
import {
  getFinish,
  getUpvcModel,
  GLAZING,
  HARDWARE,
  type GlazingSlug,
  type HardwareSlug,
} from "@/lib/upvc3d";
import { getUpvcPngForOpening } from "@/lib/upvcAssets";
import { SETTLE_EPSILON } from "./demand";
import { sceneQuality, useDeviceTier } from "./quality";
import { UpvcStage } from "./UpvcStage";
import { UpvcUnit } from "./UpvcUnit";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

/** How quickly smoothed progress catches the finger (higher = snappier). */
const PROGRESS_LAMBDA = 18;
/** Door leaf catch-up — slightly softer than the camera for a physical feel. */
const OPEN_DAMPING = 9;
/** A frame this long is under 42fps — visible as a stutter in a moving camera. */
const SLOW_FRAME_S = 0.024;
/** Compile and texture decode land in the first frames; they are not stutter. */
const WARMUP_FRAMES = 20;
/** How far slow frames have to outrun smooth ones before the buffer steps down. */
const SLOW_FRAME_BUDGET = 8;

export interface CameraShot {
  /** Scroll position this shot is fully composed at, 0–1 */
  at: number;
  position: [number, number, number];
  target: [number, number, number];
}

function CameraRig({
  progressRef,
  smoothProgressRef,
  shots,
  reducedDpr,
}: {
  progressRef: RefObject<number>;
  smoothProgressRef: RefObject<number>;
  shots: CameraShot[];
  reducedDpr: number;
}) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const setDpr = useThree((state) => state.setDpr);

  // Wake only while this canvas is on screen. A page-wide touch listener
  // kept the scene redrawing while the visitor scrolled the rest of the page.
  const lastInputAt = useRef(0);
  const inView = useRef(false);
  useEffect(() => {
    const wake = () => {
      if (!inView.current) return;
      lastInputAt.current = performance.now();
      invalidate();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) wake();
      },
      { rootMargin: "80px" }
    );
    observer.observe(gl.domElement);
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", wake);
    };
  }, [gl, invalidate]);

  const keys = useMemo(
    () =>
      shots.map((shot) => ({
        at: shot.at,
        position: new THREE.Vector3(...shot.position),
        target: new THREE.Vector3(...shot.target),
      })),
    [shots]
  );

  const desiredPosition = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const initialised = useRef(false);
  const shotsId = useRef(shots);

  // The scene opens at full resolution and keeps it unless this device proves
  // it cannot hold a smooth frame there. One step down per visit: a buffer
  // resize costs a frame, so sizing it back and forth would cause the very
  // stutter it is meant to avoid.
  const warmup = useRef(0);
  const slowScore = useRef(0);
  const stepped = useRef(false);

  // Crossing the desktop/mobile breakpoint swaps the shot set — snap, don't damp.
  useEffect(() => {
    if (shotsId.current === shots) return;
    shotsId.current = shots;
    initialised.current = false;
    invalidate();
  }, [shots, invalidate]);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    const raw = clamp01(progressRef.current);

    if (!initialised.current) {
      smoothProgressRef.current = raw;
      initialised.current = true;
    } else {
      smoothProgressRef.current = THREE.MathUtils.damp(
        smoothProgressRef.current,
        raw,
        PROGRESS_LAMBDA,
        step
      );
    }

    const p = clamp01(smoothProgressRef.current);

    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1].at) i++;
    const from = keys[i];
    const to = keys[i + 1];
    const span = Math.max(1e-4, to.at - from.at);
    const t = smooth(clamp01((p - from.at) / span));

    desiredPosition.current.lerpVectors(from.position, to.position, t);
    desiredTarget.current.lerpVectors(from.target, to.target, t);

    camera.position.copy(desiredPosition.current);
    camera.lookAt(desiredTarget.current);

    const catchingUp =
      Math.abs(smoothProgressRef.current - raw) > SETTLE_EPSILON;
    const recentlyInput = performance.now() - lastInputAt.current < 320;
    const moving = catchingUp || recentlyInput;

    if (warmup.current < WARMUP_FRAMES) {
      warmup.current += 1;
    } else if (
      !stepped.current &&
      moving &&
      delta < 0.2 &&
      reducedDpr < state.viewport.dpr
    ) {
      slowScore.current = Math.max(
        0,
        slowScore.current + (delta > SLOW_FRAME_S ? 1 : -1)
      );
      if (slowScore.current >= SLOW_FRAME_BUDGET) {
        stepped.current = true;
        setDpr(reducedDpr);
      }
    }

    if (moving) {
      state.invalidate();
    }
  });

  return null;
}

export interface UpvcScrollSceneProps {
  progressRef: RefObject<number>;
  shots: CameraShot[];
  openingType?: OpeningType;
  category?: ProductCategory;
  finishSlug?: string;
  hardwareSlug?: HardwareSlug;
  glazingSlug?: GlazingSlug;
  /** Scroll range over which the unit opens */
  openFrom?: number;
  openTo?: number;
  fov?: number;
  className?: string;
}

export function UpvcScrollScene({
  progressRef,
  shots,
  openingType = "hinged",
  category = "doors",
  finishSlug = "white",
  hardwareSlug = "brushed",
  glazingSlug = "clear",
  openFrom = 0.18,
  openTo = 0.68,
  fov = 34,
  className,
}: UpvcScrollSceneProps) {
  const quality = sceneQuality(useDeviceTier());
  const smoothProgressRef = useRef(0);

  const spec = useMemo(
    () => getUpvcModel(openingType, category),
    [openingType, category]
  );

  const openSource = useMemo(
    () => () => {
      const p = clamp01(smoothProgressRef.current);
      return smooth(clamp01((p - openFrom) / (openTo - openFrom)));
    },
    [openFrom, openTo]
  );

  const poster = (
    <div className="relative h-full w-full">
      <Image
        src={getUpvcPngForOpening(openingType)}
        alt={`${openingType} uPVC door`}
        fill
        className="object-contain"
        sizes="100vw"
        priority={false}
      />
    </div>
  );

  return (
    <UpvcStage
      className={className}
      fallback={poster}
      fov={fov}
      groundY={-spec.height / 2 - 0.03}
      cameraPosition={shots[0].position}
      maxDpr={quality.dpr}
      antialias={quality.antialias}
      contactShadow={quality.contactShadow}
      fadeMs={450}
      renderWhenReduced={false}
      environmentIntensity={1.05}
    >
      <CameraRig
        progressRef={progressRef}
        smoothProgressRef={smoothProgressRef}
        shots={shots}
        reducedDpr={quality.reducedDpr}
      />
      <UpvcUnit
        spec={spec}
        finish={getFinish(finishSlug)}
        hardware={HARDWARE[hardwareSlug]}
        glazing={GLAZING[glazingSlug]}
        isDoor={category === "doors" || openingType === "hinged"}
        openSource={openSource}
        damping={OPEN_DAMPING}
      />
    </UpvcStage>
  );
}
