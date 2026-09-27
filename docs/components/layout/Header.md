# Header
Status: done
Owner: agent
Last reviewed: —

## Purpose
Sticky site header with logo, primary nav, and mega menu trigger. Transparent over hero, solid on scroll.

## Design Decisions
- Transparent → `bg-surface/95 backdrop-blur` on scroll
- Navy text on light background
- Nav underline slides between items (`layoutId="nav-underline"`)

## Props / Data
- `navigation.json` via `getNavigation()`
- Type: `NavItem[]`

## Animation Spec
Scroll-linked background opacity via `useScroll` + interpolated background

## Responsive Behavior
- Desktop: horizontal nav + mega menu on hover
- Mobile: hamburger → [MobileNav.md](./MobileNav.md)

## Accessibility
- `<header>`, `<nav>`, skip link optional
- Keyboard accessible mega menu

## Dependencies
- MegaMenu, MobileNav
- `lib/getData.ts`

## Implementation Notes
- File: `components/layout/Header.tsx`
- Client component (scroll + menu state)

## Review Checklist
- [ ] Matches DESIGN-SYSTEM tokens
- [ ] Uses getData() not inline JSON
- [ ] Animations respect prefers-reduced-motion
- [ ] Images use next/image with sizes
