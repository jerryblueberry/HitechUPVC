"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;
const CROSSFADE_S = 0.42;

interface OpeningSequencePlayerProps {
  frames: readonly string[];
  alt: string;
  className?: string;
  /** Milliseconds each frame is held before advancing */
  interval?: number;
  /** Ping-pong open → close loop */
  loop?: boolean;
  /** External play/pause control */
  playing?: boolean;
  priority?: boolean;
  variant?: "light" | "dark";
  showProgress?: boolean;
  /** Strip card chrome for hero/carousel embedding */
  bare?: boolean;
}

/** Cycles real product frames for open/close motion — GPU opacity only */
export function OpeningSequencePlayer({
  frames,
  alt,
  className = "",
  interval = 900,
  loop = true,
  playing: playingProp,
  priority = false,
  variant = "light",
  showProgress = true,
  bare = false,
}: OpeningSequencePlayerProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.25, once: false });
  const [frameIndex, setFrameIndex] = useState(0);
  const directionRef = useRef(1);
  const [hovered, setHovered] = useState(false);

  const shouldAnimate =
    !reducedMotion &&
    frames.length > 1 &&
    isInView &&
    (playingProp ?? true) &&
    !hovered;

  const resetSequence = useCallback(() => {
    setFrameIndex(0);
    directionRef.current = 1;
  }, []);

  useEffect(() => {
    resetSequence();
  }, [frames, resetSequence]);

  useEffect(() => {
    if (!shouldAnimate) return;

    const timer = window.setInterval(() => {
      setFrameIndex((prev) => {
        if (!loop) {
          return prev >= frames.length - 1 ? prev : prev + 1;
        }

        const dir = directionRef.current;
        const next = prev + dir;
        if (next >= frames.length - 1) {
          directionRef.current = -1;
          return frames.length - 1;
        }
        if (next <= 0) {
          directionRef.current = 1;
          return 0;
        }
        return next;
      });
    }, interval);

    return () => window.clearInterval(timer);
  }, [shouldAnimate, frames.length, interval, loop]);

  useEffect(() => {
    frames.slice(1).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [frames]);

  const bgStyle =
    variant === "dark"
      ? {
          background:
            "linear-gradient(145deg, #1a2832 0%, #243442 45%, #1e2d38 100%)",
        }
      : {
          background:
            "linear-gradient(145deg, #e7e4df 0%, #f7f6f3 45%, #ede8df 100%)",
        };

  const glowStyle =
    variant === "dark"
      ? "radial-gradient(circle at 50% 40%, rgba(182,154,107,0.18) 0%, transparent 65%)"
      : "radial-gradient(circle at 50% 40%, rgba(182,154,107,0.25) 0%, transparent 65%)";

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${bare ? "" : "rounded-2xl"} ${className}`}
      style={bare ? undefined : bgStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        resetSequence();
      }}
      role="img"
      aria-label={alt}
    >
      {!bare && (
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ background: glowStyle }}
          aria-hidden
        />
      )}

      <div
        className={`relative z-10 flex items-center justify-center h-full ${
          bare ? "" : "min-h-[280px] p-6 lg:p-10"
        }`}
      >
        <div
          className={`relative w-full ${
            bare ? "max-h-[72vh] aspect-[3/4]" : "max-w-[420px] aspect-[3/4]"
          }`}
        >
          {frames.map((src, i) => (
            <motion.div
              key={src}
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: i === frameIndex ? 1 : 0 }}
              transition={{ duration: CROSSFADE_S, ease }}
              aria-hidden={i !== frameIndex}
            >
              <Image
                src={src}
                alt={i === frameIndex ? alt : ""}
                width={420}
                height={560}
                priority={priority && i === 0}
                loading={priority && i === 0 ? undefined : "lazy"}
                className={`object-contain w-full h-full ${
                  variant === "dark"
                    ? "drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
                    : "drop-shadow-[0_24px_48px_rgba(14,42,62,0.18)]"
                }`}
                sizes="(max-width: 768px) 90vw, 420px"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {showProgress && frames.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5"
          aria-hidden
        >
          {frames.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === frameIndex
                  ? variant === "dark"
                    ? "w-5 bg-gold"
                    : "w-5 bg-navy"
                  : variant === "dark"
                    ? "w-1.5 bg-surface/30"
                    : "w-1.5 bg-charcoal/20"
              }`}
            />
          ))}
        </div>
      )}

      {hovered && frames.length > 1 && !reducedMotion && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-20 text-[10px] uppercase tracking-widest text-surface/50 bg-charcoal/60 px-2 py-1 rounded-full backdrop-blur-sm"
        >
          Paused
        </motion.p>
      )}
    </div>
  );
}
