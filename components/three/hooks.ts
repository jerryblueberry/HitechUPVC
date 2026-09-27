"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Tracks the prefers-reduced-motion media query, including later changes. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

const HOVER_QUERY = "(hover: hover)";

function subscribeToHover(onChange: () => void) {
  const query = window.matchMedia(HOVER_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Whether the primary input can hover — touch devices get autoplay instead. */
export function useCanHover(): boolean {
  return useSyncExternalStore(
    subscribeToHover,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => false
  );
}

// Probed once per session — creating throwaway canvases is not free.
let webglSupport: boolean | null = null;

export function probeWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;

  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    webglSupport = false;
  }

  return webglSupport;
}

const noopSubscribe = () => () => {};

/** `null` during server render, then whether WebGL is actually usable. */
export function useWebGLSupported(): boolean | null {
  return useSyncExternalStore(noopSubscribe, probeWebGL, () => null);
}

/**
 * Pauses rendering while the canvas is off-screen. Several canvases on one
 * page is fine; several canvases all rendering at 60fps is not.
 */
export function useInViewport<T extends Element>(
  ref: React.RefObject<T | null>,
  rootMargin = "200px"
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/**
 * Flips to true the first time the element comes within `rootMargin` of the
 * viewport and stays true, so canvases are created just before they are seen
 * instead of all at once on page load.
 */
export function useHasApproached<T extends Element>(
  ref: React.RefObject<T | null>,
  rootMargin = "600px"
): boolean {
  const [approached, setApproached] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || approached) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setApproached(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin, approached]);

  return approached;
}
