# Gallery Page
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Apple-style project gallery: installations, factory floor, and product
photography — filterable, switchable between uniform grid and masonry, ready for
Cloudinary URLs in `projects.json`.

## Route
`app/(marketing)/gallery/page.tsx`

## Composition
1. Hero row — copy left (`max-w-2xl`), grid ↔ masonry toggle on the right (utilises open space)
2. Image-only premium grid / masonry with a short fade transition between layouts
3. Lightbox with selectable thumbs; CTA below

## Data Sources
- `projects.json` via `getProjects()`
- Shape supports string URLs **or** `{ src, alt, width, height, orientation, publicId }`
  for Cloudinary; helpers in `lib/gallery.ts`

## Design Decisions
- Matches home section language (surface, charcoal, gold, navy chips)
- Cards: image only (title / description live in the lightbox); soft ring + hover zoom
- Uniform `4/3` grid or masonry columns (portrait / landscape / square); toggle in the hero
- Smooth crossfade when switching layouts (`AnimatePresence`, reduced-motion safe)
- Lightbox: capped image height so thumbs + copy stay on screen; thumbs select
  the main image; arrow keys / prev-next; Escape / backdrop to close; body scroll locked
- Indexed for SEO (no longer `noindex`)

## Components
- `components/gallery/GalleryView.tsx` (client)
- `components/gallery/GalleryCard.tsx`
- `components/gallery/GalleryLightbox.tsx`

## Review Checklist
- [x] `/gallery` is a real gallery (not ComingSoon)
- [x] Images use `next/image` with sizes
- [x] Image-only grid; story opens in lightbox
- [x] No collection / layout filter chrome
- [x] Responsive phone → desktop
- [x] Cloudinary-ready image objects documented
- [x] `tsc` clean
