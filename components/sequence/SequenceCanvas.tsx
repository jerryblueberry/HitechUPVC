"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import type { FrameSequence } from "@/lib/sequences";
import { getFrameStore } from "./frameStore";
import { SequencePainter, type SequenceFit } from "./SequencePainter";

type SequenceCanvasProps = {
  sequence: FrameSequence;
  /** 0 → first frame, 1 → last frame. */
  progress: MotionValue<number>;
  fit?: SequenceFit;
  /** Exponential smoothing rate (1/s) toward `progress`; 0 paints it directly. */
  smoothing?: number;
  /** Start downloading frames. Flip on as the canvas approaches the viewport. */
  load?: boolean;
  onFirstPaint?: () => void;
  className?: string;
};

/**
 * Plays a pre-rendered frame sequence on a 2D canvas. Costs one image decode
 * per frame and a couple of drawImage calls per paint, so phones and
 * low-memory laptops get the same motion as a desktop GPU.
 */
export function SequenceCanvas({
  sequence,
  progress,
  fit = "contain",
  smoothing = 0,
  load = true,
  onFirstPaint,
  className,
}: SequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firstPaintRef = useRef(onFirstPaint);

  useEffect(() => {
    firstPaintRef.current = onFirstPaint;
  }, [onFirstPaint]);

  useEffect(() => {
    if (load) getFrameStore(sequence).start();
  }, [load, sequence]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const store = getFrameStore(sequence);
    const painter = new SequencePainter(canvas, store, fit, () =>
      firstPaintRef.current?.()
    );
    const last = sequence.count - 1;

    let current = progress.get();
    let raf = 0;
    let lastTime = 0;

    painter.setPosition(current * last);

    const tick = (time: number) => {
      const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const target = progress.get();
      current += (target - current) * (1 - Math.exp(-smoothing * dt));
      if (Math.abs(target - current) < 0.0004) current = target;
      painter.setPosition(current * last);
      raf = current === target ? 0 : requestAnimationFrame(tick);
      if (!raf) lastTime = 0;
    };

    const unsubscribe = progress.on("change", (value) => {
      if (smoothing <= 0) {
        current = value;
        painter.setPosition(value * last);
        return;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      painter.dispose();
    };
  }, [sequence, progress, fit, smoothing]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
