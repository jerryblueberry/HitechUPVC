"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS, CATEGORY_PATHS } from "@/lib/constants";
import { categoryShowcasePoster } from "@/lib/upvcAssets";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

type ShowcaseCategory = "windows" | "doors";

const CATEGORIES: ShowcaseCategory[] = ["windows", "doors"];

const DESCRIPTIONS: Record<ShowcaseCategory, string> = {
  windows: "Sliding, casement, tilt & turn — made to measure.",
  doors: "French, sliding, and folding for indoor-outdoor living.",
};

interface ProductCategoryShowcaseProps {
  counts: Record<ShowcaseCategory, number>;
}

/** Static product tiles — owned studio stills, no secondary WebGL. */
export function ProductCategoryShowcase({ counts }: ProductCategoryShowcaseProps) {
  return (
    <section className="section-padding overflow-hidden bg-surface !pt-0">
      <div className="container-content">
        <RevealOnScroll className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4 text-gold">Our Products</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-tight text-charcoal text-balance">
              Windows and doors, crafted for modern living.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-charcoal/70 sm:text-lg">
              Every system is made to measure in white or any of our finishes.
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

        <div className="-mx-6 flex snap-x snap-mandatory scroll-px-6 touch-manipulation gap-8 overflow-x-auto overscroll-x-contain px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-10 md:overflow-visible md:px-0 md:pb-0 lg:gap-14">
          {CATEGORIES.map((category, i) => {
            const label = CATEGORY_LABELS[category];
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
                        sizes="(max-width: 768px) 78vw, 50vw"
                        className="object-contain p-7 transition-[transform] duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:p-9"
                      />
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
