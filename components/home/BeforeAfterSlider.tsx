"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { IMAGES } from "@/lib/images";
import { PremiumText } from "@/components/ui/PremiumText";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);

  function handleDrag(_: unknown, info: { point: { x: number } }) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((info.point.x - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
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
          className="relative aspect-[16/10] max-w-5xl mx-auto rounded-xl overflow-hidden select-none shadow-2xl shadow-charcoal/10"
        >
          <Image
            src={IMAGES.beforeAfter.before}
            alt="Home before UPVC window renovation"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 80vw"
          />
          <span className="absolute top-4 left-4 z-10 text-xs font-medium uppercase tracking-wider text-surface bg-charcoal/60 px-3 py-1 rounded-full">
            Before
          </span>

          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src={IMAGES.beforeAfter.after}
              alt="Home after UPVC window renovation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
            <span className="absolute top-4 right-4 z-10 text-xs font-medium uppercase tracking-wider text-charcoal bg-gold/90 px-3 py-1 rounded-full">
              After
            </span>
          </div>

          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-surface z-20 cursor-ew-resize shadow-lg"
            style={{ left: `${position}%` }}
            drag="x"
            dragMomentum={false}
            onDrag={handleDrag}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface border-2 border-gold flex items-center justify-center text-charcoal shadow-lg">
              ↔
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
