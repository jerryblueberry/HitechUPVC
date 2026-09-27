"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { IMAGES } from "@/lib/images";
import { PremiumText } from "@/components/ui/PremiumText";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
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
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromClientX(event.clientX);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    setFromClientX(event.clientX);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    commitValue();
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
    <section className="section-padding bg-surface-muted">
      <div className="container-content">
        <RevealOnScroll>
          <p className="eyebrow mb-4">Transformations</p>
          <PremiumText as="h2" mode="words" className="font-display text-h2 text-navy mb-8">
            See the difference
          </PremiumText>
        </RevealOnScroll>

        <div
          ref={containerRef}
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={valueNow}
          aria-valuetext="Drag to compare before and after"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          className="relative aspect-[4/3] w-full cursor-ew-resize overflow-hidden rounded-3xl shadow-[0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-20px_rgba(27,27,29,0.18)] ring-1 ring-charcoal/5 select-none touch-none sm:aspect-[16/10]"
        >
          <Image
            src={IMAGES.beforeAfter.before}
            alt="Home before uPVC window renovation"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 90rem"
            draggable={false}
          />
          <span className="absolute top-4 left-4 z-10 text-xs font-medium uppercase tracking-wider text-surface bg-charcoal/60 px-3 py-1 rounded-full">
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
            <span className="absolute top-4 right-4 z-10 text-xs font-medium uppercase tracking-wider text-charcoal bg-gold/90 px-3 py-1 rounded-full">
              After
            </span>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-surface shadow-[0_0_0_1px_rgba(27,27,29,0.08)]"
            style={{ left: handleLeft, x: "-50%" }}
          >
            <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-surface text-charcoal shadow-lg">
              ↔
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
