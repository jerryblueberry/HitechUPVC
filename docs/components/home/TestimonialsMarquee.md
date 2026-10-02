# TestimonialsMarquee
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Home social proof: three client quotes, readable on every width.

## Design Decisions
- Not a marquee — moving quotes cannot be read. Filename kept for the existing import.
- Header matches USP / showcase: gold eyebrow, charcoal display heading capped at `max-w-2xl` (never full 90rem measure)
- Cards use the same studio chrome as USP: white, ~2rem radius, hairline ring, layered offset shadow
- **Phone (< md):** snap-x carousel, ~85vw card, peek of the next; reduced motion stacks
- **Tablet (md–lg):** 2-col grid — featured spans full width on top, two supporting side by side
- **Desktop (lg+):** bento — featured spans two rows (7 cols), supporting stack beside (5 cols); featured uses display type from `md`
- No fixed `min-height` — cards size to quote + footer so short quotes stay tight
- Stars are drawn SVG, not ★ glyphs
- Copy from `testimonials.json` unchanged; short supporting line under the heading
- `scroll-mt` on the heading so hash links clear the sticky header

## Props / Data
- `testimonials.json` via `getTestimonials()`

## Implementation Notes
- File: `components/home/TestimonialsMarquee.tsx` (server)

## Review Checklist
- [x] Uses getData() (page passes testimonials; component does not import JSON)
- [x] Quotes readable on 390px, 768px, 1280px
- [x] Phone snap / tablet grid / desktop bento
- [x] Reduced motion: static stack, no horizontal trap
- [x] Matches DESIGN-SYSTEM tokens (surface, charcoal, navy, gold)
- [x] Heading measure is not full container width
