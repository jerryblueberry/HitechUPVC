"use client";

/**
 * Apple-style scroll scrub: a short WebM driven by a 0–1 MotionValue.
 * Used on low-tier home when published videos exist — same pixels as the
 * capture studio, one HTTP request instead of dozens of WebPs.
 */

import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

type SequenceVideoProps = {
  src: string;
  /** Poster still (usually frame 0) shown until the video can seek. */
  poster?: string;
  progress: MotionValue<number>;
  /** Exponential smoothing rate (1/s); 0 seeks directly. */
  smoothing?: number;
  onReady?: () => void;
  className?: string;
};

export function SequenceVideo({
  src,
  poster,
  progress,
  smoothing = 18,
  onReady,
  className,
}: SequenceVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readyRef = useRef(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let current = progress.get();
    let lastTime = 0;

    const seek = (t: number) => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      const next = Math.min(duration - 0.001, Math.max(0, t * duration));
      // Avoid thrashing the decoder with sub-frame seeks.
      if (Math.abs(video.currentTime - next) > 0.012) {
        video.currentTime = next;
      }
    };

    const markReady = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      seek(progress.get());
      onReadyRef.current?.();
    };

    if (video.readyState >= 1) markReady();
    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("canplay", markReady);

    const tick = (time: number) => {
      const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const target = progress.get();
      current += (target - current) * (1 - Math.exp(-smoothing * dt));
      if (Math.abs(target - current) < 0.0004) current = target;
      seek(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
      if (!raf) lastTime = 0;
    };

    const unsubscribe = progress.on("change", () => {
      if (smoothing <= 0) {
        current = progress.get();
        seek(current);
        return;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("canplay", markReady);
    };
  }, [progress, smoothing, src]);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      aria-hidden
    />
  );
}
