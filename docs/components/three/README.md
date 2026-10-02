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
| `geometry.ts` | Extruded profile rings, chamfered slabs, fluted wall panel, procedural woodgrain. Cached by parameter signature. |
| `materials.ts` | uPVC / hardware / glass / gasket / threshold materials as disposable hooks |
| `UpvcHardware.tsx` | Lever handles, hinges, letterplate. Lever exposed as a ref for per-frame rotation. |
| `UpvcUnit.tsx` | Full unit assembly + the six opening rigs |
| `UpvcStage.tsx` | Canvas, HDRI lighting, contact shadow, WebGL/reduced-motion fallbacks |
| `UpvcPanelViewer.tsx` | Fluted woodgrain slat wall (tight vertical ribs, cropped like an installed feature wall) |
| `PointerFollow.tsx` | Turns its children toward the cursor (window-wide, no drag); off under reduced motion |
| `FitCamera.tsx` | Frames a unit of known size, solving both vertical and horizontal FOV |
| `UpvcViewer.tsx` | Self-framing viewer (explainer + configurator) |
| `UpvcScrollScene.tsx` | Scroll-driven camera choreography |
| `UpvcDoorwayScene.tsx` | Page-load intro: French doors in a surface-coloured wall, camera walks through (transparent canvas). Lights only — no HDRI. Clock starts after `compileAsync`. |
| `Lazy*.tsx` | `next/dynamic` `ssr: false` entry points |
| `hooks.ts` | Reduced motion, WebGL support, hover capability, viewport pausing, lazy canvas creation (safe to import anywhere) |
| `quality.ts` | Device tier + the DPR / MSAA / shadow / glass / HDRI budget every surface reads |
| `ApproachedMount.tsx` | Unmounts 3D until near the viewport and the doorway intro has unlocked |
| `demand.ts` | On-demand rendering helpers: `SETTLE_EPSILON`, `useInvalidateOn`, `useAutoPlayWake` (canvas-only) |
| `patchClock.ts` | Suppresses R3F 9’s deprecated `THREE.Clock` constructor warning (Clock is a read-only export) |

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
- Canvases are created ~220px before they scroll into view (`useHasApproached`),
  and not at all while the doorway intro holds `lib/introSession` lock.
  `ApproachedMount` keeps the lazy three.js chunk unmounted until then. The
  home hero viewer uses `eager` so it mounts as soon as the intro unlocks,
  without waiting on an intersection observer.
- Shaders compile with `gl.compileAsync` before the first visible frame; the canvas
  fades in (700ms) once ready, so a model never pops in half-built
- `powerPreference: "default"`: "high-performance" wakes the discrete GPU on
  dual-GPU laptops, stalling the page
- `quality.ts` holds the single render policy: a device tier (`high` hover /
  `mid` touch / `low`) picks DPR, MSAA, contact shadow, glass and HDRI. A touch
  screen alone no longer costs quality — only Save-Data, `deviceMemory < 4` or a
  2g connection demote to `low`. Phones therefore run the same pipeline as a
  laptop with 4× MSAA, the contact shadow and the 1k HDRI.
- Viewers: DPR 1.9–2 with refractive glass while the unit holds a pose, 1.4–1.75
  with the blended pane while it loops open and shut. Orbiting keeps the sharp
  buffer; it only draws while the finger moves.
- Scroll scene: smooth progress (λ = 18, same for touch and pointer) then the
  camera locks; wake on `scroll`; shot-set swaps snap. It opens at DPR 1.9–2 and
  steps down to `reducedDpr` **once per visit** if `useFrame` measures sustained
  frames over 24ms, since resizing the buffer costs a frame of its own.
  `PerformanceMonitor` is not used — it misreads demand rendering as low FPS.
- `quality="high"` is a ceiling, not a request: `capQuality` takes the lower of it
  and the device budget. The doorway intro uses `draft` (MeshStandard, no clearcoat)
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
