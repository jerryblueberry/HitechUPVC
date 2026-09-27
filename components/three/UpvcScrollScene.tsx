"use client";

/**
 * Scroll-driven product sequence: the camera moves through a set of shots
 * while the door opens, all keyed off a single scroll value.
 *
 * Progress arrives through a ref rather than a prop so scrolling never
 * re-renders React — the whole sequence runs inside one useFrame.
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
import { UpvcStage } from "./UpvcStage";
import { UpvcUnit } from "./UpvcUnit";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

export interface CameraShot {
  /** Scroll position this shot is fully composed at, 0–1 */
  at: number;
  position: [number, number, number];
  target: [number, number, number];
}

function CameraRig({
  progressRef,
  shots,
}: {
  progressRef: RefObject<number>;
  shots: CameraShot[];
}) {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  // Scroll is the only input; the frame loop idles between scroll events.
  // Progress is written by framer-motion a frame or so after the scroll event,
  // so keep rendering briefly after the last one to pick up its final value.
  const lastScrollAt = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      lastScrollAt.current = performance.now();
      invalidate();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [invalidate]);

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
  const currentPosition = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3());
  const initialised = useRef(false);

  useFrame((state, delta) => {
    const p = clamp01(progressRef.current);

    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1].at) i++;
    const from = keys[i];
    const to = keys[i + 1];
    const span = Math.max(1e-4, to.at - from.at);
    const t = smooth(clamp01((p - from.at) / span));

    desiredPosition.current.lerpVectors(from.position, to.position, t);
    desiredTarget.current.lerpVectors(from.target, to.target, t);

    if (!initialised.current) {
      currentPosition.current.copy(desiredPosition.current);
      currentTarget.current.copy(desiredTarget.current);
      initialised.current = true;
    }

    // Damping smooths the step changes a trackpad produces between frames.
    const step = Math.min(delta, 0.1);
    const lambda = 6;
    currentPosition.current.set(
      THREE.MathUtils.damp(currentPosition.current.x, desiredPosition.current.x, lambda, step),
      THREE.MathUtils.damp(currentPosition.current.y, desiredPosition.current.y, lambda, step),
      THREE.MathUtils.damp(currentPosition.current.z, desiredPosition.current.z, lambda, step)
    );
    currentTarget.current.set(
      THREE.MathUtils.damp(currentTarget.current.x, desiredTarget.current.x, lambda, step),
      THREE.MathUtils.damp(currentTarget.current.y, desiredTarget.current.y, lambda, step),
      THREE.MathUtils.damp(currentTarget.current.z, desiredTarget.current.z, lambda, step)
    );

    camera.position.copy(currentPosition.current);
    camera.lookAt(currentTarget.current);

    if (
      performance.now() - lastScrollAt.current < 250 ||
      currentPosition.current.distanceToSquared(desiredPosition.current) > 1e-6 ||
      currentTarget.current.distanceToSquared(desiredTarget.current) > 1e-6
    ) {
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
  const spec = useMemo(
    () => getUpvcModel(openingType, category),
    [openingType, category]
  );

  const openSource = useMemo(
    () => () => clamp01((clamp01(progressRef.current) - openFrom) / (openTo - openFrom)),
    [progressRef, openFrom, openTo]
  );

  const poster = (
    <div className="relative h-full w-full">
      <Image
        src={getUpvcPngForOpening(openingType)}
        alt={`${openingType} uPVC door`}
        fill
        className="object-contain"
        sizes="100vw"
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
      maxDpr={1.5}
      renderWhenReduced={false}
      environmentIntensity={1.05}
    >
      <CameraRig progressRef={progressRef} shots={shots} />
      <UpvcUnit
        spec={spec}
        finish={getFinish(finishSlug)}
        hardware={HARDWARE[hardwareSlug]}
        glazing={GLAZING[glazingSlug]}
        isDoor={category === "doors" || openingType === "hinged"}
        openSource={openSource}
        damping={7}
      />
    </UpvcStage>
  );
}
