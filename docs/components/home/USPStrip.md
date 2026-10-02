# USPStrip
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Apple-style spec cards highlighting energy efficiency, security, low maintenance, and warranty.

## Design Decisions
- Matches the hero: `bg-surface`, left-aligned gold eyebrow + Fraunces heading,
  charcoal/60 supporting copy
- Tighter top padding (`pt-10` → `lg:pt-16`) so the strip sits closer after the
  scroll-door sequence; bottom keeps full section rhythm
- White `rounded-3xl` cards with a soft layered shadow and hairline ring;
  1 → 2 → 4 columns
- Thin-stroke SVG icons in a muted circle (turns gold on hover), no emoji
- Content bottom-aligned; USPs with a `value` get a large display figure
  (`1.1 W/m²K`, `10 years`)
- Hover: 4px lift + deeper shadow

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
