# OpeningTypesExplainer
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Interactive tabbed control showing how each window and door opening mechanism works,
using a real-time 3D unit that loops open and shut.

## Design Decisions
- Replaced the SVG / frame-sequence player with `UpvcViewer` (see
  [ADR 006](../../decisions/006-parametric-3d-over-downloaded-models.md))
- **One viewer at all breakpoints.** The previous mobile accordion mounted a second
  viewer inside a `lg:hidden` block, which held a second WebGL context that was never
  visible. Tabs now wrap on small screens and drive the single viewer.
- Each type carries a short explanation of what the mechanism is actually for, so the
  section teaches rather than just demonstrates
- Doors (folding, French, hinged) use the door profile weights, windows use window ones

- **Light theme** to match the hero and USP cards: `bg-surface`, gold eyebrow,
  Fraunces clamp heading, charcoal/60 copy, charcoal active chip. The viewer sits in
  a `rounded-[2rem]` studio card (white → surface → `#ebe7e0` radial) with a soft shadow

## Props / Data
- Opening types from `DEMO_OPENING_TYPES` in `lib/upvc3d.ts`
- Labels from `lib/constants.ts`
- Descriptions are local to the component

## Animation Spec
`UpvcViewer autoPlay` — a square-wave target on a 7s cycle, smoothed by the unit's
damping into an eased swing. Tab copy crossfades with `AnimatePresence`
(0.4s, `[0.22, 1, 0.36, 1]`). Visitors can orbit within a shallow arc.

## Responsive Behavior
Two columns at `lg`, stacked below. Viewer aspect steps `4/3` → `5/4` → `4/5`.

## Accessibility
Tabs use `role="tablist"` / `role="tab"` with `aria-selected`. Focus ring is the
gold ring on the surface background. Without WebGL the viewer renders the static product
image for the active type.

## Implementation Notes
- File: `components/home/OpeningTypesExplainer.tsx`
- Uses `components/three/LazyUpvcViewer.tsx`

## Review Checklist
- [x] Tabs keyboard accessible with visible focus
- [x] Exactly one WebGL context on every breakpoint
- [x] Reduced motion: static frame, no autoplay
- [x] WebGL-less fallback renders the poster image
