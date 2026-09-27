# Product Category Listing
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Dedicated `/products/windows`, `/products/doors`, and `/products/panels` listings. Same studio language as the products overview, scoped to one family.

## Routes
- `app/(marketing)/products/windows/page.tsx`
- `app/(marketing)/products/doors/page.tsx`
- `app/(marketing)/products/panels/page.tsx`

## Components
- `components/products/CategoryListing.tsx`
- `components/products/CategoryView.tsx`
- [ProductGrid.md](../components/products/ProductGrid.md)
- [ProductCard.md](../components/products/ProductCard.md)

## Data Sources
- `getProducts()`, `getColors()`, `getCompany()`
- Copy + metadata: `lib/categoryPages.ts`
- 3D: `WhyStudioViewer` (casement / French / fluted panel)

## Design Decisions
- First band: `page-top`, category headline + matching live 3D
- Breadcrumb Products → category; sibling family links
- Grid locks category (opening + finish chips only)
- Family jumps on `/products` now use these routes
- Listing pages are `force-static` so `/products/doors` cannot fall through to `doors/[slug]` and 404
- Marketing `not-found.tsx` covers unknown product URLs

React DevTools `Bridge that has been shut down` is the Chrome extension during Fast Refresh — not an app error.

## Review Checklist
- [x] Three routes render (no 404)
- [x] Uses getData, not JSON imports
- [x] Category-specific 3D
- [x] Sitemap + CollectionPage JSON-LD
