# USPStrip
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
A ruled specification list for energy efficiency, security, low maintenance, and warranty.

## Design Decisions
- Matches the hero: `bg-surface`, left-aligned gold eyebrow + Fraunces heading,
  charcoal/70 supporting copy
- Tighter top padding (`pt-10` → `lg:pt-16`) so the strip sits closer after the
  scroll-door sequence; bottom keeps full section rhythm
- No cards. One top rule on the grid, then the same divider pattern as
  `StatsCounter` (1 → 2 columns below `lg`, shared 4×3 grid from `lg`)
- Desktop uses `display: contents` so titles, figures, and descriptions share
  rows across columns. Scroll reveal runs on stacked layouts only — motion
  transforms break `contents`
- Every point: title, figure row, description. Figures only where `value` is set
- Not interactive, so there is no hover lift

## Props / Data
- `company.json` — usps array (warranty title shortened to "Warranty"; the figure carries the number)

## Animation Spec
RevealOnScroll on heading and per card (staggered 80ms); AnimatedCounter for integer figures

## Implementation Notes
- File: `components/home/USPStrip.tsx` (server component)

## Review Checklist
- [x] Matches DESIGN-SYSTEM tokens
- [x] Uses getData() not inline JSON
- [x] Animations respect prefers-reduced-motion
