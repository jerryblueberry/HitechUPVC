"use client";

/**
 * Pinned, scroll-driven 3D door sequence. The camera starts on the handle,
 * pulls back as the door swings open, crosses to the other side, then settles
 * on a straight elevation.
 */

import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import {
  LazyUpvcScrollScene,
} from "@/components/three/LazyUpvcScrollScene";
import type { CameraShot } from "@/components/three/UpvcScrollScene";

/**
 * Landscape: targets sit left of the unit so the product composes into the
 * right of the frame, clear of the caption column.
 */
const DESKTOP_SHOTS: CameraShot[] = [
  // Hardware detail — start inside the product, the way Apple does.
  { at: 0, position: [0.78, -0.02, 0.82], target: [0.3, -0.07, 0.04] },
  // Pull back to a three-quarter as the leaf begins to swing.
  { at: 0.34, position: [2.5, 0.3, 3.7], target: [-0.35, -0.05, 0] },
  // Cross to the hinge side with the door wide open.
  { at: 0.66, position: [-2.4, 0.62, 3.8], target: [-0.55, -0.05, 0.1] },
  // Settle on a clean elevation.
  { at: 1, position: [0.3, 0.05, 5.3], target: [-0.5, -0.02, 0] },
];

/**
 * Portrait: targets sit below the unit so it composes into the upper part of
 * the frame, clear of the captions at the bottom. Further back because the
 * horizontal field of view is narrow.
 */
const MOBILE_SHOTS: CameraShot[] = [
  { at: 0, position: [0.62, 0.02, 1.05], target: [0.36, -0.3, 0.02] },
  { at: 0.34, position: [2.4, 0.5, 6.1], target: [0, -0.45, 0] },
  { at: 0.66, position: [-2.4, 0.8, 6.3], target: [-0.1, -0.45, 0.1] },
  { at: 1, position: [0.2, 0.15, 7.7], target: [0, -0.48, 0] },
];

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const CAPTIONS = [
  {
    eyebrow: "The detail",
    title: "Hardware you feel before you see",
    body: "Brushed multi-point furniture on a reinforced leaf. Every lever throws into a steel keep before the door moves an inch.",
  },
  {
    eyebrow: "The movement",
    title: "Eighty degrees of clear opening",
    body: "Three hinges carry the weight. The swing stays true after tens of thousands of cycles, in heat and in frost.",
  },
  {
    eyebrow: "The result",
    title: "A doorway, not a door",
    body: "Slim sightlines, a thermally broken threshold, and a sealed unit that keeps the weather where it belongs.",
  },
];

const EASE = cubicBezier(0.22, 1, 0.36, 1);

/**
 * Copy swaps only while the column is faded out. Two captions must never
 * paint on top of each other — that reads as corrupted text.
 */
function useCaptionSwap(progress: MotionValue<number>) {
  const veil = useTransform(
    progress,
    [0, 0.28, 0.32, 0.35, 0.58, 0.62, 0.65, 1],
    [1, 1, 0, 1, 1, 0, 1, 1],
    { ease: [EASE, EASE, EASE, EASE, EASE, EASE, EASE] }
  );
  const y = useTransform(
    progress,
    [0, 0.28, 0.32, 0.35, 0.58, 0.62, 0.65, 1],
    [0, 0, 8, 0, 0, 8, 0, 0],
    { ease: [EASE, EASE, EASE, EASE, EASE, EASE, EASE] }
  );

  const slot0 = useTransform(progress, [0, 0.329, 0.331, 1], [1, 1, 0, 0]);
  const slot1 = useTransform(
    progress,
    [0, 0.329, 0.331, 0.629, 0.631, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const slot2 = useTransform(progress, [0, 0.629, 0.631, 1], [0, 0, 1, 1]);
  const hidden0 = useTransform(slot0, (current) =>
    current > 0.5 ? "visible" : "hidden"
  );
  const hidden1 = useTransform(slot1, (current) =>
    current > 0.5 ? "visible" : "hidden"
  );
  const hidden2 = useTransform(slot2, (current) =>
    current > 0.5 ? "visible" : "hidden"
  );

  return {
    veil,
    y,
    slot: [slot0, slot1, slot2],
    hidden: [hidden0, hidden1, hidden2],
  };
}

export function ScrollDoorSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
  });

  const captions = useCaptionSwap(scrollYProgress);

  return (
    <>
      {/* Reduced-motion fallback: the same story, told statically. */}
      <section className="hidden motion-reduce:block section-padding bg-surface-muted">
        <div className="container-content space-y-12">
          {CAPTIONS.map((caption, i) => (
            <article key={caption.title} className="prose-narrow">
              <div className="mb-3 flex items-center gap-3">
                <span className="font-medium tabular-nums text-[0.6875rem] tracking-[0.16em] text-gold">
                  0{i + 1}
                </span>
                <span className="h-px w-7 bg-gold/45" aria-hidden />
                <p className="eyebrow mb-0 text-gold">{caption.eyebrow}</p>
              </div>
              <h2 className="font-display text-h3 text-charcoal mb-3">
                {caption.title}
              </h2>
              <p className="text-charcoal/70">{caption.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        ref={sectionRef}
        className="relative h-[360vh] bg-surface motion-reduce:hidden lg:h-[420vh]"
        aria-label="Scroll-driven door sequence"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* Warm studio falloff behind the unit */}
          <div
            className="absolute inset-0"
            style={{
              background: isDesktop
                ? "radial-gradient(90% 90% at 72% 50%, #ffffff 0%, #f7f6f3 45%, #ebe7e0 100%)"
                : "radial-gradient(90% 90% at 50% 40%, #ffffff 0%, #f7f6f3 45%, #ebe7e0 100%)",
            }}
            aria-hidden
          />

          <LazyUpvcScrollScene
            progressRef={progressRef}
            shots={isDesktop ? DESKTOP_SHOTS : MOBILE_SHOTS}
            openingType="hinged"
            category="doors"
            hardwareSlug="brushed"
            className="pointer-events-none absolute inset-0"
          />

          <div className="pointer-events-none absolute inset-0">
            {/* Keeps the caption legible when the camera is tight on the product */}
            <div
              className="absolute inset-y-0 left-0 hidden w-[46%] lg:block"
              style={{
                background:
                  "linear-gradient(to right, rgba(247,246,243,0.97) 0%, rgba(247,246,243,0.88) 45%, rgba(247,246,243,0) 100%)",
              }}
              aria-hidden
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[52%] lg:hidden"
              style={{
                background:
                  "linear-gradient(to top, rgba(247,246,243,0.98) 0%, rgba(247,246,243,0.9) 45%, rgba(247,246,243,0) 100%)",
              }}
              aria-hidden
            />

            <div className="container-content flex h-full items-end pb-[max(3.5rem,env(safe-area-inset-bottom))] lg:items-center lg:pb-0">
              <motion.div
                style={{ opacity: captions.veil, y: captions.y }}
                className="w-full max-w-md will-change-[opacity,transform] lg:max-w-[28rem]"
              >
                <div className="grid">
                  {CAPTIONS.map((caption, i) => (
                    <motion.article
                      key={caption.title}
                      style={{
                        opacity: captions.slot[i],
                        visibility: captions.hidden[i],
                      }}
                      className="col-start-1 row-start-1"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span className="font-medium tabular-nums text-[0.6875rem] tracking-[0.16em] text-gold">
                          0{i + 1}
                        </span>
                        <span className="h-px w-7 bg-gold/45" aria-hidden />
                        <p className="eyebrow mb-0 text-gold">{caption.eyebrow}</p>
                      </div>
                      <h2 className="mb-4 font-display text-[clamp(1.7rem,2.8vw,2.75rem)] leading-[1.12] tracking-tight text-charcoal text-balance">
                        {caption.title}
                      </h2>
                      <p className="max-w-sm text-base leading-relaxed text-charcoal/65">
                        {caption.body}
                      </p>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
