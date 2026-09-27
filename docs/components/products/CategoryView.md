# CategoryView
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Compose a category listing: breadcrumb, hero + 3D, locked ProductGrid, sibling families, quote CTA.

## Props / Data
- `category`, `company`, `products`, `colors` from `lib/getData.ts`
- Headlines from `lib/categoryPages.ts`

## Implementation Notes
- File: `components/products/CategoryView.tsx`
- Server component; grid is the only client island
- Windows → casement 3D; doors → French 3D; panels → fluted slat wall

## Review Checklist
- [x] First band uses `page-top`
- [x] Sibling links use `CATEGORY_PATHS`
