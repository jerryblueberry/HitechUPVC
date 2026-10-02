"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import {
  COLLECTION_LABEL,
  getProjectCover,
  resolveGalleryImage,
} from "@/lib/gallery";

interface GalleryLightboxProps {
  project: Project;
  onClose: () => void;
}

export function GalleryLightbox({ project, onClose }: GalleryLightboxProps) {
  const gallery = useMemo(() => {
    const images = project.images.map((img) =>
      resolveGalleryImage(img, project.title)
    );
    if (images.length === 0) {
      const cover = getProjectCover(project);
      return cover.src ? [cover] : [];
    }
    return images;
  }, [project]);

  const [index, setIndex] = useState(0);
  const active = gallery[Math.min(index, Math.max(gallery.length - 1, 0))];

  const select = useCallback(
    (next: number) => {
      if (gallery.length === 0) return;
      const wrapped = (next + gallery.length) % gallery.length;
      setIndex(wrapped);
    },
    [gallery.length]
  );

  useEffect(() => {
    setIndex(0);
  }, [project.slug]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") select(index - 1);
      if (event.key === "ArrowRight") select(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, select, index]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal
      aria-labelledby="gallery-lightbox-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[min(92svh,52rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_24px_80px_-24px_rgba(27,27,29,0.55)] sm:rounded-[2rem]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Image stays in view; height capped so copy + thumbs remain visible */}
        <div className="relative h-[min(42svh,18rem)] w-full shrink-0 bg-charcoal/[0.04] sm:h-[min(52svh,26rem)]">
          {active?.src ? (
            <Image
              key={active.src}
              src={active.src}
              alt={active.alt || project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 64rem"
              priority
            />
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-charcoal/45 text-surface backdrop-blur-md transition-colors hover:bg-charcoal/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:top-3 sm:right-3 sm:h-9 sm:w-9"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              aria-hidden
              fill="none"
              className="sm:h-[15px] sm:w-[15px]"
            >
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {gallery.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => select(index - 1)}
                className="absolute top-1/2 left-2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-charcoal shadow-sm backdrop-blur-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:left-3 sm:h-10 sm:w-10"
                aria-label="Previous image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none">
                  <path
                    d="M15 6 9 12l6 6"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => select(index + 1)}
                className="absolute top-1/2 right-2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-charcoal shadow-sm backdrop-blur-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-3 sm:h-10 sm:w-10"
                aria-label="Next image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none">
                  <path
                    d="m9 6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {gallery.length > 1 ? (
            <div className="shrink-0 border-b border-charcoal/[0.06] px-4 py-3 sm:px-6 sm:py-4">
              <ul className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] sm:gap-2.5 [&::-webkit-scrollbar]:hidden">
                {gallery.map((image, i) => {
                  const selected = i === index;
                  return (
                    <li key={`${image.src}-${i}`} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show image ${i + 1}`}
                        aria-current={selected ? "true" : undefined}
                        className={`relative block h-14 w-[4.5rem] cursor-pointer overflow-hidden rounded-lg transition ring-2 sm:h-16 sm:w-24 ${
                          selected
                            ? "ring-gold"
                            : "ring-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt || `${project.title} ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-xs tabular-nums text-charcoal/40">
                {index + 1} / {gallery.length}
              </p>
            </div>
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7">
            <p className="eyebrow mb-2 text-gold">
              {COLLECTION_LABEL[project.collection]}
            </p>
            <h2
              id="gallery-lightbox-title"
              className="font-display text-[clamp(1.35rem,3vw,2rem)] leading-tight tracking-tight text-charcoal"
            >
              {project.title}
            </h2>
            <p className="mt-1 text-sm text-charcoal/50">{project.location}</p>
            <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-charcoal/65 sm:text-base">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
