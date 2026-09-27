"use client";

import { motion } from "framer-motion";
import type { ColorSwatch } from "@/lib/types";
import { PremiumText } from "@/components/ui/PremiumText";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface ColorFinishesProps {
  colors: ColorSwatch[];
}

export function ColorFinishes({ colors }: ColorFinishesProps) {
  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-content">
        <RevealOnScroll>
          <p className="eyebrow mb-4">Finishes</p>
          <PremiumText as="h2" mode="words" className="font-display text-h2 text-navy mb-4 max-w-xl">
            A palette as refined as your architecture
          </PremiumText>
          <PremiumText as="p" mode="block" delay={0.15} className="text-charcoal/65 max-w-lg mb-12">
            Solid RAL colours, authentic woodgrain foils, and dual-tone options —
            each finish chosen for longevity and quiet elegance.
          </PremiumText>
        </RevealOnScroll>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-5">
          {colors.map((color, i) => (
            <RevealOnScroll key={color.slug} delay={i * 0.05}>
              <motion.button
                type="button"
                className="group w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-xl"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="aspect-square rounded-xl mb-3 border border-charcoal/8 shadow-sm transition-shadow duration-300 group-hover:shadow-md relative overflow-hidden"
                  style={{ backgroundColor: color.hex }}
                >
                  {color.type === "woodgrain" && (
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background:
                          "repeating-linear-gradient(92deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)",
                      }}
                      aria-hidden
                    />
                  )}
                  <div className="absolute inset-0 ring-1 ring-inset ring-charcoal/5 rounded-xl" />
                </div>
                <p className="text-sm font-medium text-navy group-hover:text-gold transition-colors">
                  {color.name}
                </p>
                <p className="text-xs text-charcoal/45 capitalize">{color.type}</p>
              </motion.button>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
