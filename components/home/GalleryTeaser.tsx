"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { getProjectCover, masonryAspectClass } from "@/lib/gallery";
import { IMAGES } from "@/lib/images";
import { PremiumText } from "@/components/ui/PremiumText";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface GalleryTeaserProps {
  projects: Project[];
  /** Inside ProofChapter — lighter intro, no section padding */
  embedded?: boolean;
}

export function GalleryTeaser({
  projects,
  embedded = false,
}: GalleryTeaserProps) {
  const teaser = projects
    .filter((p) => p.collection === "installations")
    .slice(0, 3);
  const fallback = teaser.length > 0 ? teaser : projects.slice(0, 3);

  const grid = (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:items-start lg:@container">
      {fallback.map((project, i) => {
        const cover = getProjectCover(project);
        const image = cover.src || IMAGES.gallery[i] || IMAGES.gallery[0];
        const wide = i === fallback.length - 1 && fallback.length === 3;
        const aspect = wide
          ? "aspect-[4/3] lg:aspect-auto lg:h-[calc((100cqw-4.5rem)/3)]"
          : masonryAspectClass(cover.orientation ?? "portrait");

        return (
          <RevealOnScroll
            key={project.slug}
            delay={i * 0.08}
            className={wide ? "sm:col-span-2" : undefined}
          >
            <Link href="/gallery" className="group block focus-visible:outline-none">
              <div
                className={`relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(27,27,29,0.04),0_16px_40px_-20px_rgba(27,27,29,0.18)] ring-1 ring-charcoal/[0.06] transition-[box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_1px_2px_rgba(27,27,29,0.04),0_28px_56px_-24px_rgba(27,27,29,0.22)] group-focus-visible:ring-2 group-focus-visible:ring-gold group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-surface-muted motion-reduce:transition-none sm:rounded-3xl ${aspect}`}
              >
                <Image
                  src={image}
                  alt={cover.alt || project.title}
                  fill
                  // First tile often becomes LCP once the hero canvas takes over —
                  // priority sets loading=eager so Next doesn't warn.
                  priority={i === 0}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>
              <h3 className="mt-4 font-display text-lg tracking-tight text-navy transition-colors duration-300 group-hover:text-gold">
                {project.title}
              </h3>
            </Link>
          </RevealOnScroll>
        );
      })}
    </div>
  );

  if (embedded) {
    return (
      <div className="container-content" aria-label="Completed projects">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="font-display text-[clamp(1.35rem,2.5vw,1.75rem)] tracking-tight text-charcoal">
            Completed projects
          </h3>
          <Link
            href="/gallery"
            className="group/link shrink-0 text-sm font-medium text-gold transition-colors duration-300 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-surface-muted"
          >
            View all projects
            <span
              className="ml-1.5 inline-block transition-transform duration-300 ease-[var(--ease-premium)] group-hover/link:translate-x-1"
              aria-hidden
            >
              ›
            </span>
          </Link>
        </div>
        {grid}
      </div>
    );
  }

  return (
    <section className="section-padding" aria-label="Completed projects">
      <div className="container-content">
        <RevealOnScroll className="mb-12 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between lg:mb-16">
          <div className="max-w-xl">
            <p className="eyebrow mb-4 text-gold">Gallery</p>
            <PremiumText
              as="h2"
              mode="words"
              className="font-display text-h2 text-balance text-navy"
            >
              Completed projects
            </PremiumText>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-charcoal/70 sm:text-lg">
              Full-height windows, sliding doors onto a terrace, and a rooftop
              canopy — recent homes, fitted and finished.
            </p>
          </div>
          <Link
            href="/gallery"
            className="group/link shrink-0 self-start text-sm font-medium text-gold transition-colors duration-300 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:self-end"
          >
            View all projects
            <span
              className="ml-1.5 inline-block transition-transform duration-300 ease-[var(--ease-premium)] group-hover/link:translate-x-1 motion-reduce:transition-none"
              aria-hidden
            >
              ›
            </span>
          </Link>
        </RevealOnScroll>
        {grid}
      </div>
    </section>
  );
}
