"use client";

import type { FrameStore } from "./frameStore";

export type SequenceFit = "cover" | "contain";

/** Device pixels per CSS pixel; above 2 costs fill-rate without visible gain. */
const MAX_DPR = 2;

/**
 * Draws a fractional frame position onto a 2D canvas.
 *
 * Adjacent loaded frames get a normal alpha dissolve (`source-over`) — that
 * softens the step between two nearly identical poses without blowing out the
 * whites. Larger gaps (still loading, or a metered stride) snap to the nearest
 * frame: blending far-apart poses of a transparent unit is what made the
 * motion look ghosted and corrupted. Never use additive (`lighter`) blending.
 */
export class SequencePainter {
  private readonly ctx: CanvasRenderingContext2D | null;
  private position = 0;
  private raf = 0;
  private painted = false;
  private lastKey = "";
  private readonly resizeObserver: ResizeObserver;
  private readonly unsubscribe: () => void;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly store: FrameStore,
    private readonly fit: SequenceFit,
    private readonly onFirstPaint?: () => void
  ) {
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.unsubscribe = store.subscribe(() => this.schedule());
    this.resize();
  }

  setPosition(position: number) {
    if (position === this.position) return;
    this.position = position;
    this.schedule();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.unsubscribe();
  }

  private schedule() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.paint();
    });
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.lastKey = "";
    }
    this.paint();
  }

  private paint() {
    const ctx = this.ctx;
    if (!ctx) return;
    const { width, height } = this.canvas;
    const [a, b, t, lo, hi] = this.store.pair(this.position);
    if (!a) return;

    const adjacent = Boolean(b && hi - lo === 1);
    const blend = adjacent && t > 0.02 && t < 0.98;
    const key = blend
      ? `${lo}-${hi}-${(t * 32) | 0}`
      : String(t < 0.5 ? lo : hi);
    if (key === this.lastKey && this.painted) return;
    this.lastKey = key;

    const seq = this.store.sequence;
    const scale =
      this.fit === "cover"
        ? Math.max(width / seq.width, height / seq.height)
        : Math.min(width / seq.width, height / seq.height);
    const w = seq.width * scale;
    const h = seq.height * scale;
    const x = (width - w) / 2;
    const y = (height - h) / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalCompositeOperation = "source-over";

    if (blend && b) {
      ctx.globalAlpha = 1 - t;
      ctx.drawImage(a, x, y, w, h);
      ctx.globalAlpha = t;
      ctx.drawImage(b, x, y, w, h);
      ctx.globalAlpha = 1;
    } else {
      const frame = !b || t < 0.5 ? a : b;
      ctx.drawImage(frame, x, y, w, h);
    }

    if (!this.painted) {
      this.painted = true;
      this.onFirstPaint?.();
    }
  }
}
