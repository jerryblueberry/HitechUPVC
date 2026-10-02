"use client";

import Image from "next/image";
import type { Project } from "@/lib/types";
import { getProjectCover, masonryAspectClass } from "@/lib/gallery";

interface GalleryCardProps {
  project: Project;
  layout: "grid" | "masonry";
  onOpen: (project: Project) => void;
  priority?: boolean;
}

export function GalleryCard({
  project,
  layout,
  onOpen,
  priority = false,
}: GalleryCardProps) {
  const cover = getProjectCover(project);
  const aspect =
    layout === "masonry"
      ? masonryAspectClass(cover.orientation)
      : "aspect-[4/3]";

  return (
    <article
      className={
        layout === "masonry" ? "mb-4 break-inside-avoid sm:mb-5" : "h-full"
      }
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`${project.title} — ${project.location}`}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-surface-muted shadow-[0_1px_2px_rgba(27,27,29,0.04),0_16px_40px_-20px_rgba(27,27,29,0.18)] ring-1 ring-charcoal/[0.06] transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(27,27,29,0.04),0_28px_56px_-24px_rgba(27,27,29,0.22)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:rounded-3xl"
      >
        <div className={`relative w-full overflow-hidden ${aspect}`}>
          {cover.src ? (
            <Image
              src={cover.src}
              alt={cover.alt || project.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : null}
        </div>
      </button>
    </article>
  );
}
