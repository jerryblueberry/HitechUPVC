"use client";

import type { CompanyStats, Project, Testimonial } from "@/lib/types";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { StatsCounter } from "@/components/home/StatsCounter";
import { TestimonialsMarquee } from "@/components/home/TestimonialsMarquee";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface ProofChapterProps {
  testimonials: Testimonial[];
  stats: CompanyStats;
  projects: Project[];
}

/**
 * One proof chapter: people, figures, photos — single heading, one muted band.
 */
export function ProofChapter({
  testimonials,
  stats,
  projects,
}: ProofChapterProps) {
  return (
    <section
      className="section-padding overflow-hidden bg-surface-muted"
      aria-labelledby="proof-heading"
    >
      <div className="container-content">
        <RevealOnScroll className="mb-10 max-w-2xl sm:mb-12 lg:mb-14">
          <p className="eyebrow mb-4 text-gold">Proof</p>
          <h2
            id="proof-heading"
            className="scroll-mt-24 font-display text-[clamp(1.85rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-balance text-charcoal lg:scroll-mt-28"
          >
            Trusted across the Kathmandu valley
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-charcoal/70 sm:mt-4 sm:text-lg">
            Homeowners and architects, in their own words — then the numbers and
            the finished homes.
          </p>
        </RevealOnScroll>
      </div>

      <TestimonialsMarquee testimonials={testimonials} embedded />
      <StatsCounter stats={stats} embedded />
      <GalleryTeaser projects={projects} embedded />
    </section>
  );
}
