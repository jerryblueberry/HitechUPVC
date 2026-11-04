# ScrollDoorSequence

Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose

Pinned, scroll-driven door sequence on the home page. High tier: live WebGL camera
path. Mid/low: the same choreography as a pre-rendered WebP sequence scrubbed on
`SequenceCanvas` (ADR 007) — poster until the first frame paints.

Replaces `CurtainWindowReveal` in the home composition. That component still exists
but is no longer mounted.

## Design Decisions

- **Hardware first.** The opening shot is a close-up of the lever, not the whole
  door. You earn the wide shot.
- **Subject right, caption left.** Camera targets sit left of the unit so the product
  composes into the right of the frame, clear of the caption column.
- **Scrim, not guesswork.** A soft left-edge gradient guarantees caption legibility
  at every point in the sequence rather than hoping the product stays out of the way.
- **Ref, not state.** `useMotionValueEvent` writes scroll progress into a ref that
  `useFrame` reads. Scrolling renders React only when the caption beat changes
  (twice per pass).
- **One damp stage.** Raw scroll is exponentially smoothed (λ = 18); the camera
  locks to that value. Double-damping was mushy — this tracks the finger.
- **Glide, not stop.** The camera rides one centripetal Catmull-Rom spline through
  every shot (position and target), so it arcs past each composition instead of
  stopping and turning a corner. Between shots, `glide` blends linear and
  smoothstep (`GLIDE_DWELL = 0.6`): it slows to ~40% speed near a shot but never
  reaches zero.
- **Cursor drift.** On hover devices, the camera orbits the target by up to ~1.5°
  toward the mouse, damped slowly (λ = 3.2). Touch devices don't get it.
- **Captions play on time.** Scroll picks the beat; the reveal itself is a timed
  animation. Scrubbed opacity left half-faded copy wherever the visitor stopped,
  and a gap with no caption between beats.
- **No progress chrome.** Scroll itself is the only affordance — keeps the product
  and captions clean on every width.
- **Seam with the hero.** Same surface + radial wash as the home hero so the
  pin starts with no empty band and no colour jump.
- **All screen sizes.** Phones get a portrait composition (`MOBILE_SHOTS`) with the
  subject high and captions low; shorter `bodyMobile` copy + tighter type so the
  product stays visible. Shot set swaps at `(min-width: 1024px)`.
- **Warm ahead.** High: `ApproachedMount` so WebGL compiles before the pin.
  Mid/low: `prefetchSequence` + `nearPin` so frames load before the pin sticks.
- **Capture.** `/dev/capture?job=door-landscape,door-portrait` writes
  `public/images/sequences/door-*`. Re-run after shot or model changes.

## Props / Data

None. Copy and camera shots are local constants; the model comes from
`getUpvcModel("hinged", "doors")`.

## Animation Spec

| Scroll | Shot |
|--------|------|
| 0.00 | Handle detail, ~0.8 m out |
| 0.34 | Three-quarter, leaf beginning to swing |
| 0.66 | Hinge side, door wide open |
| 1.00 | Straight elevation |

Door opens over scroll 0.18 → 0.68 (smoothstep of smoothed progress). The camera
follows the spline described above.

Captions take over at scroll 0.30 and 0.62, a moment before the camera settles on
its shot. A beat changes only once scroll is 0.02 past the edge, so a hand
resting on the boundary never flickers. `AnimatePresence mode="wait"`:

| Step | Motion |
|------|--------|
| Exit | fade, rise 14px, blur 6px — 320 ms |
| Meta | `01 / 03` and eyebrow slide in 8px, gold rule draws left → right |
| Title | each word rises out of a mask, 55 ms stagger, 900 ms each |
| Body | fade up 12px, blur 6px → sharp, 850 ms |

All steps use `[0.22, 1, 0.36, 1]`. The first caption plays when 45% of the
stage is on screen. The whole column drifts 12px → −12px across the pin, so the
copy stays alive between beats.

## Responsive Behavior

- Pinned section: `h-[260vh]` phone → `sm:h-[280vh]` → `lg:h-[320vh]`; sticky
  stage is `100svh` + `touch-pan-y` so scroll never fights the canvas. Height
  minus the pin is the scroll the three beats play over — 1.6 screens on a phone
  against 2.2 on a desktop — so the camera travels at a comparable speed on both
  instead of racing through the sequence in one flick
- Desktop: caption column left, left-edge scrim, subject right, full body copy
- Mobile: captions bottom (safe-area), shorter bottom scrim, compact type,
  `bodyMobile` lines; product framed higher
- Same pipeline on both: 4× MSAA, contact shadow, DPR 1.9 phone / 2 desktop,
  stepping down once to 1.35 / 1.5 only if the device drops frames
- The chunk is prefetched with the hero (`warmHomeScene`). The canvas mounts
  once the hero's first frame is done (`immediate`, root margin `160%`), so it
  is compiled while the visitor is still on the carousel
- **Poster first.** `public/images/door/door-desktop.webp` (2.6:1) and
  `door-mobile.webp` (1.6:1) are the opening shot rendered by this scene with a
  transparent background, one per shot set. With a fixed vertical FOV, any
  viewport narrower than the capture is a centred slice of it, so `object-cover`
  matches the first live frame. CSS picks one (`lg:`), so only that file
  downloads (~30 KB). It paints from the server HTML, fades out once the scene
  reports `onReady`, then unmounts; it also fades if the visitor scrolls past 4%
  first, and stays as the static frame without WebGL. Re-capture both if the
  model, lighting or the first shot of either set changes
- Canvas is `pointer-events-none` so touch scrolling is never captured
- `motion-reduce:` swaps the pinned section for the static prose version

## Accessibility

Section carries `aria-label="Scroll-driven door sequence"`. The scrim is
`aria-hidden`. All three captions sit in an `sr-only` block as real headings
and paragraphs. The animated layer is `aria-hidden`, so screen readers get the
full story regardless of scroll position. Reduced motion falls through to the
static prose section (`renderWhenReduced={false}`).

## Dependencies

`framer-motion` (`useScroll`, `useMotionValueEvent`, `useTransform`),
`components/three/LazyUpvcScrollScene` (+ `prefetchUpvcScrollScene`)

## Review Checklist

- [x] Captions legible at every scroll position, including on beat boundaries
- [x] Only one caption on screen at a time; fast jumps land on the right beat
- [x] Camera never stops dead between shots
- [x] React renders only on beat change
- [x] No progress indicator chrome
- [x] Smooth progress tracking (single damp stage)
- [x] Mobile copy + framing leave the product clear
- [x] Same quality on touch and pointer; one measured step down if frames drop
- [x] Prefetch + early approach mount
- [x] Reduced-motion fallback renders the same information
- [ ] Verify pin behaviour against a real trackpad at 1440px and 1920px
