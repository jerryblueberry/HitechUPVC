# Hero
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
First home section — Apple-style 3D product carousel. The visitor enters through
a 3D doorway intro and lands on a two-column carousel: copy on the left, the live
3D unit on the right, using the same parametric uPVC assets as the rest of the
site (ADR 006).

## Implementation
- File: `components/home/Hero.tsx` (client)
- Intro: `components/animations/DoorwayIntro.tsx` → `components/three/UpvcDoorwayScene.tsx` (lazy)
- Stage: a single `LazyUpvcViewer` (one WebGL context) whose opening type changes per slide
- Slides: `HERO_3D_SLIDES` in `lib/heroSlides.ts` (French, Sliding, Tilt & Turn, Casement, Bi-Fold)
- CTA: `company.hero.primaryCta`; `company.hero.headline` is the (visually hidden) `h1`
- Replaces `HeroCarousel.tsx` (still in repo, unmounted — delete after sign-off)

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
- Stage uses `eager` (no approach wait) and takes its DPR, MSAA and contact shadow from `components/three/quality.ts` — 1.9 on a phone, 2 on a desktop
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
- [x] WebGL fallback: intro skipped, stage shows the viewer's PNG poster
- [x] Accessible carousel: tablist chips, labelled arrows, `aria-roledescription`
- [x] Verified at 390px, 1024px and 1280px widths
- [x] three.js lazy-loaded, never server-rendered
- [x] Intro canvas has no HDRI; hero `LazyUpvcViewer` mounts only after `onComplete`
- [x] Eager hero stage; open animation waits for compile; shared device budget
- [x] All carousel features preserved (swipe, chips, autoplay, open/shut)
- [x] `tsc`, `eslint` and `next build` pass
