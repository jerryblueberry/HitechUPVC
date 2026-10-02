"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { IMAGES } from "@/lib/images";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function DragHandleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="none">
      <path
        d="M8 12H4m0 0 3-3M4 12l3 3M16 12h4m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const gesture = useRef<{ x: number; y: number; axis: "x" | "y" | null } | null>(null);
  const position = useMotionValue(50);
  const [valueNow, setValueNow] = useState(50);
  const clipPath = useTransform(position, (pct) => `inset(0 ${100 - pct}% 0 0)`);
  const handleLeft = useTransform(position, (pct) => `${pct}%`);

  const commitValue = useCallback(() => {
    setValueNow(Math.round(position.get()));
  }, [position]);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const { left, width } = el.getBoundingClientRect();
      if (width <= 0) return;
      position.set(clamp(((clientX - left) / width) * 100, 0, 100));
    },
    [position]
  );

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    gesture.current = { x: event.clientX, y: event.clientY, axis: null };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start) return;
    if (!start.axis) {
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.hypot(dx, dy) < 8) return;
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (start.axis === "y") {
        gesture.current = null;
        return;
      }
      dragging.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (start.axis === "x") setFromClientX(event.clientX);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const wasDragging = dragging.current;
    dragging.current = false;
    gesture.current = null;
    if (wasDragging) commitValue();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 4;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      position.set(clamp(position.get() - step, 0, 100));
      commitValue();
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      position.set(clamp(position.get() + step, 0, 100));
      commitValue();
    }
    if (event.key === "Home") {
      event.preventDefault();
      position.set(0);
      commitValue();
    }
    if (event.key === "End") {
      event.preventDefault();
      position.set(100);
      commitValue();
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-surface section-padding"
      aria-labelledby="transformations-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 50% 20%, #ffffff 0%, transparent 55%), radial-gradient(60% 50% at 85% 80%, rgba(196,165,116,0.08) 0%, transparent 50%)",
        }}
        aria-hidden
      />

      <div className="container-content relative">
        <RevealOnScroll className="mb-8 max-w-2xl sm:mb-10 lg:mb-12">
          <p className="eyebrow mb-3 text-gold sm:mb-4">Transformations</p>
          <h2
            id="transformations-heading"
            className="font-display text-[clamp(1.85rem,4.2vw,3.25rem)] leading-[1.05] tracking-tight text-balance text-charcoal"
          >
            See the difference
          </h2>
          <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-charcoal/60 sm:mt-4 sm:text-base lg:text-lg">
            Drag the handle to compare a tired opening with a sealed Hi-Tech
            uPVC install — quieter rooms, cleaner sightlines, finishes that hold.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <div
            ref={containerRef}
            role="slider"
            tabIndex={0}
            aria-label="Before and after comparison"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={valueNow}
            aria-valuetext={`${valueNow}% after — drag or use arrow keys to compare`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            className="relative aspect-[5/4] w-full cursor-ew-resize touch-pan-y overflow-hidden rounded-3xl shadow-[0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-20px_rgba(27,27,29,0.18)] ring-1 ring-charcoal/[0.06] select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:aspect-[16/10] sm:rounded-[2rem] lg:aspect-[21/10]"
          >
            <Image
              src={IMAGES.beforeAfter.before}
              alt="Home before uPVC window renovation"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 90rem"
              draggable={false}
              priority={false}
            />
            <span className="absolute top-3 left-3 z-10 rounded-full bg-charcoal/70 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-surface backdrop-blur-sm sm:top-5 sm:left-5 sm:px-3 sm:py-1.5 sm:text-xs">
              Before
            </span>

            <motion.div className="absolute inset-0" style={{ clipPath }}>
              <Image
                src={IMAGES.beforeAfter.after}
                alt="Home after uPVC window renovation"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 90rem"
                draggable={false}
              />
              <span className="absolute top-3 right-3 z-10 rounded-full bg-gold px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-charcoal sm:top-5 sm:right-5 sm:px-3 sm:py-1.5 sm:text-xs">
                After
              </span>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-surface shadow-[0_0_0_1px_rgba(27,27,29,0.08)]"
              style={{ left: handleLeft, x: "-50%" }}
            >
              <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/80 bg-surface text-charcoal shadow-[0_8px_24px_-8px_rgba(27,27,29,0.35)] sm:h-12 sm:w-12">
                <DragHandleIcon />
              </div>
            </motion.div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
