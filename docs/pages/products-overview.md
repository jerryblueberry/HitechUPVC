# Products Overview Page
Status: planned
Owner: agent
Last reviewed: —

## Purpose
Filterable product grid across windows, doors, and panels. Helps users browse by category, opening type, and color.

## Route
`app/(marketing)/products/page.tsx`

## Components
- [ProductGrid.md](../components/products/ProductGrid.md)
- [ProductCard.md](../components/products/ProductCard.md)

## Data Sources
- `products.json` — aggregated index for filters
- `colors.json` — filter by finish

## Design Decisions
- Filter bar sticky on scroll (desktop)
- Layout transitions on filter change (`layoutId`)
- ProductCard: image zoom hover, opening-type badge

## Review Checklist
- [ ] Filters animate with layout transitions
- [ ] Uses getProducts() from getData
- [ ] Responsive grid: 1 col mobile, 2 tablet, 3–4 desktop
