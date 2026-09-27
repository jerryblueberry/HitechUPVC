"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Company } from "@/lib/types";
import { HERO_SLIDES } from "@/lib/heroSlides";
import { OpeningSequencePlayer } from "@/components/animations/OpeningSequencePlayer";
import { MagneticButton } from "@/components/ui/MagneticButton";

const ease = [0.22, 1, 0.36, 1] as const;
const AUTO_MS = 6500;

interface HeroCarouselProps {
  company: Company;
}

export function HeroCarousel({ company }: HeroCarouselProps) {
  const { hero } = company;
  const reducedMotion = useReducedMotion();
  const [[index, direction], setSlide] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressCtrl = useRef<ReturnType<typeof animate> | null>(null);

  const slide = HERO_SLIDES[index];
  const total = HERO_SLIDES.length;

  const goTo = useCallback(
    (next: number) => {
      const wrapped = (next + total) % total;
      setSlide([wrapped, next > index ? 1 : -1]);
    },
    [index, total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-advance + progress bar
  useEffect(() => {
    if (reducedMotion || paused) {
      progressCtrl.current?.stop();
      progress.set(0);
      return;
    }

    progress.set(0);
    progressCtrl.current = animate(progress, 1, {
      duration: AUTO_MS / 1000,
      ease: "linear",
    });

    timerRef.current = setTimeout(next, AUTO_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      progressCtrl.current?.stop();
    };
  }, [index, paused, reducedMotion, next, progress]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -80) next();
    else if (info.offset.x > 80) prev();
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.06,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.96,
      filter: "blur(4px)",
    }),
  };

  return (
    <section
      className="relative h-[92vh] min-h-[560px] max-h-[960px] overflow-hidden bg-charcoal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured UPVC products"
    >
      {/* Slide images */}
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={reducedMotion ? undefined : slideVariants}
          initial={reducedMotion ? false : "enter"}
          animate="center"
          exit="exit"
          transition={{ duration: 0.85, ease }}
          className="absolute inset-0"
          drag={reducedMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
        >
          {slide.sequenceFrames ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-navy via-charcoal to-navy" />
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at 65% 35%, rgba(182,154,107,0.2) 0%, transparent 55%)",
                }}
                aria-hidden
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-end pr-[6%] lg:pr-[12%]"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease }}
              >
                <OpeningSequencePlayer
                  key={slide.id}
                  frames={slide.sequenceFrames}
                  alt={slide.title}
                  bare
                  playing={!paused}
                  priority={index === 0}
                  variant="dark"
                  interval={750}
                  showProgress={slide.sequenceFrames.length > 1}
                  className="w-[min(52vw,520px)]"
                />
              </motion.div>
            </>
          ) : slide.productPng ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-navy via-charcoal to-navy" />
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at 65% 35%, rgba(182,154,107,0.2) 0%, transparent 55%)",
                }}
                aria-hidden
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-end pr-[8%] lg:pr-[15%]"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease }}
              >
                <Image
                  src={slide.productPng}
                  alt={slide.title}
                  width={720}
                  height={820}
                  priority={index === 0}
                  className="object-contain max-h-[72vh] w-auto drop-shadow-[0_32px_64px_rgba(0,0,0,0.45)]"
                  sizes="(max-width: 1024px) 70vw, 45vw"
                />
              </motion.div>
            </>
          ) : slide.image ? (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={reducedMotion ? {} : { scale: 1.1 }}
              transition={{ duration: AUTO_MS / 1000 + 1, ease: "linear" }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </motion.div>
          ) : null}

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/30 to-transparent" />

          {/* Photo-only motion overlays */}
          {!slide.productPng && !slide.sequenceFrames && slide.openingType === "sliding" && !reducedMotion && (
            <>
              <motion.div
                className="absolute inset-y-[18%] left-[8%] w-[42%] z-10 border border-surface/20 bg-charcoal/30 backdrop-blur-[2px]"
                initial={{ x: 0 }}
                animate={{ x: "-108%" }}
                transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden
              />
              <motion.div
                className="absolute inset-y-[18%] right-[8%] w-[42%] z-10 border border-surface/20 bg-charcoal/30 backdrop-blur-[2px]"
                initial={{ x: 0 }}
                animate={{ x: "108%" }}
                transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden
              />
            </>
          )}

          {!slide.productPng && !slide.sequenceFrames && slide.openingType === "french" && !reducedMotion && (
            <motion.div
              className="absolute top-[20%] right-[10%] w-[35%] h-[55%] border-2 border-surface/25 origin-left z-10"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -55 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 900 }}
              aria-hidden
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
        <div className="container-content pb-24 lg:pb-28 pt-32 pointer-events-auto">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.55, ease }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="eyebrow text-gold">{slide.eyebrow}</span>
                    <span className="text-surface/30">|</span>
                    <span className="text-xs uppercase tracking-widest text-surface/60">
                      {slide.badge}
                    </span>
                  </div>

                  <h1 className="font-display text-hero text-surface max-w-3xl mb-5 leading-[1.05]">
                    {slide.title}
                  </h1>

                  <p className="text-lg text-surface/75 max-w-xl mb-8 leading-relaxed">
                    {slide.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton
                  href={hero.primaryCta.href}
                  variant="primary"
                  className="!bg-gold !text-charcoal hover:!bg-gold/90"
                >
                  {hero.primaryCta.label}
                </MagneticButton>
                <MagneticButton
                  href={hero.secondaryCta.href}
                  variant="secondary"
                  className="!border-surface/40 !text-surface hover:!border-gold hover:!text-gold"
                >
                  {hero.secondaryCta.label}
                </MagneticButton>
              </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-30 container-content">
        <div className="flex items-center justify-between gap-4">
          {/* Counter */}
          <span className="text-sm font-medium text-surface/50 tabular-nums">
            {String(index + 1).padStart(2, "0")}
            <span className="text-surface/30 mx-1">/</span>
            {String(total).padStart(2, "0")}
          </span>

          {/* Dots + progress */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="h-px bg-surface/15 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-gold origin-left"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === index
                    ? "w-8 h-2 bg-gold"
                    : "w-2 h-2 bg-surface/30 hover:bg-surface/50"
                }`}
                aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
              />
            ))}
            <button
              type="button"
              onClick={prev}
              className="ml-3 w-10 h-10 rounded-full border border-surface/25 text-surface/70 hover:text-surface hover:border-surface/50 transition-colors flex items-center justify-center"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              className="w-10 h-10 rounded-full border border-surface/25 text-surface/70 hover:text-surface hover:border-surface/50 transition-colors flex items-center justify-center"
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
