# UpvcUnit

Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose

Assembles a complete uPVC unit — outer frame, leaves, sealed glazing units, beads,
gaskets, sill or threshold and furniture — from a `UpvcModelSpec`, and animates it
opening.

## Design Decisions

- **Continuous rings, not mitred members.** The frame and each sash are one
  `ExtrudeGeometry` with a hole, so corners have no visible joins.
- **Sculptured profile.** The `Profile` helper renders an outer flange with the main
  face stepped back behind it. A flat picture-frame silhouette reads as cardboard.
- **Chamfered everything.** Every extrusion carries a ~3.5 mm bevel. That highlight
  is most of what makes the white surface look like plastic.
- **Gaskets are modelled.** A dark EPDM ring sits between bead and glass. It is a
  small mesh that does a lot of the realism work.
- **Imperative animation.** `useFrame` damps toward the target and writes transforms
  directly to refs. Scroll-linked motion never re-renders React.

## Props / Data

| Prop | Purpose |
|------|---------|
| `spec` | `getUpvcModel(openingType, category)` from `lib/upvc3d.ts` |
| `finish`, `hardware`, `glazing` | Appearance, from the same module |
| `open` | Discrete target, 0–1 |
| `openSource` | Per-frame target function; takes precedence over `open` |
| `quality` | `"high"` uses refracting glass; `"balanced"` uses an alpha pane |
| `damping` | Higher settles faster. ~2 for autoplay, ~7 for scroll. |

## Animation Spec

`open` 0 → 1. Lever throws over 0 → 0.16, leaf moves over 0.12 → 1 with a smoothstep.
Tilt-turn subdivides further: tilt in (0 → 0.3), tilt shut (0.42 → 0.56), turn
(0.58 → 1). See the rig table in [README.md](./README.md).

## Accessibility

No DOM output — it renders into a canvas. The surrounding component owns the
accessible name and any static fallback.

## Dependencies

`@react-three/fiber`, `@react-three/drei` (`RoundedBox`), `three`,
`./geometry`, `./materials`, `./UpvcHardware`, `lib/upvc3d.ts`

## Review Checklist

- [x] All six opening types animate without geometry interpenetrating the frame
- [x] Sliding frames are deep enough for two tracks
- [x] Threshold uses its own aluminium material, not the handle finish
- [x] Materials disposed on unmount
