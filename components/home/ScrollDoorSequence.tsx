"use client";

/**
 * Pinned, scroll-driven 3D door sequence. The camera starts on the handle,
 * pulls back as the door swings open, crosses to the other side, then settles
 * on a straight elevation — Apple-style product storytelling.
 */

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { SequenceCanvas } from "@/components/sequence/SequenceCanvas";
import { SequenceVideo } from "@/components/sequence/SequenceVideo";
import { prefetchSequence } from "@/components/sequence/frameStore";
import { ApproachedMount } from "@/components/three/ApproachedMount";
import { useWebGLSupported } from "@/components/three/hooks";
import { LazyUpvcScrollScene } from "@/components/three/LazyUpvcScrollScene";
import type { CameraShot } from "@/components/three/UpvcScrollScene";
import {
  allowsScrollSceneLive3d,
  prefersHomeSequences,
  useDeviceTier,
} from "@/components/three/quality";
import { warmHomeScene } from "@/components/three/warmHome";
import { ClaimDoorCanvas } from "@/components/home/ClaimDoorCanvas";
import { doorSequenceFor, doorVideoFor, frameUrl } from "@/lib/sequences";

warmHomeScene();

const LANDSCAPE_QUERY = "(min-width: 1024px), (min-aspect-ratio: 1/1)";

/**
 * Landscape: targets sit left of the unit so the product composes into the
 * right of the frame, clear of the caption column.
 */
const DESKTOP_SHOTS: CameraShot[] = [
  { at: 0, position: [0.78, -0.02, 0.82], target: [0.3, -0.07, 0.04] },
  { at: 0.34, position: [2.5, 0.3, 3.7], target: [-0.35, -0.05, 0] },
  { at: 0.66, position: [-2.4, 0.62, 3.8], target: [-0.55, -0.05, 0.1] },
  { at: 1, position: [0.3, 0.05, 5.3], target: [-0.5, -0.02, 0] },
];

/**
 * Portrait: product sits high; captions sit low. Pulled further back so the
 * leaf clears the copy on a narrow FOV.
 */
const MOBILE_SHOTS: CameraShot[] = [
  { at: 0, position: [0.58, 0.08, 1.15], target: [0.34, -0.38, 0.02] },
  { at: 0.34, position: [2.2, 0.55, 6.4], target: [0, -0.55, 0] },
  { at: 0.66, position: [-2.2, 0.85, 6.6], target: [-0.1, -0.55, 0.1] },
  { at: 1, position: [0.15, 0.2, 8.0], target: [0, -0.58, 0] },
];

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function subscribeToLandscape(onChange: () => void) {
  const query = window.matchMedia(LANDSCAPE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const CAPTIONS = [
  {
    eyebrow: "The detail",
    title: "Hardware you feel before you see",
    body: "Brushed multi-point furniture on a reinforced leaf. Every lever throws into a steel keep before the door moves an inch.",
    /** Shorter line for phones — same meaning, less stack height over the product. */
    bodyMobile:
      "Brushed multi-point furniture on a reinforced leaf — every lever throws before the door moves.",
  },
  {
    eyebrow: "The movement",
    title: "Eighty degrees of clear opening",
    body: "Three hinges carry the weight. The swing stays true after tens of thousands of cycles, in heat and in frost.",
    bodyMobile:
      "Three hinges carry the weight. The swing stays true after tens of thousands of cycles.",
  },
  {
    eyebrow: "The factory",
    title: "Extruded and assembled in Tarakeshwar",
    body: "Slim sightlines and a sealed unit — made at our Kathmandu valley plant, fitted for monsoon dust, heat, and cold mornings.",
    bodyMobile:
      "Made at our Tarakeshwar plant — sealed for Kathmandu dust, monsoon, and cold mornings.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll position each caption takes over at — just ahead of the camera
 * arriving on its shot (0.34, 0.66), while the camera is slowing into it.
 */
const BEAT_STARTS = [0, 0.3, 0.62];
/** A beat changes only once scroll is clearly past its edge, so a hand resting on the boundary never flickers the copy. */
const BEAT_HYSTERESIS = 0.02;

function nextBeat(progress: number, current: number) {
  let beat = current;
  while (
    beat < BEAT_STARTS.length - 1 &&
    progress >= BEAT_STARTS[beat + 1] + BEAT_HYSTERESIS
  ) {
    beat += 1;
  }
  while (beat > 0 && progress < BEAT_STARTS[beat] - BEAT_HYSTERESIS) {
    beat -= 1;
  }
  return beat;
}

/**
 * Captions play on time, not on scroll: scrubbed opacity leaves half-faded
 * copy wherever the visitor stops. Scroll only picks which beat is showing.
 */
const captionVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
  exit: {
    opacity: 0,
    y: -14,
    filter: "blur(6px)",
    transition: { duration: 0.32, ease: EASE },
  },
};

const metaVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08 } },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

const ruleVariants: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};

const titleVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.055 } },
};

const wordVariants: Variants = {
  hidden: { y: "108%" },
  shown: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

const bodyVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE, delay: 0.12 },
  },
};

function CaptionReveal({
  caption,
  index,
}: {
  caption: (typeof CAPTIONS)[number];
  index: number;
}) {
  const words = caption.title.split(" ");
  return (
    <motion.div
      variants={captionVariants}
      initial="hidden"
      animate="shown"
      exit="exit"
    >
      <motion.div
        variants={metaVariants}
        className="mb-2.5 flex items-center gap-2.5 sm:mb-4 sm:gap-3"
      >
        <motion.span
          variants={fadeInVariants}
          className="font-medium tabular-nums text-[0.625rem] tracking-[0.16em] text-gold sm:text-[0.6875rem]"
        >
          0{index + 1}
          <span className="text-gold/45"> / 0{CAPTIONS.length}</span>
        </motion.span>
        <motion.span
          variants={ruleVariants}
          className="h-px w-5 origin-left bg-gold/45 sm:w-7"
        />
        <motion.p variants={fadeInVariants} className="eyebrow mb-0 text-gold">
          {caption.eyebrow}
        </motion.p>
      </motion.div>
      <motion.p
        variants={titleVariants}
        className="mb-2.5 font-display text-[clamp(1.45rem,5.5vw,2.75rem)] leading-[1.12] tracking-tight text-balance text-charcoal sm:mb-4"
      >
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            {i > 0 && " "}
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
              <motion.span variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            </span>
          </Fragment>
        ))}
      </motion.p>
      <motion.p
        variants={bodyVariants}
        className="max-w-sm text-[0.9375rem] leading-relaxed text-charcoal/65 sm:text-base lg:hidden"
      >
        {caption.bodyMobile}
      </motion.p>
      <motion.p
        variants={bodyVariants}
        className="hidden max-w-sm text-base leading-relaxed text-charcoal/65 lg:block"
      >
        {caption.body}
      </motion.p>
    </motion.div>
  );
}

export function ScrollDoorSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
  const isLandscape = useSyncExternalStore(
    subscribeToLandscape,
    () => window.matchMedia(LANDSCAPE_QUERY).matches,
    () => false
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [beat, setBeat] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
    const next = nextBeat(value, beat);
    if (next !== beat) setBeat(next);
  });

  const stageRef = useRef<HTMLDivElement>(null);
  const stageSeen = useInView(stageRef, { once: true, amount: 0.45 });
  // Start downloading frames well before the pin sticks.
  const nearPin = useInView(sectionRef, {
    once: true,
    margin: "120% 0px",
  });
  // A few pixels of travel across the whole pin keeps the copy alive between beats.
  const captionDrift = useTransform(scrollYProgress, [0, 1], [12, -12]);

  const webgl = useWebGLSupported();
  const tier = useDeviceTier();
  // Mid + high: live WebGL (same finish as desktop). Low: WebM scrub, else frames.
  const live3d = allowsScrollSceneLive3d(tier) && webgl !== false;
  const offline = prefersHomeSequences(tier) && !live3d;
  const doorSequence = offline ? doorSequenceFor(isLandscape) : null;
  const doorVideo = offline ? doorVideoFor(isLandscape) : null;
  const useVideo = Boolean(doorVideo);
  const useSequence = Boolean(doorSequence) && !useVideo;
  const [sceneReady, setSceneReady] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [posterDone, setPosterDone] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);
  const handleOfflineReady = useCallback(() => setOfflineReady(true), []);
  const productReady = live3d ? sceneReady : offlineReady;
  const showMotion = live3d || useVideo || useSequence;
  const posterSrc = doorSequence
    ? frameUrl(doorSequence, 0)
    : isLandscape
      ? "/images/door/door-desktop.webp"
      : "/images/door/door-mobile.webp";
  // The still is the opening shot only. If the visitor is already moving
  // through the sequence before the scene is up, it gets out of the way.
  const posterScrollFade = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  useEffect(() => {
    if (!useSequence || !doorSequence) return;
    prefetchSequence(doorSequence);
  }, [useSequence, doorSequence]);

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
              <h2 className="mb-3 font-display text-h3 text-charcoal">
                {caption.title}
              </h2>
              <p className="text-charcoal/70">{caption.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/*
        Height minus the pin is the scroll the three beats play over: 1.6
        screens on a phone against 2.2 on a desktop. Keeping those close is
        what makes the camera travel at a comparable speed on both, rather
        than racing through the sequence in a single flick.
      */}
      <section
        ref={sectionRef}
        className="relative h-[200vh] bg-surface motion-reduce:hidden sm:h-[240vh] lg:h-[320vh]"
        aria-label="Scroll-driven door sequence"
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-[100svh] touch-pan-y overflow-hidden"
        >
          {/* The full story for assistive tech; the animated layer below is visual only. */}
          <div className="sr-only">
            {CAPTIONS.map((caption) => (
              <article key={caption.title}>
                <p>{caption.eyebrow}</p>
                <h2>{caption.title}</h2>
                <p>{caption.body}</p>
              </article>
            ))}
          </div>

          {/* Warm studio falloff behind the unit */}
          <div
            className="absolute inset-0"
            style={{
              background: isDesktop
                ? "radial-gradient(90% 90% at 72% 50%, #ffffff 0%, #f7f6f3 45%, #ebe7e0 100%)"
                : "radial-gradient(90% 90% at 50% 36%, #ffffff 0%, #f7f6f3 45%, #ebe7e0 100%)",
            }}
            aria-hidden
          />

          {/*
            The opening shot, rendered by this scene and captured wide: with a
            fixed vertical FOV any viewport is a centred slice of it, so
            object-cover lands it exactly where the first live frame draws.
            Re-capture if the model, lighting or the first shot changes.
          */}
          {!posterDone && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: !showMotion ? 1 : posterScrollFade,
              }}
              aria-hidden
            >
              <div
                className="absolute inset-0 transition-opacity duration-300 ease-out"
                style={{
                  opacity: showMotion && productReady ? 0 : 1,
                  transitionDelay:
                    showMotion && productReady ? "200ms" : "0ms",
                }}
                onTransitionEnd={() => {
                  if (showMotion && productReady) setPosterDone(true);
                }}
              >
                <Image
                  key={posterSrc}
                  src={posterSrc}
                  alt=""
                  fill
                  loading="eager"
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {live3d ? (
            <ApproachedMount
              className="pointer-events-none absolute inset-0"
              // Tight enough that the hero keeps its live open/close while
              // the visitor is still in the carousel — 160% was claiming the
              // WebGL slot on first paint and freezing the hero on a poster.
              rootMargin="40% 0px"
            >
              <ClaimDoorCanvas>
                <LazyUpvcScrollScene
                  progressRef={progressRef}
                  shots={isDesktop ? DESKTOP_SHOTS : MOBILE_SHOTS}
                  openingType="hinged"
                  category="doors"
                  hardwareSlug="brushed"
                  className="h-full w-full"
                  fallback={null}
                  onReady={handleSceneReady}
                />
              </ClaimDoorCanvas>
            </ApproachedMount>
          ) : null}

          {useVideo && doorVideo ? (
            <SequenceVideo
              src={doorVideo}
              poster={posterSrc}
              progress={scrollYProgress}
              smoothing={18}
              onReady={handleOfflineReady}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          {useSequence && doorSequence ? (
            <SequenceCanvas
              sequence={doorSequence}
              progress={scrollYProgress}
              fit="cover"
              smoothing={18}
              load={nearPin}
              onFirstPaint={handleOfflineReady}
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
          ) : null}

          <div className="pointer-events-none absolute inset-0">
            {/* Desktop: left scrim. Mobile: shorter bottom scrim — product stays clear. */}
            <div
              className="absolute inset-y-0 left-0 hidden w-[46%] lg:block"
              style={{
                background:
                  "linear-gradient(to right, rgba(247,246,243,0.97) 0%, rgba(247,246,243,0.88) 45%, rgba(247,246,243,0) 100%)",
              }}
              aria-hidden
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[42%] sm:h-[46%] lg:hidden"
              style={{
                background:
                  "linear-gradient(to top, rgba(247,246,243,0.98) 0%, rgba(247,246,243,0.88) 50%, rgba(247,246,243,0) 100%)",
              }}
              aria-hidden
            />

            <div className="container-content flex h-full items-end pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:items-center lg:pb-0">
              <motion.div
                style={{ y: captionDrift }}
                className="w-full max-w-md lg:max-w-[28rem]"
                aria-hidden
              >
                <AnimatePresence mode="wait">
                  {stageSeen && (
                    <CaptionReveal
                      key={beat}
                      caption={CAPTIONS[beat]}
                      index={beat}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
