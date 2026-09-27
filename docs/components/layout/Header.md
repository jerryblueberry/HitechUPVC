# Header
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Sticky site header with logo, primary nav, WhatsApp, and mega menu trigger.

## Design Decisions
- Transparent → `bg-surface/95 backdrop-blur` on scroll
- Navy text on light background
- Nav underline slides between items (`layoutId="nav-underline"`)
- WhatsApp sits before “Get a Quote” on desktop; on mobile it lives inside the hamburger sheet
- Products has a chevron on all sizes; desktop hover/chevron opens the mega panel, mobile chevron expands it inline
- Products mega menu is a full-width panel on the header (`inset-x-0`), not a dropdown clipped to the Products link

## Props / Data
- `navigation` via `getNavigation()`
- `companyName`, `logo`, `whatsapp` from `getCompany()`

## Animation Spec
Scroll-linked background via `useScroll`

## Responsive Behavior
- Desktop: horizontal nav + mega menu on hover + WhatsApp + quote CTA
- Mobile: hamburger only → full-screen surface sheet in [MobileNav.md](./MobileNav.md)

## Accessibility
- `<header>`, `<nav>`
- WhatsApp control is `aria-label`led and opens `wa.me` in a new tab

## Dependencies
- MegaMenu, MobileNav, WhatsAppLink
- `lib/getData.ts`

## Implementation Notes
- File: `components/layout/Header.tsx`
- Client component (scroll + menu state)

## Review Checklist
- [x] Matches DESIGN-SYSTEM tokens
- [x] Uses getData() not inline JSON
- [x] WhatsApp number from `company.json`
