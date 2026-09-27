# Products Overview Page
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Browse Hi-Tech uPVC windows, doors, and panels. Filter by category, opening type, and finish. Uses existing 3D/PNG assets — product `heroImage` JPGs are not in `/public` yet.

## Route
`app/(marketing)/products/page.tsx`

## Components
- `components/products/ProductsView.tsx`
- [ProductGrid.md](../components/products/ProductGrid.md)
- [ProductCard.md](../components/products/ProductCard.md)

## Data Sources
- `getProducts()`, `getColors()`, `getCompany()`
- PNG / 3D via `lib/upvcAssets.ts`, `lib/productMedia.ts`, and `WhyStudioViewer`

## Design Decisions
- First band: `page-top`, company hero copy + live casement 3D
- Three family jumps go to `/products/windows`, `/products/doors`, `/products/panels`
- Sticky filter chips; grid 1 / 2 / 3 columns
- Window/door cards use opening-type PNGs; panel cards use a fluted-slat poster (no hero JPGs)
- Quote CTAs go to `/contact` until the Get Quote form ships

## Review Checklist
- [x] Uses getProducts() from getData
- [x] Responsive grid
- [x] Filters without 404 category routes
- [x] `/products` in sitemap + CollectionPage JSON-LD
