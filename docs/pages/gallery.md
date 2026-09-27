# Gallery Page
Status: planned
Owner: agent
Last reviewed: —

## Purpose
Showcase completed projects with masonry grid, lightbox, and filters by product type and location.

## Route
`app/(marketing)/gallery/page.tsx`

## Data Sources
- `projects.json`

## Design Decisions
- Masonry grid with filter chips
- Lightbox on click
- Each project links to mini case study (modal or sub-route later)

## Review Checklist
- [ ] Images use next/image with sizes
- [ ] Filter animates grid reflow
- [ ] Alt text from project data
