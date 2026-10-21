# Home Page

Status: in progress (redesign pass 2026-10-20)  
Owner: agent  
Last reviewed: 2026-10-20

## Purpose

Primary landing for Hi-Tech uPVC Profile Industries — product-led manufacturer
story with one cinematic beat, then calm proof and conversion.

## Sections (top to bottom)

1. Hero — company identity line + 3D carousel (poster-first; live 3D by tier)
2. ScrollDoorSequence — signature pinned story (+ Tarakeshwar caption beat)
3. USPStrip — ruled Why Hi-Tech specs
4. ProductCategoryShowcase — poster-first tiles; live 3D on high-tier hover
5. OpeningTypesExplainer — compact; live 3D on high-tier after tab select
6. ProcessTimeline — factory-aware steps (no eyebrow)
7. ProofChapter — testimonials + stats + gallery under one heading
8. CTASection — navy full-stop; measurement CTA + WhatsApp
9. Footer (layout)

**Removed from home:** BeforeAfterSlider (keep component for real Nepal pairs later).

Plan: [HOME-REDESIGN-PLAN.md](../HOME-REDESIGN-PLAN.md)  
Audit: [HOME-PAGE-REVIEW.md](../HOME-PAGE-REVIEW.md)

## Route

`app/(marketing)/page.tsx`

## Data Sources

- `company.json` — hero, usps, stats, process, contact
- `testimonials.json`, `projects.json`
- `windows.json` / `doors.json` / `panels.json` — category counts

## SEO / a11y notes

- Visible `h1` = `company.hero.headline` with trust line (Kathmandu / warranty)
- Slide titles remain `h2`
- Proof chapter uses one `h2`; gallery titles are `h3` when embedded
