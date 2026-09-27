"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { OpeningType } from "@/lib/types";
import { OPENING_TYPE_LABELS } from "@/lib/constants";
import { DEMO_OPENING_TYPES } from "@/lib/upvc3d";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const OPENING_TYPES: OpeningType[] = DEMO_OPENING_TYPES;

/** Doors and windows use different profile weights and proportions. */
const DOOR_TYPES: OpeningType[] = ["folding", "french", "hinged"];

const DESCRIPTIONS: Record<string, string> = {
  "tilt-turn":
    "One handle, two actions. Tilt in from the top for secure trickle ventilation, or turn the handle again to swing the whole sash inward for cleaning.",
  casement:
    "Side-hung on friction stays so the sash holds at any angle. The widest clear opening of any window, and the easiest to seal.",
  sliding:
    "Sashes run on stainless rollers within the frame depth. Nothing projects into the room, which suits walkways and balconies.",
  french:
    "Two leaves swing apart from a central meeting stile, leaving the full structural opening clear. Multi-point locking on both leaves.",
  folding:
    "Panels hinge to each other and concertina along a track, stacking clear of the opening to join inside and outside completely.",
  hinged:
    "A single reinforced leaf on three hinges, with a solid lower panel and a full-height locking mechanism.",
};

export function OpeningTypesExplainer() {
  const [active, setActive] = useState<OpeningType>("tilt-turn");

  return (
    <section className="section-padding overflow-hidden bg-surface">
      <div className="container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <RevealOnScroll>
            <p className="eyebrow text-gold mb-4">How they open</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              Understand every opening type.
            </h2>
            <p className="mt-4 mb-8 max-w-md text-base leading-relaxed text-charcoal/60 sm:text-lg">
              Choosing the right mechanism affects ventilation, cleaning access,
              and how your space connects to the outdoors.
            </p>

            <div
              role="tablist"
              aria-label="Opening type"
              className="flex flex-wrap gap-2 mb-6"
            >
              {OPENING_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={active === type}
                  onClick={() => setActive(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                    active === type
                      ? "bg-charcoal text-surface"
                      : "bg-charcoal/[0.05] text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal"
                  }`}
                >
                  {OPENING_TYPE_LABELS[type]}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-charcoal/60 text-caption leading-relaxed max-w-md min-h-[4.5rem]"
              >
                {DESCRIPTIONS[active]}
              </motion.p>
            </AnimatePresence>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15} className="relative">
            <div
              className="overflow-hidden rounded-[2rem] ring-1 ring-charcoal/[0.05] shadow-[0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-24px_rgba(27,27,29,0.18)]"
              style={{
                background:
                  "radial-gradient(90% 80% at 50% 40%, #ffffff 0%, #f7f6f3 55%, #ebe7e0 100%)",
              }}
            >
              <LazyUpvcViewer
                openingType={active}
                category={DOOR_TYPES.includes(active) ? "doors" : "windows"}
                autoPlay
                interactive
                className="aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]"
                posterAlt={`${OPENING_TYPE_LABELS[active]} uPVC unit`}
              />
            </div>
            <p className="mt-3 text-center text-caption text-charcoal/40">
              Drag to look around
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
