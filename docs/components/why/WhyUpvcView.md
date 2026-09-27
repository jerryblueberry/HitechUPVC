# WhyUpvcView
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Marketing + SEO compose for `/why-upvc` — hero, explainer, comparison, Kathmandu benefits, solutions, proof, FAQ, CTA.

## Design Decisions
- Reuses home 3D casement (`WhyHero`), `ProductCategoryShowcase`, `BeforeAfterSlider`, `GalleryTeaser`, `CTASection`
- Comparison cards + a semantic table for crawlers
- FAQ is native `<details>` via `FaqList`
- WhatsApp CTAs use `whatsappHref()` from company JSON

## Props / Data
- `company`, `faqs` (`why-upvc` category), `projects`, product `counts`

## Implementation Notes
- File: `components/why/WhyUpvcView.tsx`
- Shared 3D studio: `components/why/WhyStudioViewer.tsx` (hero + What is uPVC)

## Review Checklist
- [x] One h1
- [x] Reduced motion: hero 3D still
- [x] Tokens only (no dark mode)
