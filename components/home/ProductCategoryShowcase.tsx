"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORY_LABELS, CATEGORY_PATHS } from "@/lib/constants";
import type { ProductCategory } from "@/lib/types";
import { useCanHover } from "@/components/three/hooks";
import { LazyUpvcPanelViewer } from "@/components/three/LazyUpvcPanelViewer";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const CATEGORIES: ProductCategory[] = ["windows", "doors", "panels"];

const DESCRIPTIONS: Record<ProductCategory, string> = {
  windows: "Sliding, casement, tilt & turn — made to measure.",
  doors: "French, sliding, and folding for indoor-outdoor living.",
  panels: "Fluted woodgrain wall panels — the feature wall, no paint.",
};

interface ProductCategoryShowcaseProps {
  counts: Record<ProductCategory, number>;
}

export function ProductCategoryShowcase({ counts }: ProductCategoryShowcaseProps) {
  const [active, setActive] = useState<ProductCategory | null>(null);
  const canHover = useCanHover();

  return (
    <section className="section-padding overflow-hidden bg-surface !pt-0">
      <div className="container-content">
        <RevealOnScroll className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4 text-gold">Our Products</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              Windows, doors &amp; panels, crafted for modern living.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-charcoal/60 sm:text-lg">
              Every system is made to measure in white or any of our finishes.
              {canHover ? " Hover a tile to see it move." : ""}
            </p>
          </div>
          <MagneticButton
            href="/products"
            className="group shrink-0 self-start !bg-charcoal !px-7 !text-surface hover:!bg-navy lg:self-end"
          >
            Explore our products
            <span
              className="ml-1.5 inline-block transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-1"
              aria-hidden
            >
              ›
            </span>
          </MagneticButton>
        </RevealOnScroll>

        <div className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-8 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0 md:pb-0 lg:gap-14">
          {CATEGORIES.map((category, i) => {
            const isActive = active === category;
            const label = CATEGORY_LABELS[category];

            return (
              <RevealOnScroll
                key={category}
                delay={i * 0.08}
                className="w-[78%] shrink-0 snap-start sm:w-[54%] md:w-auto"
              >
                <Link
                  href={CATEGORY_PATHS[category]}
                  className="group block focus-visible:outline-none"
                  onMouseEnter={() => setActive(category)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(category)}
                  onBlur={() => setActive(null)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-white ring-1 ring-charcoal/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-28px_rgba(27,27,29,0.16)] transition-[transform,box-shadow] duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-1 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(27,27,29,0.04),0_36px_64px_-28px_rgba(27,27,29,0.22)] group-focus-visible:ring-2 group-focus-visible:ring-gold group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-surface">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-cream)_0%,white_40%,var(--color-surface)_78%,var(--color-taupe)_100%)]"
                    />
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

                  <div className="mt-6 px-1">
                    <p className="text-[0.8125rem] text-charcoal/45">
                      {counts[category]} {counts[category] === 1 ? "style" : "styles"}
                    </p>
                    <h3 className="mt-1 font-display text-[1.85rem] leading-tight tracking-tight text-charcoal sm:text-[2rem]">
                      {label}
                    </h3>
                    <p className="mt-2 max-w-[18rem] text-[0.9375rem] leading-relaxed text-charcoal/60">
                      {DESCRIPTIONS[category]}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy">
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
