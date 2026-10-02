"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  isIntroLocked,
  subscribeIntroLock,
} from "@/lib/introSession";

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

const COARSE_QUERY = "(pointer: coarse)";

function subscribeToCoarse(onChange: () => void) {
  const query = window.matchMedia(COARSE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True on touch-first devices, where a second canvas should wait until it is on screen. */
export function useCoarsePointer(): boolean {
  return useSyncExternalStore(
    subscribeToCoarse,
    () => window.matchMedia(COARSE_QUERY).matches,
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

// Flipped once per page load, after the load event and an idle slot, so
// canvas creation and shader compiles never compete with hydration or the
// first paint of the page copy.
let pageSettled = false;
let settleScheduled = false;
const settleListeners = new Set<() => void>();

function scheduleSettle() {
  if (settleScheduled) return;
  settleScheduled = true;

  const finish = () => {
    pageSettled = true;
    settleListeners.forEach((listener) => listener());
  };
  const whenIdle = () => {
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(finish, { timeout: 1500 });
    } else {
      setTimeout(finish, 250);
    }
  };

  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
}

function subscribeToSettle(onChange: () => void) {
  scheduleSettle();
  settleListeners.add(onChange);
  return () => {
    settleListeners.delete(onChange);
  };
}

/** False until the page has loaded and the main thread has had a quiet moment. */
export function usePageSettled(): boolean {
  return useSyncExternalStore(subscribeToSettle, () => pageSettled, () => false);
}

// The above-the-fold canvas compiles first. Later scenes wait until it has
// painted, so a phone never builds two WebGL contexts in the same frame.
let eagerHolds = 0;
const eagerListeners = new Set<() => void>();

function changeEagerHolds(delta: number) {
  const next = Math.max(0, eagerHolds + delta);
  if (next === eagerHolds) return;
  eagerHolds = next;
  if (eagerHolds === 0) eagerListeners.forEach((listener) => listener());
}

export function holdEagerStage() {
  changeEagerHolds(1);
}

export function releaseEagerStage() {
  changeEagerHolds(-1);
}

function subscribeToEagerIdle(onChange: () => void) {
  eagerListeners.add(onChange);
  return () => {
    eagerListeners.delete(onChange);
  };
}

/** True once every above-the-fold canvas has released its hold. */
export function useEagerStageIdle(): boolean {
  return useSyncExternalStore(
    subscribeToEagerIdle,
    () => eagerHolds === 0,
    () => true
  );
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
 * instead of all at once on page load. Stays false while the doorway intro
 * holds the WebGL lock.
 */
export function useHasApproached<T extends Element>(
  ref: React.RefObject<T | null>,
  rootMargin = "220px"
): boolean {
  const [approached, setApproached] = useState(false);
  const [lockTick, setLockTick] = useState(0);

  useEffect(() => subscribeIntroLock(() => setLockTick((n) => n + 1)), []);

  useEffect(() => {
    if (approached || isIntroLocked()) return;
    const element = ref.current;
    if (!element) return;

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
  }, [ref, rootMargin, approached, lockTick]);

  return approached;
}
