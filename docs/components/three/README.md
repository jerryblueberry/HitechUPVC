# 3D System (`components/three/`)

Status: review
Owner: agent
Last reviewed: 2026-09-27

Real-time uPVC geometry generated in code. See
[ADR 006](../../decisions/006-parametric-3d-over-downloaded-models.md) for why there
are no downloaded models.

## Module map

| File | Role |
|------|------|
| `geometry.ts` | Extruded profile rings, chamfered slabs, procedural woodgrain. Cached by parameter signature. |
| `materials.ts` | uPVC / hardware / glass / gasket / threshold materials as disposable hooks |
| `UpvcHardware.tsx` | Lever handles, hinges, letterplate. Lever exposed as a ref for per-frame rotation. |
| `UpvcUnit.tsx` | Full unit assembly + the six opening rigs |
| `UpvcStage.tsx` | Canvas, HDRI lighting, contact shadow, WebGL/reduced-motion fallbacks |
| `UpvcPanelViewer.tsx` | Wall-panel board stack (woodgrain boards on rails) that fans out when opened; CSS fallback |
| `PointerFollow.tsx` | Turns its children toward the cursor (window-wide, no drag); off under reduced motion |
| `FitCamera.tsx` | Frames a unit of known size, solving both vertical and horizontal FOV |
| `UpvcViewer.tsx` | Self-framing viewer (explainer + configurator) |
| `UpvcScrollScene.tsx` | Scroll-driven camera choreography |
| `UpvcDoorwayScene.tsx` | Page-load intro: French doors in a surface-coloured wall, camera walks through (transparent canvas) |
| `Lazy*.tsx` | `next/dynamic` `ssr: false` entry points |
| `hooks.ts` | Reduced motion, WebGL support, hover capability, viewport pausing, lazy canvas creation (safe to import anywhere) |
| `demand.ts` | On-demand rendering helpers: `SETTLE_EPSILON`, `useInvalidateOn`, `useAutoPlayWake` (canvas-only) |

Model specs, finishes, hardware and glazing live in `lib/upvc3d.ts` — pure data with
no three.js import, so it stays safe to read from server components.

## Units

Everything is in **metres**, matching real profile sizes. A casement window is
0.95 × 1.25 m with a 62 mm frame face; a front door is 1.0 × 2.1 m with a 70 mm face.
This matters: camera distances, contact-shadow placement and hardware proportions all
assume it.

## Opening rigs

`open` runs 0 → 1. The lever always throws first (0 → 0.16), then the leaf moves.

| Rig | Motion |
|-----|--------|
| `swing` | Nested pivot at the hinge stile, rotate Y. Two mirrored leaves for French. |
| `slide` | Leaves on two tracks at different Z; leaf 1 translates X |
| `tilt-turn` | Tilt about the bottom edge, tilt shut, then turn about the side — the real handle sequence |
| `fold` | Each panel hinges off the free edge of the one before it, alternating ±2α |
| `fixed` | No movement |

## Performance rules

- Never import `three` outside `components/three/` or without `next/dynamic`
- One canvas per viewport region — do not render a viewer inside a `lg:hidden` block
  next to another one, both will hold a WebGL context
- **On-demand rendering.** `UpvcStage` canvases use `frameloop="demand"` in view and
  `"never"` off-screen. A still model costs zero GPU. Anything that moves must keep
  calling `state.invalidate()` in `useFrame` until it settles (`SETTLE_EPSILON` in
  `demand.ts`), and request a frame when its inputs change (`useInvalidateOn`).
  Time-based loops use `useAutoPlayWake`; the scroll scene wakes on `scroll`.
- `demand.ts` imports `@react-three/fiber`, so keep it out of `hooks.ts`, which
  non-3D components import
- Canvases are created ~600px before they scroll into view (`useHasApproached`),
  not on page load. They stay mounted after that.
- Shaders compile with `gl.compileAsync` before the first visible frame; the canvas
  fades in (700ms) once ready, so a model never pops in half-built
- `powerPreference: "default"`: "high-performance" wakes the discrete GPU on
  dual-GPU laptops, stalling the page
- DPR is clamped to `[1, maxDpr]` (2 by default, 1.5 for the full-screen scroll scene).
  `PerformanceMonitor` was removed because it misreads demand rendering as low FPS.
- `quality="high"` (refractive glass, an extra pass per frame) drops to `balanced` on
  touch devices
- A lost WebGL context swaps the canvas for the fallback poster instead of a blank box
- Scroll-linked values pass through a **ref**, never React state

## Fallbacks

`UpvcStage` renders `fallback` instead of the canvas when WebGL is unavailable or the
context is lost. During the server render and before the canvas is created, the stage
is empty and the model fades in, so a poster never swaps visibly for the 3D model. Fallback posters come from `lib/upvcAssets.ts`. Reduced
motion still renders a static frame but disables autoplay; the scroll sequence
renders a static prose version instead.

## Review Checklist

- [x] No downloaded model assets; geometry generated in code
- [x] HDRI served locally, not from a CDN preset
- [x] `three` lazy-loaded, never server-rendered
- [x] WebGL and reduced-motion fallbacks on every surface
- [x] All six opening types verified rendering and animating
- [x] Idle canvases draw nothing (verified with a WebGL draw-call counter: hero, cards, scroll scene)
- [x] Only on-screen / nearby canvases exist at load (2 on the home page instead of 6)
- [ ] Lighthouse pass on a page with a canvas
