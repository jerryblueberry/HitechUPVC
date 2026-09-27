# ProductsView
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Compose the `/products` overview: hero + family jumps + catalogue + quote CTA.

## Props / Data
- `company`, `products`, `colors` from `lib/getData.ts` (never import JSON here)

## Implementation Notes
- File: `components/products/ProductsView.tsx`
- Server component; grid is the only client island
- Reuses `WhyStudioViewer` and `CTASection`

## Review Checklist
- [x] First band uses `page-top`
- [x] Family jumps do not hit 404 category listings
