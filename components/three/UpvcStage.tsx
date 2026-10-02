"use client";

/**
 * Canvas + lighting rig shared by every 3D surface on the site.
 *
 * Lighting is a CC0 Poly Haven studio HDRI (public/hdri/) rather than a drei
 * `preset`, because presets fetch from a CDN at runtime.
 *
 * Rendering is on demand: a frame is drawn only when something invalidates
 * (see ./demand.ts), so a still model costs nothing. The canvas is created
 * just before it scrolls into view, shaders compile off the main thread where
 * supported, and the scene fades in once its first frame is ready.
 */

import "./patchClock";
import { ContactShadows, Environment } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useInvalidateOn } from "./demand";
import {
  holdEagerStage,
  releaseEagerStage,
  useCanHover,
  useEagerStageIdle,
  useHasApproached,
  useInViewport,
  usePageSettled,
  usePrefersReducedMotion,
  useWebGLSupported,
} from "./hooks";

export const HDRI_PATH = "/hdri/studio_small_09_1k.hdr";
/** Half-resolution copy for touch devices: 410 KB instead of 1.6 MB, same look at phone sizes */
export const HDRI_PATH_SMALL = "/hdri/studio_small_09_512.hdr";

export function hdriPathFor(canHover: boolean) {
  return canHover ? HDRI_PATH : HDRI_PATH_SMALL;
}

export interface UpvcStageProps {
  children: ReactNode;
  /** Rendered instead of the canvas when WebGL is missing, lost, or motion is reduced */
  fallback?: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  /** Floor height for the contact shadow, in metres */
  groundY?: number;
  contactShadow?: boolean;
  backdrop?: "transparent" | "studio";
  environmentIntensity?: number;
  /** Device-pixel-ratio ceiling; lower it for full-screen canvases */
  maxDpr?: number;
  /** Reduced motion still renders a static frame unless this is false */
  renderWhenReduced?: boolean;
  /** Skip the approach observer — use for above-the-fold hero canvases */
  eager?: boolean;
  antialias?: boolean;
  /** Fade-in once shaders compile (ms) */
  fadeMs?: number;
  /** Fires after compileAsync + first painted frame */
  onReady?: () => void;
}

/** Compiles every material before the first visible frame, then reports ready. */
function StageReady({ onReady }: { onReady: () => void }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (cancelled) return;
      invalidate();
      // Let the compiled frame land before the fade starts.
      requestAnimationFrame(() => {
        if (!cancelled) onReady();
      });
    };
    gl.compileAsync(scene, camera).then(done, done);
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, invalidate, onReady]);

  return null;
}

/** The canvas keeps its last frame while paused; redraw once it is back on screen. */
function WakeOnView({ inView }: { inView: boolean }) {
  useInvalidateOn([inView]);
  return null;
}

export function UpvcStage({
  children,
  fallback = null,
  className,
  cameraPosition = [0, 0, 3.2],
  fov = 32,
  groundY = -1.1,
  contactShadow = true,
  backdrop = "transparent",
  environmentIntensity = 1,
  maxDpr = 2,
  renderWhenReduced = true,
  eager = false,
  antialias = true,
  fadeMs = 500,
  onReady,
}: UpvcStageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const approached = useHasApproached(hostRef);
  const inView = useInViewport(hostRef);
  const webgl = useWebGLSupported();
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const handleReady = useCallback(() => {
    setReady(true);
    onReady?.();
  }, [onReady]);

  const settled = usePageSettled();
  const canHover = useCanHover();
  const othersIdle = useEagerStageIdle();
  const holding = useRef(false);
  const useFallback =
    webgl === false || contextLost || (reducedMotion && !renderWhenReduced);
  const shouldMount = (eager || (approached && othersIdle)) && settled;

  // Above-the-fold scenes hold the thread until their first frame, or 4.5s.
  useEffect(() => {
    if (!eager || useFallback) return;
    holding.current = true;
    holdEagerStage();
    const release = () => {
      if (!holding.current) return;
      holding.current = false;
      releaseEagerStage();
    };
    const timer = window.setTimeout(release, 4500);
    return () => {
      window.clearTimeout(timer);
      release();
    };
  }, [eager, useFallback]);

  useEffect(() => {
    if (!eager || !ready || !holding.current) return;
    holding.current = false;
    releaseEagerStage();
  }, [eager, ready]);

  return (
    <div ref={hostRef} className={className}>
      {useFallback ? (
        fallback
      ) : webgl === null || !shouldMount ? null : (
        <div
          className="h-full w-full transition-opacity ease-out"
          style={{
            opacity: ready ? 1 : 0,
            transitionDuration: `${fadeMs}ms`,
          }}
        >
          <Canvas
            dpr={[1, maxDpr]}
            frameloop={inView || eager ? "demand" : "never"}
            gl={{
              antialias,
              alpha: backdrop === "transparent",
              // "high-performance" wakes the discrete GPU on dual-GPU laptops,
              // which stalls the page and drains the battery for no visible gain.
              powerPreference: "default",
              stencil: false,
            }}
            camera={{ position: cameraPosition, fov, near: 0.05, far: 60 }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.05;
              gl.domElement.addEventListener(
                "webglcontextlost",
                (event) => {
                  event.preventDefault();
                  setContextLost(true);
                },
                { once: true }
              );
            }}
          >
            <WakeOnView inView={inView || eager} />

            {/* HDRI does the heavy lifting; the key light just sharpens the
                chamfer highlights and drives the contact shadow. */}
            <directionalLight position={[2.6, 3.4, 2.8]} intensity={1.15} />
            <directionalLight position={[-3, 1.2, -2]} intensity={0.35} />

            <Suspense fallback={null}>
              <Environment
                files={hdriPathFor(canHover)}
                environmentIntensity={environmentIntensity}
                background={backdrop === "studio"}
                backgroundBlurriness={0.85}
                backgroundIntensity={0.55}
              />
              {children}
              <StageReady onReady={handleReady} />
            </Suspense>

            {contactShadow && (
              <ContactShadows
                position={[0, groundY, 0]}
                opacity={0.42}
                scale={9}
                blur={2.4}
                far={2.4}
                // The blur hides the difference between 256 and 512.
                resolution={256}
                color="#2a241c"
              />
            )}
          </Canvas>
        </div>
      )}
    </div>
  );
}
