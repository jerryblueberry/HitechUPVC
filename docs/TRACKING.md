# Project Tracking

Single source for backlog, in-progress, review, and done. Update on every task.

---

## Backlog

### Foundation
- [ ] Add build-time Zod validation in getData.ts

### Products
- [ ] Products overview page + ProductGrid + filters
- [ ] Category listing pages (windows, doors, panels) — detail routes exist, listings 404
- [ ] SpecTable, ColorSwatchPicker, OpeningTypeTabs (detail page currently uses an inline spec list)
- [ ] Sticky quote CTA bar
- [ ] Carry configurator selections into the quote form

### Other Pages
- [ ] Why UPVC (scrollytelling)
- [ ] Gallery page
- [ ] About page
- [ ] Contact page
- [ ] Get Quote multi-step form

### Polish
- [x] Scroll progress bar
- [ ] Floating WhatsApp button
- [ ] Accessibility pass (focus states audit)
- [ ] Performance pass (next/image sizes, Lighthouse)
- [ ] SEO metadata per page

### Content (see CONTENT-CHECKLIST.md)
- [x] Placeholder web images (Unsplash) wired via lib/images.ts
- [ ] Replace with owned product photography before launch
- [ ] Final copy review

---

## In Progress

- (empty)

---

## Review

Real-time 3D (ADR 006) — awaiting sign-off:

- [x] `lib/upvc3d.ts` — parametric model specs, finishes, hardware, glazing
- [x] `components/three/` — geometry, materials, hardware, opening rigs, stage, camera fit
- [x] CC0 Poly Haven studio HDRI in `public/hdri/`
- [x] ScrollDoorSequence — pinned scroll-driven door sequence (replaces CurtainWindowReveal on home)
- [x] OpeningTypesExplainer — now a real 3D viewer, single WebGL context
- [x] UpvcConfigurator — live finish / hardware / glazing / opening
- [x] Product detail routes for windows, doors, panels
- [x] DoorwayIntro — 3D French-door page-load intro (replaces HeroCurtainIntro, which is deleted)
- [x] USPStrip — Apple-style spec cards matching the hero (white cards, line icons, display figures)
- [x] ProductCategoryShowcase — live 3D cards (casement, french, new panel stack), hover to open / autoplay on touch, mobile snap scroller
- [x] 3D performance pass — on-demand rendering, lazy canvas creation, async shader compile + fade-in, context-loss fallback, touch-device glass downgrade (see `docs/components/three/README.md`)
- [ ] Known gap: `/products/windows`, `/products/doors`, `/products/panels` overview pages 404 (linked from the category cards and nav). Build per `docs/pages/products-overview.md`.
- [x] Hero — Apple-style 3D product carousel: copy left, live 3D unit right, 5 slides (replaces HeroCarousel on home); header always dark-on-light

---

## Done

- [x] Initial Next.js scaffold
- [x] Documentation tree (docs/)
- [x] Cursor rules (.cursor/rules/)
- [x] Design tokens in globals.css
- [x] Fonts: Fraunces + Inter in layout.tsx
- [x] lib/types.ts + lib/getData.ts + lib/constants.ts + lib/schemas.ts
- [x] Placeholder JSON data files
- [x] DATA-MODEL.md + ADRs
- [x] AGENTS.md project rules block
- [x] Install framer-motion and zod
- [x] (marketing) route group + app/template.tsx
- [x] UI primitives: AnimatedText, RevealOnScroll, MagneticButton, Marquee, AnimatedCounter
- [x] OpeningTypeDemo SVG animations
- [x] Layout shell: Header, MegaMenu, Footer, MobileNav
- [x] Home page: Hero, USPStrip, ProductCategoryShowcase, OpeningTypesExplainer
- [x] Home page: BeforeAfterSlider, ProcessTimeline, TestimonialsMarquee, StatsCounter
- [x] Home page: GalleryTeaser, CTASection, full page compose
- [x] GSAP ScrollTrigger cinematic section (ScrollStorySection)
- [x] CurtainWindowReveal — curtain roll + window light bloom + color swatches on scroll
- [x] HeroCurtainIntro — page-load curtain opening gesture (superseded by DoorwayIntro)
- [x] ColorFinishes section — 8 subtle RAL/woodgrain swatches
- [x] Premium animations: PremiumText, ImageReveal, real Unsplash imagery
- [x] Hero full-bleed photography + parallax + adaptive header
- [x] Install three, @react-three/fiber, @react-three/drei
- [x] ADR 006 — parametric 3D geometry instead of downloaded models

---

## Notes

`components/home/CurtainWindowReveal.tsx` is no longer mounted on the home page —
`ScrollDoorSequence` replaced it. Delete it once the 3D sequence is signed off.

`components/home/HeroCarousel.tsx` (and `lib/heroSlides.ts`, `OpeningSequencePlayer`) are no
longer mounted — the 3D `Hero` replaced the carousel. Delete after sign-off.

---

*Last updated: 2026-09-27*
