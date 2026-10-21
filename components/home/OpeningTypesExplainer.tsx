"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { OpeningType } from "@/lib/types";
import { OPENING_TYPE_LABELS } from "@/lib/constants";
import { DEMO_OPENING_TYPES } from "@/lib/upvc3d";
import { getUpvcPngForOpening } from "@/lib/upvcAssets";
import { ApproachedMount } from "@/components/three/ApproachedMount";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import {
  allowsSecondaryLive3d,
  useDeviceTier,
} from "@/components/three/quality";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const OPENING_TYPES: OpeningType[] = DEMO_OPENING_TYPES;
const DOOR_TYPES: OpeningType[] = ["folding", "french", "hinged"];

const DESCRIPTIONS: Record<string, string> = {
  "tilt-turn":
    "Tilt for secure ventilation, or turn to swing the sash inward for cleaning.",
  casement:
    "Side-hung on friction stays — the widest clear opening, and the easiest to seal.",
  sliding:
    "Sashes run on stainless rollers within the frame. Nothing projects into the room.",
  french:
    "Two leaves swing apart from a meeting stile, leaving the full opening clear.",
  folding:
    "Panels concertina along a track and stack clear of the opening.",
  hinged:
    "A single reinforced leaf on three hinges with full-height multi-point locking.",
};

/**
 * Compact opening-type strip. Live 3D only on high-tier devices; everyone else
 * gets static posters so this section never competes with the scroll door.
 */
export function OpeningTypesExplainer() {
  const [active, setActive] = useState<OpeningType>("tilt-turn");
  const [wantsLive, setWantsLive] = useState(false);
  const tier = useDeviceTier();
  const liveAllowed = allowsSecondaryLive3d(tier);
  const showLive = liveAllowed && wantsLive;

  return (
    <section className="section-padding overflow-hidden bg-surface !pt-0">
      <div className="container-content">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-balance text-charcoal">
              How every opening works.
            </h2>
            <p className="mt-4 mb-8 max-w-md text-base leading-relaxed text-charcoal/70 sm:text-lg">
              Pick a mechanism — then explore the full catalogue for sizes,
              finishes, and fittings.
            </p>

            <div
              role="tablist"
              aria-label="Opening type"
              className="mb-6 flex flex-wrap gap-2"
            >
              {OPENING_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={active === type}
                  onClick={() => {
                    setActive(type);
                    if (liveAllowed) setWantsLive(true);
                  }}
                  className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
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
                className="min-h-[3.5rem] max-w-md text-sm leading-relaxed text-charcoal/65 sm:text-[0.9375rem]"
              >
                {DESCRIPTIONS[active]}
              </motion.p>
            </AnimatePresence>

            <Link
              href="/products"
              className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-navy underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              See all systems ›
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delay={0.08} className="relative">
            <div
              className="overflow-hidden rounded-[2rem] ring-1 ring-charcoal/[0.05] shadow-[0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-24px_rgba(27,27,29,0.18)]"
              style={{
                background:
                  "radial-gradient(90% 80% at 50% 40%, #ffffff 0%, #f7f6f3 55%, #ebe7e0 100%)",
              }}
            >
              <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src={getUpvcPngForOpening(active)}
                  alt={`${OPENING_TYPE_LABELS[active]} uPVC unit`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-contain p-8 transition-opacity duration-500 ${
                    showLive ? "opacity-0" : "opacity-100"
                  }`}
                />
                {showLive ? (
                  <ApproachedMount className="absolute inset-0">
                    <LazyUpvcViewer
                      openingType={active}
                      category={
                        DOOR_TYPES.includes(active) ? "doors" : "windows"
                      }
                      autoPlay
                      interactive
                      className="h-full w-full"
                      posterAlt={`${OPENING_TYPE_LABELS[active]} uPVC unit`}
                      posterSrc={getUpvcPngForOpening(active)}
                    />
                  </ApproachedMount>
                ) : null}
              </div>
            </div>
            {liveAllowed ? (
              <p className="mt-3 text-center text-caption text-charcoal/40">
                {showLive
                  ? "Drag to look around"
                  : "Select a type to play the live model"}
              </p>
            ) : null}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
