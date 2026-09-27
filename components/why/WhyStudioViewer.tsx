"use client";

import { LazyUpvcPanelViewer } from "@/components/three/LazyUpvcPanelViewer";
import { LazyUpvcViewer } from "@/components/three/LazyUpvcViewer";
import { useCanHover, usePrefersReducedMotion } from "@/components/three/hooks";
import type { OpeningType, ProductCategory } from "@/lib/types";

interface WhyStudioViewerProps {
  openingType?: OpeningType;
  category?: ProductCategory;
  posterAlt: string;
  caption?: string;
  className?: string;
}

/** Same live 3D studio used on the Why hero, products, and home tiles. */
export function WhyStudioViewer({
  openingType = "casement",
  category = "windows",
  posterAlt,
  caption,
  className = "",
}: WhyStudioViewerProps) {
  const canHover = useCanHover();
  const reducedMotion = usePrefersReducedMotion();
  const live = !reducedMotion;

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] bg-white shadow-[0_1px_2px_rgba(27,27,29,0.04),0_24px_48px_-20px_rgba(27,27,29,0.18)] ring-1 ring-charcoal/[0.05] ${className}`}
    >
      <div className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
        {category === "panels" ? (
          <LazyUpvcPanelViewer
            autoPlay={live && !canHover}
            className="h-full w-full"
          />
        ) : (
          <LazyUpvcViewer
            openingType={openingType}
            category={category}
            finishSlug="white"
            autoPlay={live && !canHover}
            followPointer={live && canHover}
            className="h-full w-full"
            posterAlt={posterAlt}
          />
        )}
      </div>
      {caption ? (
        <p className="absolute bottom-5 left-5 right-5 text-xs font-medium tracking-wide text-charcoal/45">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
