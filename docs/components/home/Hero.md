# Hero
Status: review
Owner: agent
Last reviewed: 2026-09-27

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
  flash of the page while three.js + the HDRI load
- Hero copy animates in as the camera starts walking through (`onReveal`)
- Plays once per session (`sessionStorage`); click anywhere to skip
- Skipped entirely for reduced motion or no WebGL; 4s load timeout reveals the page

## Carousel
- Desktop: copy + CTAs + product chips on the left, 3D stage on the right with
  counter and prev/next arrows in its bottom-right corner
- Mobile: copy → 3D stage → CTAs → chips (horizontally scrollable); swipe the stage
- 7s per slide; the unit opens at 0.9s and shuts at 4.8s, so every slide shows
  one full movement. Gold progress bar inside the active chip
- Pauses on hover; no auto-advance or opening under reduced motion
- Slide change: copy crossfades, stage fades/scales in (layout effect, no flash)
- Secondary link goes to the slide's product detail page
- Warm radial gradient (`#fff` → surface → `#ebe7e0`), charcoal type, gold eyebrow

## Header
- The home hero is now light, so the header always uses the dark-on-light
  treatment (the white "over hero" variant was removed)

## Review Checklist
- [x] Matches DESIGN-SYSTEM tokens (surface, charcoal, navy, gold)
- [x] Animations respect prefers-reduced-motion (intro skipped, lineup static, `MotionConfig reducedMotion="user"`)
- [x] WebGL fallback: intro skipped, stage shows the viewer's PNG poster
- [x] Accessible carousel: tablist chips, labelled arrows, `aria-roledescription`
- [x] Verified at 390px, 1024px and 1280px widths
- [x] three.js lazy-loaded, never server-rendered
- [x] `tsc`, `eslint` and `next build` pass
