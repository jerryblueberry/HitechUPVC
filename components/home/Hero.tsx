"use client";

import Image from "next/image";
import Link from "next/link";
import {
  animate,
  AnimatePresence,
  motion,
  MotionConfig,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import type { Company } from "@/lib/types";
import { HERO_3D_SLIDES, heroPoster } from "@/lib/heroSlides";
import { DoorwayIntro, isDoorwayIntroPending } from "@/components/animations/DoorwayIntro";
import { useCanHover } from "@/components/three/hooks";
import { SequenceCanvas } from "@/components/sequence/SequenceCanvas";
import { SequenceVideo } from "@/components/sequence/SequenceVideo";
import { prefetchSequence } from "@/components/sequence/frameStore";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import {
  allowsPrimaryLive3d,
  prefersHomeSequences,
  useDeviceTier,
} from "@/components/three/quality";
import { warmHomeScene } from "@/components/three/warmHome";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  isHomeDoorCanvasClaimed,
  resetHomeDoorCanvasClaim,
  subscribeHomeDoorCanvas,
} from "@/lib/homeCanvasBudget";
import { heroSequenceOrNull, heroVideoUrl } from "@/lib/sequences";

const noopSubscribe = () => () => {};

// Poster first; mid/low idle-prefetch frames; high idle-warms Three.js.
warmHomeScene();
// Clear a stale door claim left by HMR or an early prefetch so the hero
// open/close can mount live WebGL again on this visit.
if (typeof window !== "undefined") resetHomeDoorCanvasClaim();

const ease = [0.22, 1, 0.36, 1] as const;
const OPEN_EASE = [0.65, 0, 0.35, 1] as const;
const SLIDE_MS = 7000;
/** When the unit opens and shuts within each slide — after the canvas is ready */
const OPEN_AT_MS = 700;
const CLOSE_AT_MS = 4600;
const OPEN_DURATION_S = 1.7;
const SWIPE_PX = 60;
const STAGE_FADE_MS = 180;
/**
 * Return visits and skipped intros (reduced motion, no WebGL, data-saver)
 * paint the copy immediately. A first visit — phone or laptop — waits for
 * the doorway reveal, same rise as desktop.
 */
const VISIBLE_ON_TOUCH = "pointer-coarse:opacity-100! pointer-coarse:transform-none!";

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.04 + i * 0.07, ease },
  }),
};

interface HeroProps {
  company: Company;
}

/** Apple-style 3D product carousel, entered through the doorway intro. */
export function Hero({ company }: HeroProps) {
  const { hero } = company;
  const reducedMotion = useReducedMotion();
  const canHover = useCanHover();
  const tier = useDeviceTier();
  const live3dAllowed = allowsPrimaryLive3d(tier) && !reducedMotion;
  // Mid phones share one WebGL budget with the scroll door. High desktops
  // keep the hero live even if the door is warming — two contexts is fine.
  const doorOwnsCanvas = useSyncExternalStore(
    subscribeHomeDoorCanvas,
    isHomeDoorCanvasClaimed,
    () => false
  );
  const live3d =
    live3dAllowed && !(tier === "mid" && doorOwnsCanvas);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const [pageRevealed, setPageRevealed] = useState(false);
  const [stageReady, setStageReady] = useState(false);
  // Server snapshot says "intro pending" so the hero canvas is not in the
  // SSR HTML. A return visit or a skipped intro flips this off immediately.
  const introPending = useSyncExternalStore(
    noopSubscribe,
    isDoorwayIntroPending,
    () => true
  );
  const [viewerReady, setViewerReady] = useState(false);
  const [sequenceReady, setSequenceReady] = useState(false);
  const [posterDone, setPosterDone] = useState(false);
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [paused, setPaused] = useState(false);
  const progress = useMotionValue(0);
  const openProgress = useMotionValue(0);
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const stageControls = useAnimationControls();
  const firstStagePaint = useRef(true);

  const total = HERO_3D_SLIDES.length;
  const slide = HERO_3D_SLIDES[index];
  const sequence = heroSequenceOrNull(slide.id);
  const heroVideo =
    prefersHomeSequences(tier) && !live3d && !reducedMotion
      ? heroVideoUrl(slide.id)
      : null;
  const useVideo = Boolean(heroVideo);
  const useSequence =
    prefersHomeSequences(tier) &&
    !live3d &&
    !reducedMotion &&
    !useVideo &&
    Boolean(sequence);
  const state = pageRevealed ? "show" : "hidden";
  const revealClass = introPending ? "" : VISIBLE_ON_TOUCH;
  const stageLive = live3d && (stageReady || !introPending);
  const stageOffline =
    (useVideo || useSequence) && (stageReady || !introPending);
  const productReady = stageLive ? viewerReady : sequenceReady;
  const showProduct = stageLive || stageOffline;
  // Poster-only phones (sequences not published yet) still advance the carousel.
  const stageActive = stageReady || !introPending;
  const autoAdvance =
    !paused &&
    !reducedMotion &&
    stageActive &&
    (stageLive ? viewerReady : true);

  const handleReveal = useCallback(() => {
    setPageRevealed(true);
  }, []);

  const handleComplete = useCallback(() => {
    setPageRevealed(true);
    setStageReady(true);
  }, []);

  const handleViewerReady = useCallback(() => setViewerReady(true), []);
  const handleSequencePaint = useCallback(() => setSequenceReady(true), []);

  const goTo = useCallback(
    (next: number) => {
      progress.set(0);
      openProgress.set(0);
      setOpened(false);
      setViewerReady(false);
      setSequenceReady(false);
      setPosterDone(false);
      setIndex(((next % total) + total) % total);
    },
    [progress, openProgress, total]
  );

  // Mid only: when the door pin steals the canvas, drop back to the poster so
  // the remount after release crossfades cleanly. High keeps the hero live —
  // resetting viewerReady there would cancel open/close (onReady never re-fires).
  useEffect(() => {
    if (tier !== "mid" || !doorOwnsCanvas) return;
    setViewerReady(false);
    setPosterDone(false);
  }, [tier, doorOwnsCanvas]);

  // Prefetch the next slide's frames while this one plays (WebP path only).
  useEffect(() => {
    if (!useSequence || !stageOffline) return;
    const next = HERO_3D_SLIDES[(index + 1) % total];
    const nextSeq = heroSequenceOrNull(next.id);
    if (!nextSeq) return;
    const idle = (
      window as Window & {
        requestIdleCallback?: (cb: () => void) => number;
      }
    ).requestIdleCallback;
    const warm = () => prefetchSequence(nextSeq);
    if (idle) idle(warm);
    else window.setTimeout(warm, 900);
  }, [useSequence, stageOffline, index, total]);

  useEffect(() => {
    if (!autoAdvance) return;
    const remaining = (1 - progress.get()) * SLIDE_MS;
    const controls = animate(progress, 1, {
      duration: remaining / 1000,
      ease: "linear",
      onComplete: () => goTo(index + 1),
    });
    return () => controls.stop();
  }, [autoAdvance, index, goTo, progress]);

  // Open / shut after the product surface is ready. Live path keys the viewer
  // per slide so onReady fires again after each change.
  useEffect(() => {
    if (!stageActive || reducedMotion) return;
    if (stageLive && !viewerReady) return;
    if (stageOffline && !sequenceReady) return;
    setOpened(false);
    const open = window.setTimeout(() => setOpened(true), OPEN_AT_MS);
    const close = window.setTimeout(() => setOpened(false), CLOSE_AT_MS);
    return () => {
      window.clearTimeout(open);
      window.clearTimeout(close);
    };
  }, [
    index,
    stageActive,
    stageLive,
    stageOffline,
    viewerReady,
    sequenceReady,
    reducedMotion,
  ]);

  // Offline path: scrub openness with the same swing the live viewer uses.
  useEffect(() => {
    if (!stageOffline || !sequenceReady) return;
    const controls = animate(openProgress, opened ? 1 : 0, {
      duration: OPEN_DURATION_S,
      ease: OPEN_EASE,
    });
    return () => controls.stop();
  }, [opened, stageOffline, sequenceReady, openProgress]);

  // Fade on slide change only — first paint uses UpvcStage's own fade.
  useLayoutEffect(() => {
    if (!showProduct) return;
    if (firstStagePaint.current) {
      firstStagePaint.current = false;
      stageControls.set({ opacity: 1, scale: 1 });
      return;
    }
    stageControls.set({ opacity: 0, scale: 0.98 });
    stageControls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease },
    });
  }, [index, showProduct, stageControls]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_PX) goTo(index + 1);
    else if (info.offset.x > SWIPE_PX) goTo(index - 1);
  }

  function onSwipeStart(event: PointerEvent) {
    if (canHover) return;
    swipe.current = { x: event.clientX, y: event.clientY };
  }

  function onSwipeEnd(event: PointerEvent) {
    if (!swipe.current) return;
    const dx = event.clientX - swipe.current.x;
    const dy = event.clientY - swipe.current.y;
    swipe.current = null;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goTo(index + 1);
    else goTo(index - 1);
  }

  return (
    <MotionConfig reducedMotion="user">
      <DoorwayIntro
        brand={company.companyName}
        logo={company.logo}
        onReveal={handleReveal}
        onComplete={handleComplete}
      />

      <section
        className="page-top relative flex items-start overflow-hidden"
        style={{
          background:
            "radial-gradient(90% 90% at 72% 50%, #ffffff 0%, #f7f6f3 45%, #ebe7e0 100%)",
        }}
        aria-roledescription="carousel"
        aria-label="Featured uPVC products"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="container-content grid w-full grid-cols-1 items-start gap-x-12 gap-y-6 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_auto] lg:pb-10">
          {/* Copy */}
          <motion.div
            className={`lg:col-start-1 lg:row-start-1 lg:self-end ${revealClass}`}
            variants={rise}
            custom={0}
            initial="hidden"
            animate={state}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease }}
              >
                <p className="eyebrow mb-4 text-gold">{slide.eyebrow}</p>
                <h1 className="font-display text-[clamp(2.4rem,4.6vw,4.25rem)] leading-[1.03] tracking-tight text-charcoal text-balance">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal/60 sm:text-lg">
                  {slide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* 3D stage */}
          <motion.div
            className={`relative lg:col-start-2 lg:row-span-2 lg:row-start-1 ${revealClass}`}
            variants={rise}
            custom={1}
            initial="hidden"
            animate={state}
          >
            <motion.div
              className="relative mx-auto aspect-[4/3] max-h-[46svh] w-full cursor-grab touch-pan-y active:cursor-grabbing sm:aspect-[5/4] lg:aspect-auto lg:h-[min(72svh,660px)] lg:max-h-none"
              drag={canHover && !reducedMotion ? "x" : false}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
              dragSnapToOrigin
              onDragEnd={onDragEnd}
              onPointerDown={onSwipeStart}
              onPointerUp={onSwipeEnd}
              onPointerCancel={() => {
                swipe.current = null;
              }}
            >
              <motion.div className="absolute inset-0" animate={stageControls}>
                {/* Painted from the server HTML; live/sequence fades in over it. */}
                {!posterDone && (
                  <Image
                    src={heroPoster(slide)}
                    alt={`${slide.eyebrow} in white uPVC`}
                    fill
                    preload={index === 0}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="pointer-events-none object-contain transition-opacity duration-300 ease-out"
                    style={{
                      opacity: showProduct && productReady ? 0 : 1,
                      transitionDelay:
                        showProduct && productReady
                          ? `${STAGE_FADE_MS}ms`
                          : "0ms",
                    }}
                    onTransitionEnd={() => {
                      if (showProduct && productReady) setPosterDone(true);
                    }}
                  />
                )}
                {stageLive ? (
                  <LazyUpvcViewer
                    key={slide.id}
                    openingType={slide.openingType}
                    category={slide.category}
                    open={opened ? 1 : 0}
                    quality="balanced"
                    eager
                    fadeMs={STAGE_FADE_MS}
                    className="relative h-full w-full"
                    posterAlt={`${slide.eyebrow} in white uPVC`}
                    posterSrc={heroPoster(slide)}
                    onReady={handleViewerReady}
                  />
                ) : null}
                {stageOffline && useVideo && heroVideo ? (
                  <SequenceVideo
                    key={`video-${slide.id}`}
                    src={heroVideo}
                    poster={heroPoster(slide)}
                    progress={openProgress}
                    smoothing={0}
                    onReady={handleSequencePaint}
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                  />
                ) : null}
                {stageOffline && useSequence && sequence ? (
                  <SequenceCanvas
                    key={slide.id}
                    sequence={sequence}
                    progress={openProgress}
                    fit="contain"
                    load
                    onFirstPaint={handleSequencePaint}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  />
                ) : null}
              </motion.div>
            </motion.div>

            <div className="absolute bottom-2 right-0 hidden items-center gap-2 sm:flex">
              <span className="mr-2 text-sm tabular-nums text-charcoal/40">
                {String(index + 1).padStart(2, "0")}
                <span className="mx-1 text-charcoal/20">/</span>
                {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-surface/70 text-charcoal/60 backdrop-blur transition-colors duration-300 hover:border-charcoal/40 hover:text-charcoal"
                aria-label="Previous product"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-surface/70 text-charcoal/60 backdrop-blur transition-colors duration-300 hover:border-charcoal/40 hover:text-charcoal"
                aria-label="Next product"
              >
                →
              </button>
            </div>
          </motion.div>

          {/* Actions + carousel controls */}
          <motion.div
            className={`lg:col-start-1 lg:row-start-2 lg:self-start ${revealClass}`}
            variants={rise}
            custom={2}
            initial="hidden"
            animate={state}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
              <MagneticButton
                href={hero.primaryCta.href}
                className="!px-7"
              >
                {hero.primaryCta.label}
              </MagneticButton>
              <Link
                href={slide.href}
                className="group inline-flex items-center gap-1 text-sm font-medium text-navy"
              >
                Explore {slide.label}
                <span
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  ›
                </span>
              </Link>
            </div>

            <div className="mt-8 lg:mt-10">
              <div
                role="tablist"
                aria-label="Product"
                className="-mx-6 flex touch-manipulation gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] snap-x snap-mandatory sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:snap-none [&::-webkit-scrollbar]:hidden"
              >
                {HERO_3D_SLIDES.map((s, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => goTo(i)}
                      className={`relative flex min-h-11 shrink-0 snap-start items-center overflow-hidden rounded-full px-4 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                        active
                          ? "bg-charcoal text-surface"
                          : "bg-charcoal/[0.05] text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal"
                      }`}
                    >
                      {s.label}
                      {active && (
                        <motion.span
                          className="absolute bottom-0 left-0 h-[2px] bg-gold"
                          style={{ width: progressWidth }}
                          aria-hidden
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
