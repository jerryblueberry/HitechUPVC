# UpvcConfigurator

Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose

Real-time 3D configurator on product detail pages. Frame finish, hardware, glazing
and the opening itself all drive the same parametric model — there are no
pre-rendered variants to keep in sync.

## Design Decisions

- **Finishes come from product data.** `product.colors` is filtered against the
  finishes that have a defined 3D material (`FINISHES` in `lib/upvc3d.ts`), so a
  product never offers a swatch the renderer cannot show.
- **Hardware and glazing are catalogue-wide**, not per-product, until the data model
  carries them.
- **Toggle plus slider.** The button reads as the primary action; the slider lets you
  stop halfway and actually see the mechanism, which is the point.
- **Orbit is constrained** to a shallow arc so the unit can never end up backlit or
  upside down.

## Props / Data

| Prop | Source |
|------|--------|
| `openingType`, `category` | `product.openingType`, `product.category` |
| `colors` | `getColors()` filtered by `product.colors`, passed from the server component |
| `productName` | Used for the fallback image alt text |

## Animation Spec

`open` state 0–1 feeds `UpvcUnit`, which damps toward it (λ = 3.6). Swatch and chip
changes swap materials instantly — no transition, because a finish change is not a
movement.

## Responsive Behavior

`lg:grid-cols-[1.3fr_1fr]` — viewer left, controls right. Single column below `lg`,
viewer first.

## Accessibility

Swatches are buttons with `aria-label` (the colour name) and `aria-pressed`. Chips
use `aria-pressed`. The slider has an `sr-only` label. Focus rings use the
design-system gold ring. All controls are keyboard reachable; the 3D view is
decorative relative to the controls, which carry the state.

## Dependencies

`components/three/LazyUpvcViewer`, `lib/upvc3d.ts`, `lib/constants.ts`

## Review Checklist

- [x] Only finishes with a 3D material are offered
- [x] Every control has an accessible name and pressed state
- [x] Falls back to a static product image without WebGL
- [ ] Persist configuration into the quote form once that exists
