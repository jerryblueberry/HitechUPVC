"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { probeWebGL } from "@/components/three/hooks";
import { LazyUpvcDoorwayScene } from "@/components/three/LazyUpvcDoorwayScene";
import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  hasSeenIntro,
  lockIntro,
  markIntroSeen,
  unlockIntro,
} from "@/lib/introSession";

/** Fail open — never hold the page behind a stuck loader */
const LOAD_TIMEOUT_MS = 2400;
const EXIT_MS = 240;
const HERO_HDRI = "/hdri/studio_small_09_1k.hdr";
const ease = [0.22, 1, 0.36, 1] as const;

const noopSubscribe = () => () => {};

type ConstrainedNavigator = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

/** Phones, data-saver and low-memory devices go straight to the page. */
function isConstrainedDevice(): boolean {
  const nav = navigator as ConstrainedNavigator;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    nav.connection?.saveData === true ||
    (nav.deviceMemory !== undefined && nav.deviceMemory < 4)
  );
}

function shouldPlaySnapshot(): boolean {
  return (
    !hasSeenIntro() &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !isConstrainedDevice() &&
    probeWebGL()
  );
}

interface DoorwayIntroProps {
  brand: string;
  logo: string;
  /** Fires as the camera starts walking through, or immediately if skipped */
  onReveal?: () => void;
  /** Fires when the overlay unmounts (or immediately if skipped) */
  onComplete?: () => void;
}

/**
 * First-visit intro: 3D French doors open and the camera walks through into
 * the page. Plays once per session; skipped for reduced motion, no WebGL,
 * and touch / data-saver / low-memory devices.
 * The cover is painted immediately so there is no flash of the page beneath.
 */
export function DoorwayIntro({ brand, logo, onReveal, onComplete }: DoorwayIntroProps) {
  const shouldPlay = useSyncExternalStore(noopSubscribe, shouldPlaySnapshot, () => true);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [finished, setFinished] = useState(false);
  const finishing = useRef(false);
  const visible = shouldPlay && !finished;

  const finish = useCallback(() => {
    if (finishing.current) return;
    finishing.current = true;
    markIntroSeen();
    unlockIntro();
    onReveal?.();
    // Drop the WebGL canvas immediately so the hero can claim a context,
    // then fade the cover and hand off.
    setExiting(true);
    window.setTimeout(() => {
      setFinished(true);
      onComplete?.();
    }, EXIT_MS);
  }, [onReveal, onComplete]);

  const handleReady = useCallback(() => setReady(true), []);
  const handleReveal = useCallback(() => onReveal?.(), [onReveal]);

  useLayoutEffect(() => {
    if (!visible) return;
    lockIntro();
    return () => unlockIntro();
  }, [visible]);

  useEffect(() => {
    if (shouldPlay) return;
    onReveal?.();
    onComplete?.();
  }, [shouldPlay, onReveal, onComplete]);

  useEffect(() => {
    if (!visible || ready || exiting) return;
    const timer = window.setTimeout(finish, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [visible, ready, exiting, finish]);

  useEffect(() => {
    if (!finished) return;
    void fetch(HERO_HDRI, { cache: "force-cache" });
  }, [finished]);

  useEffect(() => {
    if (!visible || exiting) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [visible, exiting]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="doorway-intro"
          className="fixed inset-0 z-[100] cursor-pointer pointer-coarse:hidden"
          initial={false}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease }}
          onClick={finish}
          aria-hidden
        >
          <motion.div
            className="absolute inset-0 bg-surface"
            animate={{ opacity: ready && !exiting ? 0 : 1 }}
            transition={{ duration: 0.14, ease }}
          />
          <motion.p
            className="absolute inset-0 flex items-center justify-center text-center text-3xl text-charcoal"
            initial={false}
            animate={
              ready && !exiting
                ? { opacity: 0, y: -6 }
                : { opacity: exiting ? 0 : 1, y: 0 }
            }
            transition={{ duration: 0.16, ease }}
          >
            <BrandLogo
              name={brand}
              src={logo}
              priority
              className="text-3xl"
              subClassName="text-charcoal/60"
            />
          </motion.p>

          {!exiting && (
            <LazyUpvcDoorwayScene
              className="!absolute inset-0"
              onReady={handleReady}
              onReveal={handleReveal}
              onComplete={finish}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
