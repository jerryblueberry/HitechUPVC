# ADR 003: Opening Type Animation Approach

**Status:** Accepted  
**Date:** 2026-08-23

## Context

UPVC product understanding depends on showing how windows and doors open (sliding, tilt-turn, folding, etc.).

## Decision

**Phase 1 (MVP):** Animated SVG in `components/animations/OpeningTypeDemo.tsx` driven by Framer Motion. Used in OpeningTypesExplainer (home), OpeningTypeTabs (product detail), and mega menu promo.

**Phase 2:** ~~Optional Lottie or video loops for higher fidelity.~~ Superseded by
[ADR 006](./006-parametric-3d-over-downloaded-models.md) — real-time parametric 3D
replaced pre-rendered loops, because every finish and angle would otherwise need
its own asset.

| Type | Technique |
|------|-----------|
| Sliding | translateX on sash |
| Casement | rotate on hinge |
| Tilt & turn | Sequential tilt then turn keyframes |
| Folding | Staggered panel transforms |
| French | Mirrored dual rotate |
| Hinged | Single large arc rotate |

**Reduced motion:** Static diagram, no auto-play.

## Consequences

- One shared OpeningTypeDemo component across pages
- SVG assets maintainable without video production initially
- Phase 2 can swap internals without changing consumers
