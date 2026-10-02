"use client";

/**
 * Real-time 3D configurator. Finish, hardware, glazing and the opening itself
 * all update the same parametric model — there are no pre-rendered variants.
 */

import Link from "next/link";
import { useState } from "react";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import { PreviewMotionControl, usePreviewMotion } from "@/components/three/PreviewMotionControl";
import { OPENING_TYPE_LABELS, quoteHref } from "@/lib/constants";
import type { ColorSwatch, OpeningType, ProductCategory } from "@/lib/types";
import {
  FINISHES,
  GLAZING,
  GLAZING_ORDER,
  HARDWARE,
  HARDWARE_ORDER,
  type GlazingSlug,
  type HardwareSlug,
} from "@/lib/upvc3d";

export interface UpvcConfiguratorProps {
  openingType: OpeningType;
  category: ProductCategory;
  /** Finishes offered for this product */
  colors: ColorSwatch[];
  productName: string;
}

const FIELDSET = "border-t border-charcoal/10 pt-6";
const LEGEND = "eyebrow mb-4 block";
const SWATCH_BASE =
  "relative h-10 w-10 rounded-full transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
const CHIP_BASE =
  "px-3.5 py-2 rounded-full text-caption font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export function UpvcConfigurator({
  openingType,
  category,
  colors,
  productName,
}: UpvcConfiguratorProps) {
  // Only finishes with a defined 3D material can be previewed.
  const finishes = colors.filter((color) => FINISHES[color.slug]);

  const [finish, setFinish] = useState(finishes[0]?.slug ?? "white");
  const [hardware, setHardware] = useState<HardwareSlug>("chrome");
  const [glazing, setGlazing] = useState<GlazingSlug>("clear");
  const { motion, setMotion, reducedMotion } = usePreviewMotion();
  const animated = openingType !== "fixed";

  const activeFinish = finishes.find((color) => color.slug === finish);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12 items-start">
      <figure
        className="relative aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden ring-1 ring-charcoal/[0.06]"
        style={{
          background:
            "radial-gradient(110% 85% at 50% 35%, #ffffff 0%, #f4f1eb 55%, #e3ded4 100%)",
        }}
      >
        <LazyUpvcViewer
          openingType={openingType}
          category={category}
          finishSlug={finish}
          hardwareSlug={hardware}
          glazingSlug={glazing}
          autoPlay={animated && motion === "demo"}
          open={motion === "open" ? 1 : 0}
          interactive
          className="h-full w-full"
          posterAlt={`${productName} in ${activeFinish?.name ?? "white"}`}
        />

        <figcaption className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
          <span className="rounded-full bg-white/85 px-3 py-1.5 text-xs shadow-sm ring-1 ring-charcoal/[0.06] backdrop-blur">
            <span className="font-medium text-charcoal">{productName}</span>
            <span className="hidden text-charcoal/50 sm:inline">
              {" "}
              · {activeFinish?.name ?? "Brilliant White"} · {GLAZING[glazing].label}
            </span>
          </span>
          <span className="hidden rounded-full bg-navy/85 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-surface backdrop-blur sm:inline">
            Live 3D
          </span>
        </figcaption>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end gap-3 p-3 sm:justify-between sm:p-4">
          <p className="hidden text-[0.6875rem] text-charcoal/45 sm:block">Drag to rotate</p>
          {animated && (
            <PreviewMotionControl value={motion} onChange={setMotion} reducedMotion={reducedMotion} />
          )}
        </div>
      </figure>

      <div className="space-y-6">
        <div>
          <p className="eyebrow mb-2">Configure</p>
          <h2 className="font-display text-h3 text-charcoal">
            Make it yours
          </h2>
          <p className="text-caption text-charcoal/60 mt-2">
            Every change renders live on the actual{" "}
            {OPENING_TYPE_LABELS[openingType].toLowerCase()} geometry.
          </p>
        </div>

        <fieldset className={FIELDSET}>
          <legend className={LEGEND}>
            Frame finish — {activeFinish?.name ?? "Brilliant White"}
          </legend>
          <div className="flex flex-wrap gap-3">
            {finishes.map((color) => (
              <button
                key={color.slug}
                type="button"
                onClick={() => setFinish(color.slug)}
                aria-label={color.name}
                aria-pressed={finish === color.slug}
                title={color.name}
                className={`${SWATCH_BASE} ${
                  finish === color.slug
                    ? "scale-110 ring-2 ring-gold ring-offset-2 ring-offset-surface"
                    : "ring-1 ring-charcoal/15 hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className={FIELDSET}>
          <legend className={LEGEND}>Hardware</legend>
          <div className="flex flex-wrap gap-2">
            {HARDWARE_ORDER.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setHardware(slug)}
                aria-pressed={hardware === slug}
                className={`${CHIP_BASE} ${
                  hardware === slug
                    ? "bg-charcoal text-surface"
                    : "bg-charcoal/6 text-charcoal/70 hover:bg-charcoal/12"
                }`}
              >
                {HARDWARE[slug].label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={FIELDSET}>
          <legend className={LEGEND}>Glazing</legend>
          <div className="flex flex-wrap gap-2">
            {GLAZING_ORDER.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setGlazing(slug)}
                aria-pressed={glazing === slug}
                className={`${CHIP_BASE} ${
                  glazing === slug
                    ? "bg-charcoal text-surface"
                    : "bg-charcoal/6 text-charcoal/70 hover:bg-charcoal/12"
                }`}
              >
                {GLAZING[slug].label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-charcoal/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={quoteHref(category, openingType)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-surface shadow-[0_1px_2px_rgba(14,42,62,0.12)] transition-[background-color,box-shadow,transform] duration-300 ease-[var(--ease-premium)] hover:bg-charcoal hover:shadow-[0_8px_20px_-8px_rgba(14,42,62,0.45)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Get a quote for this {category === "doors" ? "door" : category === "panels" ? "panel" : "window"}
            <span aria-hidden>→</span>
          </Link>
          <p className="text-caption text-charcoal/50">Free site measurement · No obligation</p>
        </div>
      </div>
    </div>
  );
}
