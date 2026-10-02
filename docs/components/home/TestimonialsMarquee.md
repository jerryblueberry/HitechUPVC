# TestimonialsMarquee
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Home social proof: three Kathmandu valley client quotes, readable on every width.

## Design Decisions
- Not a marquee — moving quotes cannot be read. Filename kept for the existing import.
- Header matches USP / showcase: gold eyebrow, charcoal display heading capped at `max-w-2xl` (never full 90rem measure)
- Cards use the same studio chrome as USP: white, ~2rem radius, hairline ring, layered offset shadow
- **Phone (< md):** snap-x carousel, ~85vw card, peek of the next; `scroll-px-6` lands each card on the container margin, level with the heading; reduced motion stacks
- **md and up:** three equal columns with `items-stretch` and `h-full`, so tops, names and bottoms share one line. An earlier bento (featured across two rows) left beige showing under the short card
- Quotes are kept to a similar length so the stretch leaves no gap above a name; the footer is pushed down with `mt-auto` rather than the quote being pushed up
- Each footer carries a gold pin and the neighbourhood (`location`), attached to the name
- Stars are drawn SVG, not ★ glyphs
- Copy from `testimonials.json`; short supporting line under the heading
- `scroll-mt` on the heading so hash links clear the sticky header

## Props / Data
- `testimonials.json` via `getTestimonials()`

## Implementation Notes
- File: `components/home/TestimonialsMarquee.tsx` (server)

## Review Checklist
- [x] Uses getData() (page passes testimonials; component does not import JSON)
- [x] Quotes readable on 390px, 768px, 1280px
- [x] Phone snap row aligned to the page margin; three equal cards from `md` up
- [x] Reduced motion: static stack, no horizontal trap
- [x] Matches DESIGN-SYSTEM tokens (surface, charcoal, navy, gold)
- [x] Heading measure is not full container width
