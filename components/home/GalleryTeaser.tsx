"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { getProjectCover } from "@/lib/gallery";
import { IMAGES } from "@/lib/images";
import { PremiumText } from "@/components/ui/PremiumText";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface GalleryTeaserProps {
  projects: Project[];
}

export function GalleryTeaser({ projects }: GalleryTeaserProps) {
  const teaser = projects
    .filter((p) => p.collection === "installations")
    .slice(0, 3);
  const fallback = teaser.length > 0 ? teaser : projects.slice(0, 3);

  return (
    <section className="section-padding">
      <div className="container-content">
        <RevealOnScroll className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-4 text-gold">Gallery</p>
            <PremiumText
              as="h2"
              mode="words"
              className="font-display text-h2 text-navy"
            >
              Completed projects
            </PremiumText>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-medium text-gold hover:underline"
          >
            View all projects →
          </Link>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {fallback.map((project, i) => {
            const cover = getProjectCover(project);
            const image =
              cover.src || IMAGES.gallery[i] || IMAGES.gallery[0];

            return (
              <RevealOnScroll key={project.slug} delay={i * 0.12}>
                <Link href="/gallery" className="group block">
                  <motion.div
                    className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={image}
                      alt={cover.alt || project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/20" />
                  </motion.div>
                  <h3 className="font-display text-lg text-navy transition-colors duration-300 group-hover:text-gold">
                    {project.title}
                  </h3>
                  <p className="text-sm text-charcoal/60">{project.location}</p>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
