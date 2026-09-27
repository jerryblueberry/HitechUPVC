"use client";

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
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { Company } from "@/lib/types";
import { HERO_3D_SLIDES } from "@/lib/heroSlides";
import { DoorwayIntro } from "@/components/animations/DoorwayIntro";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import { MagneticButton } from "@/components/ui/MagneticButton";

const ease = [0.22, 1, 0.36, 1] as const;
const SLIDE_MS = 7000;
/** When the unit opens and shuts within each slide */
const OPEN_AT_MS = 900;
const CLOSE_AT_MS = 4800;
const SWIPE_PX = 60;

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.08 + i * 0.12, ease },
  }),
};

interface HeroProps {
  company: Company;
}

/** Apple-style 3D product carousel, entered through the doorway intro. */
export function Hero({ company }: HeroProps) {
  const { hero } = company;
  const reducedMotion = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [paused, setPaused] = useState(false);
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const stageControls = useAnimationControls();

  const total = HERO_3D_SLIDES.length;
  const slide = HERO_3D_SLIDES[index];
  const state = introDone ? "show" : "hidden";
  const autoAdvance = introDone && !paused && !reducedMotion;

  const handleReveal = useCallback(() => setIntroDone(true), []);

  const goTo = useCallback(
    (next: number) => {
      progress.set(0);
      setOpened(false);
      setIndex(((next % total) + total) % total);
    },
    [progress, total]
  );

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

  useEffect(() => {
    if (!introDone || reducedMotion) return;
    const open = setTimeout(() => setOpened(true), OPEN_AT_MS);
    const close = setTimeout(() => setOpened(false), CLOSE_AT_MS);
    return () => {
      clearTimeout(open);
      clearTimeout(close);
    };
  }, [index, introDone, reducedMotion]);

  // Layout effect so the new model never paints at full opacity before the fade.
  useLayoutEffect(() => {
    stageControls.start({
      opacity: [0, 1],
      scale: [0.96, 1],
      transition: { duration: 0.8, ease },
    });
  }, [index, stageControls]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_PX) goTo(index + 1);
    else if (info.offset.x > SWIPE_PX) goTo(index - 1);
  }

  return (
    <MotionConfig reducedMotion="user">
      <DoorwayIntro brand={company.companyName} onReveal={handleReveal} />

      <section
        className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden lg:min-h-[calc(100svh-5rem)]"
        style={{
          background:
            "radial-gradient(90% 90% at 72% 50%, #ffffff 0%, #f7f6f3 45%, #ebe7e0 100%)",
        }}
        aria-roledescription="carousel"
        aria-label="Featured uPVC products"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <h1 className="sr-only">{hero.headline}</h1>

        <div className="container-content grid w-full grid-cols-1 items-center gap-x-12 gap-y-6 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_auto] lg:py-12">
          {/* Copy */}
          <motion.div
            className="lg:col-start-1 lg:row-start-1 lg:self-end"
            variants={rise}
            custom={0}
            initial="hidden"
            animate={state}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease }}
              >
                <p className="eyebrow mb-4 text-gold">{slide.eyebrow}</p>
                <h2 className="font-display text-[clamp(2.4rem,4.6vw,4.25rem)] leading-[1.03] tracking-tight text-charcoal text-balance">
                  {slide.title}
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal/60 sm:text-lg">
                  {slide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* 3D stage */}
          <motion.div
            className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1"
            variants={rise}
            custom={1}
            initial="hidden"
            animate={state}
          >
            <motion.div
              className="relative mx-auto aspect-[4/3] max-h-[46svh] w-full cursor-grab touch-pan-y active:cursor-grabbing sm:aspect-[5/4] lg:aspect-auto lg:h-[min(72svh,660px)] lg:max-h-none"
              drag={reducedMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
              onDragEnd={onDragEnd}
            >
              <motion.div className="absolute inset-0" animate={stageControls}>
                <LazyUpvcViewer
                  openingType={slide.openingType}
                  category={slide.category}
                  open={opened ? 1 : 0}
                  quality="high"
                  className="h-full w-full"
                  posterAlt={`${slide.eyebrow} in white uPVC`}
                />
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-surface/70 text-charcoal/60 backdrop-blur transition-colors hover:border-charcoal/40 hover:text-charcoal"
                aria-label="Previous product"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-surface/70 text-charcoal/60 backdrop-blur transition-colors hover:border-charcoal/40 hover:text-charcoal"
                aria-label="Next product"
              >
                →
              </button>
            </div>
          </motion.div>

          {/* Actions + carousel controls */}
          <motion.div
            className="lg:col-start-1 lg:row-start-2 lg:self-start"
            variants={rise}
            custom={2}
            initial="hidden"
            animate={state}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
              <MagneticButton
                href={hero.primaryCta.href}
                className="!bg-charcoal !px-7 !text-surface hover:!bg-navy"
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
                className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
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
                      className={`relative shrink-0 overflow-hidden rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
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
