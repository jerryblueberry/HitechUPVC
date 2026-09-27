"use client";

/**
 * Real-time 3D configurator. Finish, hardware, glazing and the opening itself
 * all update the same parametric model — there are no pre-rendered variants.
 */

import { useState } from "react";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import { OPENING_TYPE_LABELS } from "@/lib/constants";
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
  const [open, setOpen] = useState(0);

  const activeFinish = finishes.find((color) => color.slug === finish);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12 items-start">
      <div
        className="rounded-2xl overflow-hidden border border-charcoal/8"
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
          open={open}
          interactive
          className="aspect-[4/3] lg:aspect-[5/4]"
          posterAlt={`${productName} in ${activeFinish?.name ?? "white"}`}
        />
      </div>

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

        <fieldset className={FIELDSET}>
          <legend className={LEGEND}>Opening</legend>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setOpen(open > 0.5 ? 0 : 1)}
              className="px-5 py-2.5 rounded-full bg-gold text-charcoal text-caption font-medium transition-colors duration-200 hover:bg-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {open > 0.5 ? "Close" : "Open"}
            </button>
            <label className="flex-1">
              <span className="sr-only">Opening amount</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(open * 100)}
                onChange={(event) => setOpen(Number(event.target.value) / 100)}
                className="w-full accent-[var(--color-gold)]"
              />
            </label>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
