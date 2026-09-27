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
  useHasApproached,
  useInViewport,
  usePrefersReducedMotion,
  useWebGLSupported,
} from "./hooks";

export const HDRI_PATH = "/hdri/studio_small_09_1k.hdr";

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
}: UpvcStageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const approached = useHasApproached(hostRef);
  const inView = useInViewport(hostRef);
  const webgl = useWebGLSupported();
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  const useFallback =
    webgl === false || contextLost || (reducedMotion && !renderWhenReduced);

  return (
    <div ref={hostRef} className={className}>
      {useFallback ? (
        fallback
      ) : webgl === null || !approached ? null : (
        <div
          className={`h-full w-full transition-opacity duration-700 ease-out ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <Canvas
            dpr={[1, maxDpr]}
            frameloop={inView ? "demand" : "never"}
            gl={{
              antialias: true,
              alpha: backdrop === "transparent",
              // "high-performance" wakes the discrete GPU on dual-GPU laptops,
              // which stalls the page and drains the battery for no visible gain.
              powerPreference: "default",
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
            <WakeOnView inView={inView} />

            {/* HDRI does the heavy lifting; the key light just sharpens the
                chamfer highlights and drives the contact shadow. */}
            <directionalLight position={[2.6, 3.4, 2.8]} intensity={1.15} />
            <directionalLight position={[-3, 1.2, -2]} intensity={0.35} />

            <Suspense fallback={null}>
              <Environment
                files={HDRI_PATH}
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
