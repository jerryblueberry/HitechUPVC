# Gallery Page
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Showcase completed projects with masonry grid, lightbox, and filters by product type and location.

## Route
`app/(marketing)/gallery/page.tsx`

## Current state
Coming-soon placeholder (`ComingSoon`) so `/gallery` does not 404. Full masonry + lightbox still backlog.

## Data Sources
- `projects.json` (for the finished page)

## Design Decisions
- Placeholder: `page-top`, gold eyebrow, studio card, products + contact CTAs
- Finished page: masonry grid, filter chips, lightbox

## Review Checklist
- [x] `/gallery` renders a clean coming-soon page
- [ ] Images use next/image with sizes
- [ ] Filter animates grid reflow
- [ ] Alt text from project data
