"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { IMAGES } from "@/lib/images";
import { PremiumText } from "@/components/ui/PremiumText";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface GalleryTeaserProps {
  projects: Project[];
}

export function GalleryTeaser({ projects }: GalleryTeaserProps) {
  const teaser = projects.slice(0, 3);

  return (
    <section className="section-padding">
      <div className="container-content">
        <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p className="eyebrow mb-4">Gallery</p>
            <PremiumText as="h2" mode="words" className="font-display text-h2 text-navy">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teaser.map((project, i) => {
            const image =
              project.images[0] ?? IMAGES.gallery[i] ?? IMAGES.gallery[0];

            return (
              <RevealOnScroll key={project.slug} delay={i * 0.12}>
                <Link href="/gallery" className="group block">
                  <motion.div
                    className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
                  </motion.div>
                  <h3 className="font-display text-lg text-navy group-hover:text-gold transition-colors duration-300">
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
