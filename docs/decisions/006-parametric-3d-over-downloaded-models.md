# ADR 006: Parametric 3D geometry instead of downloaded models

**Status:** Accepted
**Date:** 2026-09-27
**Supersedes:** Phase 2 of [ADR 003](./003-opening-type-animation-approach.md)

## Context

The product story depends on showing how a unit opens. ADR 003 put animated SVG in
Phase 1 and left "Lottie or video loops" for Phase 2. Neither scales: every finish,
hardware option and opening type would need its own pre-rendered asset, and none of
them can be inspected from another angle.

Real-time 3D solves that, but it needs geometry. We surveyed what is available:

| Source | Licence | Problem |
|--------|---------|---------|
| Poly Pizza / OpenGameArt | CC0 | Low-poly game assets; no profile detail |
| FurniMesh | Free | AI-generated single mesh — the leaves are fused and **cannot open** |
| iMeshh | Paid plan | Good geometry, but licensed per-seat and still not rigged for opening |

A sash that opens needs the frame, leaf, glazing, bead and handle as separately
transformable nodes. No free asset provides that, and buying one still leaves us
re-rigging it by hand for each of six opening types.

## Decision

**Generate the geometry in code** from a parametric spec (`lib/upvc3d.ts`), built
with React Three Fiber in `components/three/`.

- Every part is extruded from a real profile cross-section in metres, with a
  chamfered edge — the chamfer catches the highlight that makes white uPVC read as
  plastic rather than paper.
- The frame and sash are continuous rings (`ExtrudeGeometry` with a hole), so mitred
  corners are seamless with no corner joins to model.
- Opening rigs are nested pivot groups, so each of the six opening types is a few
  lines of transform rather than a separate asset.
- Lighting is a **CC0 Poly Haven studio HDRI** committed to `public/hdri/`. drei's
  `preset` prop is not used because it fetches from a CDN at runtime.
- Woodgrain finishes use a canvas-generated grain texture, so no texture downloads.

## Consequences

**Good**

- Zero model payload. three.js itself is the only cost, and it is lazy-loaded.
- Finish, hardware, glazing and opening state are all live — the configurator has no
  pre-rendered variants to keep in sync.
- Sharp at any resolution and any camera angle.
- No third-party licence to track.

**Costs**

- Geometry realism is bounded by what is worth expressing in code. Deep profile
  chamber detail and moulded door skins are approximated by a stepped profile.
- Requires WebGL. Every 3D surface has a static image fallback (`lib/upvcAssets.ts`)
  used when WebGL is unavailable, and reduced-motion disables autoplay.

**If a modelled asset is bought later**, `UpvcUnit` is the only seam that changes:
its rig contract (frame / leaf / handle nodes driven by a 0–1 `open` value) stays.

## Performance rules

- three.js is behind `next/dynamic` with `ssr: false` — never in the initial bundle.
- Canvases pause (`frameloop="never"`) when scrolled out of viewport.
- `PerformanceMonitor` drops DPR on decline.
- Geometry is cached by parameter signature and shared across instances.
- Refracting glass (`transmission`) is `quality="high"` only; `"balanced"` uses an
  alpha-blended pane with a strong clearcoat.
- Scroll-linked animation is driven through a ref inside `useFrame`, never React
  state, so scrolling causes no re-renders.
