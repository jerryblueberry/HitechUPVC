"use client";

/**
 * Progressive frame loader shared by every sequence on the page.
 *
 * Frames arrive coarse-to-fine: first and last, then every 16th, 8th, 4th…
 * so a usable sequence exists after a handful of requests and fills in while
 * the visitor reads. Slow or metered connections stop at a coarser stride.
 */

import { probeDeviceTier } from "@/components/three/quality";
import { frameUrl, type FrameSequence } from "@/lib/sequences";

type ConnectionNavigator = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

const CONCURRENCY = 8;

/** Finest stride this visit will download: 1 = every frame. */
function finestStride(): number {
  const connection = (navigator as ConnectionNavigator).connection;
  // Save-Data / 2g: coarse grid only. Everything else loads every frame so
  // the soft dissolve matches the live desktop swing.
  if (
    connection?.saveData ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "slow-2g"
  ) {
    return 4;
  }
  if (connection?.effectiveType === "3g" && probeDeviceTier() === "low") {
    return 2;
  }
  return 1;
}

function loadOrder(count: number, minStride: number): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  const push = (index: number) => {
    if (index < 0 || index >= count || seen.has(index)) return;
    seen.add(index);
    order.push(index);
  };
  push(0);
  push(count - 1);
  for (let stride = 16; stride >= minStride; stride /= 2) {
    for (let i = 0; i < count; i += stride) push(i);
  }
  return order;
}

export class FrameStore {
  readonly frames: Array<HTMLImageElement | null>;
  private readonly listeners = new Set<() => void>();
  private started = false;
  private emitQueued = false;

  constructor(readonly sequence: FrameSequence) {
    this.frames = new Array<HTMLImageElement | null>(sequence.count).fill(null);
  }

  /** Begins downloading; safe to call repeatedly. */
  start() {
    if (this.started) return;
    this.started = true;

    const order = loadOrder(this.sequence.count, finestStride());
    let next = 0;
    let active = 0;

    const pump = () => {
      while (active < CONCURRENCY && next < order.length) {
        const index = order[next++];
        active += 1;
        const image = new Image();
        image.decoding = "async";
        image.src = frameUrl(this.sequence, index);
        image
          .decode()
          .catch(() => undefined)
          .then(() => {
            if (image.naturalWidth > 0) {
              this.frames[index] = image;
              this.emit();
            }
          })
          .finally(() => {
            active -= 1;
            pump();
          });
      }
    };
    pump();
  }

  has(index: number): boolean {
    return this.frames[index] != null;
  }

  /**
   * The two loaded frames bracketing a fractional position, and how far
   * between them it sits. Gaps from progressive load are returned as-is so
   * the painter can decide whether a soft blend is safe (adjacent only).
   */
  pair(
    position: number
  ): [HTMLImageElement | null, HTMLImageElement | null, number, number, number] {
    const last = this.sequence.count - 1;
    const p = Math.min(last, Math.max(0, position));
    let lo = Math.floor(p);
    let hi = Math.ceil(p);
    while (lo >= 0 && !this.frames[lo]) lo -= 1;
    while (hi <= last && !this.frames[hi]) hi += 1;

    const a = lo >= 0 ? this.frames[lo] : null;
    const b = hi <= last ? this.frames[hi] : null;
    if (!a) return [b, null, 0, hi, hi];
    if (!b || hi === lo) return [a, null, 0, lo, lo];
    return [a, b, (p - lo) / (hi - lo), lo, hi];
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Coalesce load notifications to one per animation frame. */
  private emit() {
    if (this.emitQueued) return;
    this.emitQueued = true;
    requestAnimationFrame(() => {
      this.emitQueued = false;
      this.listeners.forEach((listener) => listener());
    });
  }
}

const stores = new Map<string, FrameStore>();

/** One store per sequence for the whole visit, so revisits are instant. */
export function getFrameStore(sequence: FrameSequence): FrameStore {
  let store = stores.get(sequence.dir);
  if (!store) {
    store = new FrameStore(sequence);
    stores.set(sequence.dir, store);
  }
  return store;
}

/** Start downloading a sequence without mounting a canvas. */
export function prefetchSequence(sequence: FrameSequence) {
  getFrameStore(sequence).start();
}
