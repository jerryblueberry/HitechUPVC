"use client";

/**
 * Self-framing viewer for a single uPVC unit. Used by the opening-types
 * explainer and the product configurator.
 */

import { OrbitControls } from "@react-three/drei";
import Image from "next/image";
import { useMemo } from "react";
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
import { useAutoPlayWake } from "./demand";
import { FitCamera } from "./FitCamera";
import { usePrefersReducedMotion } from "./hooks";
import { PointerFollow } from "./PointerFollow";
import type { RenderQuality } from "./materials";
import { capQuality, useDeviceTier, viewerQuality } from "./quality";
import { UpvcStage } from "./UpvcStage";
import { UpvcUnit } from "./UpvcUnit";

const AUTOPLAY_OPEN_FRACTION = 0.52;

/** Lives inside the canvas, where the wake hook can reach the renderer. */
function AutoPlayWake({ enabled, cycle }: { enabled: boolean; cycle: number }) {
  useAutoPlayWake(enabled, cycle, AUTOPLAY_OPEN_FRACTION);
  return null;
}

export interface UpvcViewerProps {
  openingType: OpeningType;
  category?: ProductCategory;
  finishSlug?: string;
  hardwareSlug?: HardwareSlug;
  glazingSlug?: GlazingSlug;
  /** Controlled opening, 0–1. Ignored when autoPlay is on. */
  open?: number;
  /** Loop the unit open and shut */
  autoPlay?: boolean;
  /** Seconds for a full open + shut cycle */
  cycle?: number;
  /** Let the visitor orbit the unit */
  interactive?: boolean;
  /** Turn the unit toward the cursor, no drag needed */
  followPointer?: boolean;
  quality?: RenderQuality;
  className?: string;
  /** Static poster used when WebGL is unavailable */
  posterAlt?: string;
  /** Above-the-fold: skip approach observer */
  eager?: boolean;
  maxDpr?: number;
  contactShadow?: boolean;
  antialias?: boolean;
  fadeMs?: number;
  onReady?: () => void;
}

export function UpvcViewer({
  openingType,
  category = "windows",
  finishSlug = "white",
  hardwareSlug = "chrome",
  glazingSlug = "clear",
  open = 0,
  autoPlay = false,
  cycle = 7,
  interactive = false,
  followPointer = false,
  quality = "high",
  className,
  posterAlt,
  eager = false,
  maxDpr,
  contactShadow = true,
  antialias,
  fadeMs,
  onReady,
}: UpvcViewerProps) {
  const spec = useMemo(
    () => getUpvcModel(openingType, category),
    [openingType, category]
  );
  const finish = getFinish(finishSlug);
  const hardware = HARDWARE[hardwareSlug];
  const glazing = GLAZING[glazingSlug];
  const isDoor = category === "doors" || openingType === "hinged";
  const reducedMotion = usePrefersReducedMotion();

  // Refraction is an extra render pass per frame, so a unit looping open and
  // shut takes the blended pane. A unit that holds a pose gets the full
  // treatment on any device — orbiting it only draws while the finger moves,
  // which the sharper buffer can carry.
  const tier = useDeviceTier();
  const budget = viewerQuality(tier, autoPlay);
  const effectiveQuality = capQuality(quality, budget.material);
  const effectiveDpr = maxDpr ?? budget.dpr;
  const effectiveAntialias = antialias ?? budget.antialias;
  const effectiveShadow = contactShadow && budget.contactShadow;

  // A square-wave target read every frame; the unit's damping turns it into
  // an eased swing, which is closer to a real closer than a linear tween.
  const openSource = useMemo(() => {
    if (!autoPlay) return undefined;
    return () =>
      (performance.now() / 1000) % cycle < cycle * AUTOPLAY_OPEN_FRACTION ? 1 : 0;
  }, [autoPlay, cycle]);

  const poster = (
    <div className="relative h-full w-full">
      <Image
        src={getUpvcPngForOpening(openingType)}
        alt={posterAlt ?? `${openingType} uPVC unit`}
        fill
        className="object-contain"
        sizes="(min-width: 1024px) 45vw, 90vw"
      />
    </div>
  );

  return (
    <UpvcStage
      className={className}
      fallback={poster}
      fov={30}
      groundY={-spec.height / 2 - (spec.hasSill ? 0.06 : 0.04)}
      cameraPosition={[1.1, 0.35, 3.4]}
      renderWhenReduced={!autoPlay}
      eager={eager}
      maxDpr={effectiveDpr}
      contactShadow={effectiveShadow}
      antialias={effectiveAntialias}
      fadeMs={fadeMs ?? (eager ? 400 : 500)}
      onReady={onReady}
    >
      <AutoPlayWake enabled={autoPlay} cycle={cycle} />

      <FitCamera
        width={spec.width}
        height={spec.height + (spec.hasSill ? 0.06 : 0)}
        depth={spec.frameDepth}
        // Swinging leaves need headroom, sliders barely move outside the frame.
        margin={spec.rig.kind === "slide" ? 1.2 : 1.42}
        azimuth={0.34}
        elevation={0.09}
      />

      <PointerFollow enabled={followPointer && !reducedMotion}>
        <UpvcUnit
          spec={spec}
          finish={finish}
          hardware={hardware}
          glazing={glazing}
          quality={effectiveQuality}
          isDoor={isDoor}
          open={open}
          openSource={openSource}
          damping={autoPlay ? 2.1 : 3.6}
        />
      </PointerFollow>

      {interactive && (
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2 - 0.45}
          maxPolarAngle={Math.PI / 2 + 0.28}
          minAzimuthAngle={-0.85}
          maxAzimuthAngle={0.85}
          dampingFactor={0.08}
        />
      )}
    </UpvcStage>
  );
}
