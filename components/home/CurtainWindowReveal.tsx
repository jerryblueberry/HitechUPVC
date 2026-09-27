"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { IMAGES } from "@/lib/images";
import { UPVC_SEQUENCES } from "@/lib/upvcAssets";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    eyebrow: "Natural light",
    title: "Watch the room come alive",
    body: "Two window leaves glide apart — revealing precision-engineered UPVC frames and glass that draws daylight deep into your home.",
  },
  {
    eyebrow: "Quiet precision",
    title: "Windows that open with intent",
    body: "Soft-close hardware, multi-point locking, and profiles shaped for thermal performance — every detail considered.",
  },
] as const;

function WindowPanel({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div
      className={`window-panel-${side} absolute inset-y-0 ${isLeft ? "left-0 w-1/2" : "right-0 w-1/2"} z-20 will-change-transform`}
      aria-hidden
    >
      <div
        className={`relative h-full w-full ${isLeft ? "bg-charcoal" : "bg-cream"} p-2 sm:p-3 lg:p-5`}
      >
        <div
          className={`relative h-full w-full border ${
            isLeft ? "border-surface/15" : "border-charcoal/10"
          }`}
        >
          <div
            className={`absolute inset-1.5 sm:inset-2 lg:inset-3 overflow-hidden ${
              isLeft
                ? "bg-linear-to-br from-navy/70 via-charcoal/50 to-charcoal/90"
                : "bg-linear-to-br from-surface/90 via-cream to-surface-muted"
            }`}
          >
            <div
              className="absolute inset-0 opacity-35"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.28) 0%, transparent 42%, transparent 68%, rgba(255,255,255,0.1) 100%)",
              }}
            />
          </div>

          <div className="absolute inset-x-3 sm:inset-x-4 lg:inset-x-5 top-1/2 h-px bg-surface/12" />
          <div className="absolute inset-y-3 sm:inset-y-4 lg:inset-y-5 left-1/2 w-px bg-surface/12" />

          <div
            className={`absolute top-1/2 -translate-y-1/2 w-1 h-10 sm:h-12 lg:h-16 rounded-full bg-gold/85 shadow-sm ${
              isLeft ? "right-3 sm:right-4 lg:right-6" : "left-3 sm:left-4 lg:left-6"
            }`}
          />
        </div>
      </div>

      <div
        className={`absolute inset-y-0 ${isLeft ? "right-0" : "left-0"} w-4 sm:w-6 pointer-events-none ${
          isLeft
            ? "bg-linear-to-l from-black/25 to-transparent"
            : "bg-linear-to-r from-black/15 to-transparent"
        }`}
      />
    </div>
  );
}

function StageCopy() {
  return (
    <>
      <div className="grid w-full max-w-xl lg:max-w-2xl">
        {STAGES.map((stage, i) => (
          <article
            key={stage.title}
            className={`stage-copy-${i} col-start-1 row-start-1 w-full`}
            style={{
              visibility: i === 0 ? "visible" : "hidden",
              opacity: i === 0 ? 1 : 0,
            }}
          >
            <p className="eyebrow text-gold mb-3 sm:mb-4 lg:mb-5">{stage.eyebrow}</p>
            <h2 className="font-display text-[clamp(1.75rem,5vw,3.25rem)] text-surface mb-4 sm:mb-5 lg:mb-6 leading-[1.08] tracking-tight max-w-[16ch]">
              {stage.title}
            </h2>
            <p className="text-base sm:text-lg text-surface/80 leading-relaxed max-w-prose">
              {stage.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-10 flex items-center gap-2.5" aria-hidden>
        {STAGES.map((_, i) => (
          <span
            key={i}
            className={`stage-dot-${i} block h-1 w-8 rounded-full ${
              i === 0 ? "bg-gold" : "bg-gold opacity-35"
            }`}
          />
        ))}
      </div>
    </>
  );
}

function SceneLayers({ priority = false }: { priority?: boolean }) {
  return (
    <div className="absolute inset-0">
      <div className="scene-interior absolute inset-0">
        <Image
          src={IMAGES.curtains.openLight}
          alt="Sunlit interior with window"
          fill
          className="object-cover"
          sizes="100vw"
          priority={priority}
        />
      </div>
      <div className="scene-exterior absolute inset-0 opacity-0">
        <Image
          src={UPVC_SEQUENCES.hero}
          alt="Hi-Tech uPVC sliding doors with lake view"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div
        className="viewport-light absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 55% 45%, rgba(247,246,243,0.2) 0%, transparent 65%)",
        }}
        aria-hidden
      />
    </div>
  );
}

function ReducedFallback() {
  return (
    <section className="section-padding bg-navy text-surface">
      <div className="container-content">
        <div className="relative aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-surface/10 mb-10">
          <Image
            src={UPVC_SEQUENCES.hero}
            alt="Hi-Tech uPVC doors with view"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <StageCopy />
      </div>
    </section>
  );
}

export function CurtainWindowReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current || !pinRef.current) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023px)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: isMobile ? "+=190%" : "+=220%",
              pin: pinRef.current,
              scrub: isMobile ? 0.85 : 1.1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(
            ".window-panel-left",
            { xPercent: -100, duration: 1.2, ease: "power3.inOut" },
            0
          );
          tl.to(
            ".window-panel-right",
            { xPercent: 100, duration: 1.2, ease: "power3.inOut" },
            0
          );

          tl.fromTo(
            ".viewport-light",
            { opacity: 0 },
            { opacity: 1, duration: 0.75, ease: "power2.out" },
            0.35
          );

          tl.to(".stage-copy-0", { autoAlpha: 0, y: -10, duration: 0.4, ease: "power2.in" }, 0.85);
          tl.fromTo(
            ".stage-copy-1",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
            1.0
          );
          tl.to(".stage-dot-0", { opacity: 0.35, duration: 0.35 }, 0.85);
          tl.to(".stage-dot-1", { opacity: 1, duration: 0.35 }, 0.85);

          tl.to(".scene-interior", { opacity: 0, duration: 0.65, ease: "power2.inOut" }, 1.55);
          tl.to(".scene-exterior", { opacity: 1, duration: 0.65, ease: "power2.inOut" }, 1.55);
        }
      );

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  if (reducedMotion) {
    return <ReducedFallback />;
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[190vh] lg:h-[220vh]"
      aria-label="Scroll to open windows reveal"
    >
      <div
        ref={pinRef}
        className="relative h-[100dvh] min-h-[520px] overflow-hidden bg-navy"
      >
        <SceneLayers priority />

        <WindowPanel side="left" />
        <WindowPanel side="right" />

        <div
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-surface/20 z-[21] pointer-events-none"
          aria-hidden
        />

        {/* Mobile: bottom gradient · Desktop: left gradient */}
        <div
          className="absolute inset-0 bg-linear-to-t from-navy/95 via-navy/55 to-navy/10 lg:bg-linear-to-r lg:from-navy/95 lg:via-navy/55 lg:to-transparent z-[25] pointer-events-none"
          aria-hidden
        />

        {/* Copy — bottom on mobile, vertically centred on desktop */}
        <div className="relative z-30 h-full flex items-end lg:items-center pb-16 sm:pb-20 lg:pb-0">
          <div className="container-content w-full px-5 sm:px-6 lg:px-8">
            <StageCopy />
          </div>
        </div>

        <div
          className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-surface/40"
          aria-hidden
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll to open</span>
          <span className="block w-px h-6 sm:h-8 bg-surface/25" />
        </div>
      </div>
    </section>
  );
}
