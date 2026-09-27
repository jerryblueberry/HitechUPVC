# Product Detail Page
Status: planned
Owner: agent
Last reviewed: —

## Purpose
Deep product page with gallery, opening animation, specs, color picker, and quote CTA.

## Routes
- `app/(marketing)/products/windows/[slug]/page.tsx`
- `app/(marketing)/products/doors/[slug]/page.tsx`
- `app/(marketing)/products/panels/[slug]/page.tsx`

## Components
- [OpeningTypeTabs.md](../components/products/OpeningTypeTabs.md)
- [SpecTable.md](../components/products/SpecTable.md)
- [ColorSwatchPicker.md](../components/products/ColorSwatchPicker.md)
- OpeningTypeDemo (animations/)

## Data Sources
- Category JSON by slug: `getProductBySlug(category, slug)`
- `colors.json`

## Design Decisions
- Sticky "Get a Quote" bar after hero scrolls past
- Hero gallery with thumbnail strip
- Opening type animation is key differentiator

## Review Checklist
- [ ] Dynamic metadata from product data
- [ ] Sticky CTA appears on scroll
- [ ] Color swatches update preview
