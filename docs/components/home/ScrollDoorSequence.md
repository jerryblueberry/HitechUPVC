# ScrollDoorSequence

Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose

Pinned, scroll-driven 3D door sequence on the home page. The camera starts tight on
the hardware, pulls back as the leaf swings, crosses to the hinge side, then settles
on a clean elevation — the product-page choreography Apple uses.

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
  `useFrame` reads. Scrolling causes zero React renders.
- **One damp stage.** Raw scroll is exponentially smoothed (λ = 14); the camera
  locks to that value. Double-damping was mushy — this tracks the finger.
- **No progress chrome.** Scroll itself is the only affordance — keeps the product
  and captions clean on every width.
- **Seam with the hero.** Same surface + radial wash as the home hero so the
  pin starts with no empty band and no colour jump.
- **All screen sizes.** Phones get a portrait composition (`MOBILE_SHOTS`) with the
  subject high and captions low; shorter `bodyMobile` copy + tighter type so the
  product stays visible. Shot set swaps at `(min-width: 1024px)`.
- **Warm ahead.** Prefetch + `ApproachedMount` rootMargin `45%` so the canvas is
  compiling before the pin locks.

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

Door opens over scroll 0.18 → 0.68 (smoothstep of smoothed progress). Camera
positions lerp with smoothstep between shots. Captions fade out, swap, fade in.
Each beat is marked `01 — The detail`. Grid-stacked so height never jumps.

## Responsive Behavior

- Pinned section: `h-[240vh]` phone → `sm:h-[300vh]` → `lg:h-[400vh]`; sticky
  stage is `100svh` + `touch-pan-y` so scroll never fights the canvas
- Desktop: caption column left, left-edge scrim, subject right, full body copy
- Mobile: captions bottom (safe-area), shorter bottom scrim, compact type,
  `bodyMobile` lines; product framed higher
- Touch: DPR 1.15, no contact shadow, no antialias; desktop DPR 1.5 + shadow
- Canvas is `pointer-events-none` so touch scrolling is never captured
- `motion-reduce:` swaps the pinned section for the static prose version

## Accessibility

Section carries `aria-label="Scroll-driven door sequence"`. The scrim is
`aria-hidden`. Captions are real headings and paragraphs. Reduced motion falls
through to the static poster (`renderWhenReduced={false}`).

## Dependencies

`framer-motion` (`useScroll`, `useMotionValueEvent`, `useTransform`),
`components/three/LazyUpvcScrollScene` (+ `prefetchUpvcScrollScene`)

## Review Checklist

- [x] Captions legible at every scroll position
- [x] Captions dissolve through each other — no empty gap between beats
- [x] Only one caption fully legible at a time
- [x] No React re-render while scrolling
- [x] No progress indicator chrome
- [x] Smooth progress tracking (single damp stage)
- [x] Mobile copy + framing leave the product clear
- [x] Touch DPR / no shadow; desktop full quality
- [x] Prefetch + early approach mount
- [x] Reduced-motion fallback renders the same information
- [ ] Verify pin behaviour against a real trackpad at 1440px and 1920px
