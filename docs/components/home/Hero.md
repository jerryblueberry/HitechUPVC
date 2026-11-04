# Hero
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
First home section — Apple-style product carousel. The visitor enters through a
doorway intro and lands on copy + product stage. High-tier devices use live
parametric WebGL (ADR 006); mid/low scrub pre-rendered frames (ADR 007).

## Implementation
- File: `components/home/Hero.tsx` (client)
- Intro: `components/animations/DoorwayIntro.tsx` → `components/three/UpvcDoorwayScene.tsx` (lazy)
- High: `LazyUpvcViewer`. Mid/low: `SequenceCanvas` + `heroSequence(slide.id)`
- Slides: `HERO_3D_SLIDES` in `lib/heroSlides.ts` (French, Sliding, Tilt & Turn, Casement, Bi-Fold)
- CTA: `company.hero.primaryCta`
- Capture frames: `/dev/capture?job=all` — see [PERFORMANCE.md](../../PERFORMANCE.md)

## Doorway intro (replaces the fabric curtain)
- White French doors set into a wall the exact colour of `--color-surface`
- Lever throws, both leaves swing open, camera walks through the doorway;
  the canvas is transparent so the real page is revealed behind the doors
- Server renders a surface-coloured cover with the wordmark, so there is no
  flash of the page while three.js loads (the intro canvas does **not** wait
  on the 1.5 MB HDRI)
- Hero copy rises as the camera starts walking through (`onReveal`) — 0.55s ease, tight stagger
- `prefetchUpvcViewer()` warms the hero chunk during the walk
- Hero 3D stage mounts when the overlay completes (`onComplete`), after the intro canvas has dropped
- `warmHomeScene()`: high idle-warms Three.js + HDRI; mid/low idle-prefetch sequence frames. Poster always wins first paint.
- **Poster first.** `public/images/hero/<slide id>.webp` is a still of the live
  unit (closed pose, transparent, same HDRI), rendered by the stage itself and
  cropped to the `FitCamera` fit box (width = height × projected width / unit
  height), so `object-contain` puts it exactly where the canvas draws. It is in
  the server HTML with `preload` + `fetchPriority="high"` (15 KB, the page's LCP),
  the canvas fades in over it, then it fades out and unmounts. It also serves as
  the no-WebGL fallback. Re-capture all five if the model, materials, lighting
  or framing change
- Open / shut timers start only after `onReady` (shaders compiled)
- First paint uses stage fade only; slide changes use a short crossfade
- Plays once per session (`sessionStorage`); click anywhere to skip
- Skipped entirely for reduced motion or no WebGL; 2.4s load timeout fails open

## Carousel
- Desktop: copy + CTAs + product chips on the left, 3D stage on the right with
  counter and prev/next arrows in its bottom-right corner
- Mobile: copy → 3D stage → CTAs → chips (snap scroller); swipe the stage; pause on touch
- 7s per slide; the unit opens at 0.7s and shuts at 4.6s after the canvas is ready
- Gold progress bar inside the active chip
- Pauses on hover / touch; no auto-advance or opening under reduced motion
- Slide change: copy crossfades, stage fades/scales in (layout effect, no flash)
- Secondary link goes to the slide's product detail page
- Warm radial gradient (`#fff` → surface → `#ebe7e0`), charcoal type, gold eyebrow

## Header
- The home hero is now light, so the header always uses the dark-on-light
  treatment (the white "over hero" variant was removed)
- First-band spacing uses `.page-top` (same token as contact / Why uPVC). Content
  is `items-start`, not vertically centered. No `min-h-svh` — the hero hugs the
  chips so the door sequence starts immediately, same studio wash.

## Review Checklist
- [x] Matches DESIGN-SYSTEM tokens (surface, charcoal, navy, gold)
- [x] Animations respect prefers-reduced-motion (intro skipped, lineup static, `MotionConfig reducedMotion="user"`)
- [x] WebGL fallback: intro skipped, stage shows the rendered slide poster
- [x] Accessible carousel: tablist chips, labelled arrows, `aria-roledescription`
- [x] Verified at 390px, 1024px and 1280px widths
- [x] three.js lazy-loaded, never server-rendered
- [x] Intro canvas has no HDRI; hero `LazyUpvcViewer` mounts only after `onComplete`
- [x] Eager hero stage; open animation waits for compile; shared device budget
- [x] All carousel features preserved (swipe, chips, autoplay, open/shut)
- [x] `tsc`, `eslint` and `next build` pass
