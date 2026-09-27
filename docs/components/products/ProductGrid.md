# ProductGrid
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Filterable grid of ProductCards: category, opening type, and finish. State lives in the URL (`?category=&type=&color=`).

## Props / Data
- `products: ProductIndexEntry[]` from `getProducts()`
- `colors: ColorSwatch[]` from `getColors()`
- `lockedCategory?: ProductCategory` — hides category chips (used on listing pages)

## Animation Spec
Framer `layout` + fade on filter change; skipped when reduced motion.

## Implementation Notes
- File: `components/products/ProductGrid.tsx`
- Client component (`useSearchParams`) — wrap in `<Suspense>`
- Sticky chip bar under the header (`top-16` / `md:top-20`)

## Review Checklist
- [x] Filter state accessible (`aria-pressed`, `aria-live` count)
- [x] Layout animations on reflow
