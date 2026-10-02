# GalleryView
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Gallery shell: hero + layout toggle + image grid/masonry + lightbox.

## Design Decisions
- Hero is a two-column row from `lg`: copy left (shared left edge, `max-w-[36rem]`
  body measure), layout toggle top-right in the open space
- On phone the toggle sits under the copy
- Grid ↔ masonry with `AnimatePresence` fade (skipped under reduced motion)
- Cards are image-only; story opens in the lightbox
- No collection filters

## Props
- `projects: Project[]`

## Review Checklist
- [x] Toggle utilises hero right space on desktop
- [x] Smooth layout transition
- [x] Lightbox opens from card
