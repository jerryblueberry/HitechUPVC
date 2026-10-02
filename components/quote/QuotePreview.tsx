"use client";

import { ApproachedMount } from "@/components/three/ApproachedMount";
import { LazyUpvcPanelViewer } from "@/components/three/LazyUpvcPanelViewer";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import { PreviewMotionControl, usePreviewMotion } from "@/components/three/PreviewMotionControl";
import type { OpeningType, ProductCategory } from "@/lib/types";
import type { GlazingSlug } from "@/lib/upvc3d";

interface QuotePreviewProps {
  category: ProductCategory;
  /** Undefined for panels */
  openingType?: OpeningType;
  finishSlug: string;
  glazingSlug: GlazingSlug;
  title: string;
  detail: string;
}

export function QuotePreview({
  category,
  openingType,
  finishSlug,
  glazingSlug,
  title,
  detail,
}: QuotePreviewProps) {
  const { motion, setMotion, reducedMotion } = usePreviewMotion();
  const animated = category !== "panels" && openingType && openingType !== "fixed";

  return (
    <figure
      className="relative overflow-hidden rounded-2xl ring-1 ring-charcoal/[0.06]"
      style={{
        background: "radial-gradient(110% 85% at 50% 35%, #ffffff 0%, #f4f1eb 55%, #e3ded4 100%)",
      }}
    >
      <ApproachedMount className="aspect-square min-[420px]:aspect-[4/3] sm:aspect-[16/9]">
        {category === "panels" || !openingType ? (
          <LazyUpvcPanelViewer autoPlay={!reducedMotion} className="h-full w-full" />
        ) : (
          <LazyUpvcViewer
            key={`${category}-${openingType}`}
            openingType={openingType}
            category={category}
            finishSlug={finishSlug}
            glazingSlug={glazingSlug}
            autoPlay={animated ? motion === "demo" : false}
            open={motion === "open" ? 1 : 0}
            interactive
            quality="balanced"
            className="h-full w-full"
            posterAlt={title}
          />
        )}
      </ApproachedMount>

      <figcaption className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
        <span className="rounded-full bg-white/85 px-3 py-1.5 text-xs shadow-sm ring-1 ring-charcoal/[0.06] backdrop-blur">
          <span className="font-medium text-charcoal">{title}</span>
          <span className="hidden text-charcoal/50 sm:inline"> · {detail}</span>
        </span>
        <span className="hidden rounded-full bg-navy/85 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-surface backdrop-blur sm:inline">
          Live 3D
        </span>
      </figcaption>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end gap-3 p-3 sm:justify-between sm:p-4">
        <p className="hidden text-[0.6875rem] text-charcoal/45 sm:block">
          {category === "panels" ? "Fluted woodgrain finish" : "Drag to rotate"}
        </p>
        {animated && (
          <PreviewMotionControl value={motion} onChange={setMotion} reducedMotion={reducedMotion} />
        )}
      </div>
    </figure>
  );
}
