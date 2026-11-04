/**
 * Pre-rendered frame sequences + scroll-scrub WebMs for the home page.
 *
 * Capture: `/dev/capture?job=all` → `public/images/sequences/<name>/NNN.webp`
 * Encode:  `python3 scripts/encode-sequences.py` → `public/videos/<name>.webm`
 *
 * Mid/high keep live WebGL. Low / Save-Data prefer WebM scrub, then WebP
 * canvas, then posters.
 */

export interface FrameSequence {
  /** Public directory holding `000.webp`, `001.webp`, … */
  dir: string;
  /** Published frame count (0 = not captured yet — stay on posters) */
  count: number;
  width: number;
  height: number;
}

export function frameUrl(sequence: FrameSequence, index: number): string {
  return `${sequence.dir}/${String(index).padStart(3, "0")}.webp`;
}

export function sequenceReady(sequence: FrameSequence): boolean {
  return sequence.count > 1;
}

/** Full capture length — `/dev/capture` always writes this many frames. */
export const DOOR_CAPTURE_COUNT = 40;

export const DOOR_SEQUENCES = {
  landscape: {
    dir: "/images/sequences/door-landscape",
    count: 40,
    width: 1920,
    height: 960,
  },
  portrait: {
    dir: "/images/sequences/door-portrait",
    count: 40,
    width: 1080,
    height: 1440,
  },
} as const satisfies Record<string, FrameSequence>;

/** Scroll-scrub videos encoded from the same capture frames. */
export const DOOR_VIDEOS = {
  landscape: "/videos/door-landscape.webm",
  portrait: "/videos/door-portrait.webm",
} as const;

/** Sequence descriptor used by the capture studio (full length). */
export function doorCaptureSequence(
  kind: keyof typeof DOOR_SEQUENCES
): FrameSequence {
  const base = DOOR_SEQUENCES[kind];
  return { ...base, count: DOOR_CAPTURE_COUNT };
}

/** Pick the door set that exists; phones may cover-crop landscape. */
export function doorSequenceFor(preferLandscape: boolean): FrameSequence | null {
  const { landscape, portrait } = DOOR_SEQUENCES;
  if (preferLandscape && sequenceReady(landscape)) return landscape;
  if (!preferLandscape && sequenceReady(portrait)) return portrait;
  if (sequenceReady(landscape)) return landscape;
  if (sequenceReady(portrait)) return portrait;
  return null;
}

export function doorVideoFor(preferLandscape: boolean): string | null {
  const sequence = doorSequenceFor(preferLandscape);
  if (!sequence) return null;
  return sequence.dir.includes("landscape")
    ? DOOR_VIDEOS.landscape
    : DOOR_VIDEOS.portrait;
}

export const HERO_CAPTURE_FRAMES = 24;
const HERO_SIZE = 1200;

const HERO_PUBLISHED: Record<string, number> = {
  french: 24,
  sliding: 24,
  "tilt-turn": 24,
  casement: 24,
  folding: 24,
};

/** Closed (frame 0) → fully open (last frame) for one hero product. */
export function heroSequence(slideId: string): FrameSequence {
  return {
    dir: `/images/sequences/hero-${slideId}`,
    count: HERO_PUBLISHED[slideId] ?? 0,
    width: HERO_SIZE,
    height: HERO_SIZE,
  };
}

export function heroCaptureSequence(slideId: string): FrameSequence {
  return {
    dir: `/images/sequences/hero-${slideId}`,
    count: HERO_CAPTURE_FRAMES,
    width: HERO_SIZE,
    height: HERO_SIZE,
  };
}

export function heroSequenceOrNull(slideId: string): FrameSequence | null {
  const sequence = heroSequence(slideId);
  return sequenceReady(sequence) ? sequence : null;
}

export function heroVideoUrl(slideId: string): string | null {
  if (!(HERO_PUBLISHED[slideId] > 1)) return null;
  return `/videos/hero-${slideId}.webm`;
}
