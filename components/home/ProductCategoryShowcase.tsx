"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CATEGORY_LABELS, CATEGORY_PATHS } from "@/lib/constants";
import type { ProductCategory } from "@/lib/types";
import { categoryShowcasePoster } from "@/lib/upvcAssets";
import { ApproachedMount } from "@/components/three/ApproachedMount";
import { useCanHover } from "@/components/three/hooks";
import { LazyUpvcPanelViewer } from "@/components/three/LazyUpvcPanelViewer";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import {
  allowsSecondaryLive3d,
  useDeviceTier,
} from "@/components/three/quality";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const CATEGORIES: ProductCategory[] = ["windows", "doors", "panels"];

const DESCRIPTIONS: Record<ProductCategory, string> = {
  windows: "Sliding, casement, tilt & turn — made to measure.",
  doors: "French, sliding, and folding for indoor-outdoor living.",
  panels: "Fluted woodgrain wall panels — the feature wall, no paint.",
};

/**
 * Soft fluted-woodgrain wash for the panels tile when we have no owned still.
 * Avoids the watermarked stock cutout while keeping the studio look.
 */
function PanelStudioWash() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center p-8 sm:p-10"
    >
      <div className="relative h-full w-[72%] max-w-[14rem] overflow-hidden rounded-sm shadow-[0_28px_56px_-32px_rgba(27,27,29,0.45)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, #c4a574 0%, #a67c52 38%, #8b6239 72%, #6e4a2a 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 10px, rgba(0,0,0,0.18) 10px 12px, transparent 12px 22px, rgba(255,255,255,0.08) 22px 23px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.28) 100%)",
          }}
        />
      </div>
    </div>
  );
}

interface ProductCategoryShowcaseProps {
  counts: Record<ProductCategory, number>;
}

/**
 * Poster-first product tiles. Live 3D mounts only on high-tier + hover/focus
 * so the page never keeps three secondary WebGL contexts warm.
 * Posters are studio captures from our parametric renderer — never stock PNGs.
 */
export function ProductCategoryShowcase({ counts }: ProductCategoryShowcaseProps) {
  const [active, setActive] = useState<ProductCategory | null>(null);
  const canHover = useCanHover();
  const tier = useDeviceTier();
  const liveAllowed = allowsSecondaryLive3d(tier);

  return (
    <section className="section-padding overflow-hidden bg-surface !pt-0">
      <div className="container-content">
        <RevealOnScroll className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4 text-gold">Our Products</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              Windows, doors &amp; panels, crafted for modern living.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-charcoal/70 sm:text-lg">
              Every system is made to measure in white or any of our finishes.
              {liveAllowed && canHover ? " Hover a tile to see it move." : ""}
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

        <div className="-mx-6 flex snap-x snap-mandatory scroll-px-6 touch-manipulation gap-8 overflow-x-auto overscroll-x-contain px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0 md:pb-0 lg:gap-14">
          {CATEGORIES.map((category, i) => {
            const isActive = active === category;
            const label = CATEGORY_LABELS[category];
            const showLive = liveAllowed && canHover && isActive;
            const poster = categoryShowcasePoster(category);

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
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-cream/40 ring-1 ring-charcoal/[0.04] transition-[box-shadow,transform] duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-0.5 group-hover:shadow-[0_28px_56px_-36px_rgba(27,27,29,0.28)] group-focus-visible:ring-2 group-focus-visible:ring-gold group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-surface motion-reduce:group-hover:translate-y-0">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_18%,#ffffff_0%,var(--color-cream)_42%,var(--color-surface)_78%,var(--color-taupe)_100%)]"
                    />
                    {poster ? (
                      <Image
                        src={poster}
                        alt={`Hi-Tech uPVC ${label}`}
                        fill
                        sizes="(max-width: 768px) 78vw, 33vw"
                        className={`object-contain p-7 sm:p-9 transition-[opacity,transform] duration-700 ease-[var(--ease-premium)] motion-reduce:transition-none ${
                          showLive
                            ? "opacity-0"
                            : "opacity-100 group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                        }`}
                      />
                    ) : (
                      <div
                        className={`transition-opacity duration-700 ease-[var(--ease-premium)] ${
                          showLive ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <PanelStudioWash />
                      </div>
                    )}
                    {showLive ? (
                      <ApproachedMount className="pointer-events-none absolute inset-0">
                        {category === "panels" ? (
                          <LazyUpvcPanelViewer
                            open={1}
                            autoPlay={false}
                            className="h-full w-full"
                          />
                        ) : (
                          <LazyUpvcViewer
                            openingType={
                              category === "windows" ? "casement" : "french"
                            }
                            category={category}
                            open={1}
                            autoPlay={false}
                            quality="balanced"
                            className="h-full w-full"
                            posterAlt={`Hi-Tech uPVC ${label}`}
                            posterSrc={poster ?? undefined}
                          />
                        )}
                      </ApproachedMount>
                    ) : null}
                  </div>

                  <div className="mt-6 px-1">
                    <p className="text-[0.8125rem] text-charcoal/45">
                      {counts[category]}{" "}
                      {counts[category] === 1 ? "style" : "styles"}
                    </p>
                    <h3 className="mt-1 font-display text-[1.85rem] leading-tight tracking-tight text-charcoal sm:text-[2rem]">
                      {label}
                    </h3>
                    <p className="mt-2 max-w-[18rem] text-[0.9375rem] leading-relaxed text-charcoal/60">
                      {DESCRIPTIONS[category]}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy underline-offset-4 group-hover:underline">
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
