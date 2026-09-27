"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORY_LABELS, CATEGORY_PATHS } from "@/lib/constants";
import type { ProductCategory } from "@/lib/types";
import { useCanHover } from "@/components/three/hooks";
import { LazyUpvcPanelViewer } from "@/components/three/LazyUpvcPanelViewer";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const CATEGORIES: ProductCategory[] = ["windows", "doors", "panels"];

const DESCRIPTIONS: Record<ProductCategory, string> = {
  windows: "Sliding, casement, tilt & turn — engineered for comfort and efficiency.",
  doors: "French, sliding, and folding systems for seamless indoor-outdoor living.",
  panels: "Contemporary cladding with premium finishes and lasting durability.",
};

interface ProductCategoryShowcaseProps {
  /** Number of products per category, shown as "N styles" */
  counts: Record<ProductCategory, number>;
}

export function ProductCategoryShowcase({ counts }: ProductCategoryShowcaseProps) {
  const [active, setActive] = useState<ProductCategory | null>(null);
  const canHover = useCanHover();

  return (
    // Follows USPStrip on the same background, so the shared edge needs no second padding.
    <section className="section-padding overflow-hidden bg-surface !pt-0">
      <div className="container-content">
        <RevealOnScroll className="mb-10 max-w-2xl lg:mb-14">
          <p className="eyebrow mb-4 text-gold">Our Products</p>
          <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
            Windows, doors &amp; panels, crafted for modern living.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-charcoal/60 sm:text-lg">
            Every system is made to measure in white or any of our finishes.
            {canHover ? " Hover a card to see it move." : ""}
          </p>
        </RevealOnScroll>

        <div className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {CATEGORIES.map((category, i) => {
            const isActive = active === category;
            const label = CATEGORY_LABELS[category];

            return (
              <RevealOnScroll
                key={category}
                delay={i * 0.1}
                className="w-[84%] shrink-0 snap-start sm:w-[60%] md:w-auto"
              >
                <Link
                  href={CATEGORY_PATHS[category]}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white p-3 ring-1 ring-charcoal/[0.05] shadow-[0_1px_2px_rgba(27,27,29,0.04),0_12px_32px_-16px_rgba(27,27,29,0.12)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(27,27,29,0.04),0_28px_56px_-24px_rgba(27,27,29,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  onMouseEnter={() => setActive(category)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(category)}
                  onBlur={() => setActive(null)}
                >
                  <div
                    className="relative aspect-[4/3.6] overflow-hidden rounded-[1.25rem]"
                    style={{
                      background:
                        "radial-gradient(90% 85% at 50% 38%, #ffffff 0%, #f7f6f3 55%, #ebe7e0 100%)",
                    }}
                  >
                    {category === "panels" ? (
                      <LazyUpvcPanelViewer
                        open={isActive ? 1 : 0}
                        autoPlay={!canHover}
                        className="pointer-events-none absolute inset-0"
                      />
                    ) : (
                      <LazyUpvcViewer
                        openingType={category === "windows" ? "casement" : "french"}
                        category={category}
                        open={isActive ? 1 : 0}
                        autoPlay={!canHover}
                        quality="balanced"
                        className="pointer-events-none absolute inset-0"
                        posterAlt={`Hi-Tech uPVC ${label}`}
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col px-4 pb-4 pt-6">
                    <p className="eyebrow mb-2 text-gold">
                      {counts[category]} {counts[category] === 1 ? "style" : "styles"}
                    </p>
                    <h3 className="font-display text-[1.75rem] leading-tight tracking-tight text-charcoal">
                      {label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                      {DESCRIPTIONS[category]}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-navy">
                      Explore {label.toLowerCase()}
                      <span
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      >
                        ›
                      </span>
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
