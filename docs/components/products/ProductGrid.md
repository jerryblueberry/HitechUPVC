# ProductGrid
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Filterable grid of ProductCards: category, opening type, and finish. State lives in the URL (`?category=&type=&color=`).

## Design Decisions
- Sticky filter bar matches hero product chips (charcoal active, soft `charcoal/5` idle)
- Finish chips show a 12px swatch; ring flips to surface when active so light colours stay readable
- Horizontal snap scroll on narrow screens; scrollbar hidden
- Gold focus ring; 300ms premium colour transition
- Sticky `top-16` / `lg:top-20` matches the header height exactly (no scroll gap)
- Opaque `bg-surface` so content never shows through under the header
- Sticky bar: one margin rule — `-mx-6 px-6` (full-bleed hairline), `lg:mx-0 lg:px-0` so chips share the same left edge as the product grid
- Chip rows do **not** add a second `-mx-6` (that was shifting the row 24px off the container)
- Count sits on the same row as finishes from `sm`, no extra horizontal padding

## Props / Data
- `products: ProductIndexEntry[]` from `getProducts()`
- `colors: ColorSwatch[]` from `getColors()`
- `lockedCategory?: ProductCategory` — hides category chips (used on listing pages)

## Animation Spec
Framer `layout` + fade on filter change; skipped when reduced motion.

## Implementation Notes
- File: `components/products/ProductGrid.tsx`
- Client component (`useSearchParams`) — wrap in `<Suspense>`

## Review Checklist
- [x] Filter state accessible (`aria-pressed`, `aria-live` count)
- [x] Layout animations on reflow
- [x] Chips match hero / opening-type pill language
