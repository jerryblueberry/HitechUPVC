# MobileNav
Status: done
Owner: agent
Last reviewed: —

## Purpose
Full-screen overlay navigation for mobile with staggered link entrance.

## Design Decisions
- Full viewport overlay, navy background
- Staggered link animation on open
- Close button + body scroll lock

## Animation Spec
Links: staggerChildren 0.05s, fade + translateY

## Implementation Notes
- File: `components/layout/MobileNav.tsx`
- Client component

## Review Checklist
- [ ] Focus trap when open
- [ ] Animations respect prefers-reduced-motion
