"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { probeWebGL } from "@/components/three/hooks";
import { LazyUpvcDoorwayScene } from "@/components/three/LazyUpvcDoorwayScene";
import { BrandLogo } from "@/components/ui/BrandLogo";

const SESSION_KEY = "upvc-doorway-intro";
/** Give up and reveal the page if three.js + the HDRI haven't loaded by then */
const LOAD_TIMEOUT_MS = 4000;

const noopSubscribe = () => () => {};

function shouldPlaySnapshot(): boolean {
  return (
    !window.sessionStorage.getItem(SESSION_KEY) &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    probeWebGL()
  );
}

interface DoorwayIntroProps {
  brand: string;
  /** Fires as the doors open onto the page, or immediately if the intro is skipped */
  onReveal?: () => void;
}

/**
 * First-visit intro: 3D French doors open and the camera walks through into
 * the page. Plays once per session; skipped for reduced motion / no WebGL.
 * The server renders the cover so there is no flash of the page beneath.
 */
export function DoorwayIntro({ brand, onReveal }: DoorwayIntroProps) {
  const shouldPlay = useSyncExternalStore(noopSubscribe, shouldPlaySnapshot, () => true);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const visible = shouldPlay && !finished;

  const finish = useCallback(() => {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    setFinished(true);
    onReveal?.();
  }, [onReveal]);

  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!visible) {
      onReveal?.();
      return;
    }

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [visible, onReveal]);

  useEffect(() => {
    if (!visible || ready) return;
    const timer = setTimeout(finish, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [visible, ready, finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="doorway-intro"
          className="fixed inset-0 z-[100] cursor-pointer"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={finish}
          aria-hidden
        >
          {/* Cover while three.js loads; the 3D wall is the same colour, so the handover is invisible. */}
          <motion.div
            className="absolute inset-0 bg-surface"
            animate={{ opacity: ready ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.p
            className="absolute inset-0 flex items-center justify-center text-center text-3xl text-charcoal"
            initial={{ opacity: 0, y: 6 }}
            animate={ready ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
            transition={{ duration: ready ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandLogo name={brand} className="items-center" subClassName="text-charcoal/60" />
          </motion.p>

          <LazyUpvcDoorwayScene
            className="!absolute inset-0"
            onReady={handleReady}
            onReveal={() => onReveal?.()}
            onComplete={finish}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
