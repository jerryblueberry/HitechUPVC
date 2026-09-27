# MegaMenu
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Products menu: Windows, Doors, Panels, plus a featured promo.

## Design Decisions
- **Dropdown** (`variant="dropdown"`): full-width panel under the header on `lg+`
- **Inline** (`variant="inline"`): accordion inside MobileNav so phones get the same categories
- Products has a chevron on desktop (toggle) and mobile (expand)
- Featured card stacks under the three columns on small screens

## Props / Data
- `navigation.json` products section
- `variant?: "dropdown" | "inline"`

## Responsive Behavior
- Desktop: hover / chevron opens the header panel
- Mobile: chevron on Products opens the stacked mega list

## Implementation Notes
- File: `components/layout/MegaMenu.tsx`
- Client component

## Review Checklist
- [x] Chevron on Products, large and small
- [x] Mobile can open the same product groups
- [x] Columns do not crush on small widths
