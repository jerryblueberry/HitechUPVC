"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

type LayoutMode = "grid" | "masonry";

interface GalleryViewProps {
  projects: Project[];
}

const ease = [0.22, 1, 0.36, 1] as const;

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      aria-hidden
      className={active ? "text-charcoal" : "text-charcoal/40"}
      fill="currentColor"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function MasonryIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      aria-hidden
      className={active ? "text-charcoal" : "text-charcoal/40"}
      fill="currentColor"
    >
      <rect x="3" y="3" width="7" height="11" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="17" width="7" height="4" rx="1.5" />
      <rect x="14" y="13" width="7" height="8" rx="1.5" />
    </svg>
  );
}

function LayoutToggle({
  layout,
  onChange,
}: {
  layout: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-full bg-surface-muted p-1"
      role="group"
      aria-label="Gallery layout"
    >
      <button
        type="button"
        aria-pressed={layout === "grid"}
        aria-label="Uniform grid"
        onClick={() => onChange("grid")}
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:h-10 sm:w-10 ${
          layout === "grid" ? "bg-surface shadow-sm" : "hover:bg-surface/70"
        }`}
      >
        <GridIcon active={layout === "grid"} />
      </button>
      <button
        type="button"
        aria-pressed={layout === "masonry"}
        aria-label="Masonry layout"
        onClick={() => onChange("masonry")}
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:h-10 sm:w-10 ${
          layout === "masonry" ? "bg-surface shadow-sm" : "hover:bg-surface/70"
        }`}
      >
        <MasonryIcon active={layout === "masonry"} />
      </button>
    </div>
  );
}

export function GalleryView({ projects }: GalleryViewProps) {
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const [active, setActive] = useState<Project | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <header className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <div className="w-full max-w-2xl min-w-0">
          <p className="eyebrow mb-3 text-gold sm:mb-4">Gallery</p>
          <h1 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-tight text-balance text-charcoal">
            Proof, in place.
          </h1>
          <p className="mt-4 max-w-[36rem] text-pretty text-[0.9375rem] leading-relaxed text-charcoal/60 sm:mt-5 sm:text-base lg:text-lg lg:leading-[1.65]">
            From fitted homes across the valley to the Tarakeshwar factory floor
            and studio product shots — every frame shows how Hi-Tech uPVC looks
            when it is made, installed, and lived with.
          </p>
        </div>

        <div className="flex shrink-0 items-center lg:pt-1">
          <LayoutToggle layout={layout} onChange={setLayout} />
        </div>
      </header>

      <div className="mt-10 sm:mt-12 lg:mt-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={layout}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
          >
            {layout === "grid" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {projects.map((project, i) => (
                  <GalleryCard
                    key={project.slug}
                    project={project}
                    layout="grid"
                    onOpen={setActive}
                    priority={i < 3}
                  />
                ))}
              </div>
            ) : (
              <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 lg:gap-6">
                {projects.map((project, i) => (
                  <GalleryCard
                    key={project.slug}
                    project={project}
                    layout="masonry"
                    onOpen={setActive}
                    priority={i < 3}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {active ? (
        <GalleryLightbox project={active} onClose={() => setActive(null)} />
      ) : null}
    </>
  );
}
