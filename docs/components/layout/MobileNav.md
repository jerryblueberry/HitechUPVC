# MobileNav
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Right-hand drawer for phones — full height, not full width.

## Design Decisions
- `w-[min(20.5rem,86vw)]`, `inset-y-0 right-0`, page `bg-surface`
- Dim overlay on the rest of the page
- Drawer header: company lockup + slogan on the left, close on the right
- Products chevron expands the mega list inside the drawer
- WhatsApp + Get a Quote at the bottom

## Implementation Notes
- File: `components/layout/MobileNav.tsx`

## Review Checklist
- [x] Not full-bleed width
- [x] Full height drawer
- [x] Products accordion still works
