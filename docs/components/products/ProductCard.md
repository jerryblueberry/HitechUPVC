# ProductCard
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Studio card for the products grid: media, opening/category eyebrow, name, short description, finish dots.

## Props / Data
- `product: ProductIndexEntry`
- `colors: ColorSwatch[]`

## Animation Spec
Hover lift + media scale 1.04; parent grid handles layout reflow.

## Implementation Notes
- File: `components/products/ProductCard.tsx`
- Media from `productCardImage()` (PNG cutouts). Panels use a CSS fluted poster — `heroImage` JPGs are not in `/public`.
- Links to `/products/{category}/{slug}` (detail routes exist).

## Review Checklist
- [x] Uses ProductIndexEntry from getData
- [x] next/image with sizes on window/door cards
