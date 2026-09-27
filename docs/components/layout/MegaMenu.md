# MegaMenu
Status: done
Owner: agent
Last reviewed: —

## Purpose
Products dropdown with columns for Windows, Doors, Panels, and featured promo image.

## Design Decisions
- Grid: 4 columns on desktop
- Slide/fade down on open (`AnimatePresence`)
- Featured promo in column 4

## Props / Data
- `navigation.json` products section
- Opening type sub-links per category

## Animation Spec
`initial={{ opacity: 0, y: -10 }}` → animate in; see ANIMATION-SPEC.md

## Responsive Behavior
- Desktop only — mobile uses MobileNav

## Implementation Notes
- File: `components/layout/MegaMenu.tsx`
- Client component

## Review Checklist
- [ ] Matches DESIGN-SYSTEM tokens
- [ ] Uses getData() not inline JSON
- [ ] Animations respect prefers-reduced-motion
