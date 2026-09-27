# Premium UPVC Company Website — Master Plan

*Stack: Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + Static JSON content*

---

## 1. Project Goals

- Position the brand as a **premium, modern, trustworthy** UPVC manufacturer (panels, doors, windows).
- Make **product understanding** effortless — especially opening types (sliding, casement, tilt & turn, folding, French, etc.).
- Feel **light, fast, and interactive** without being gimmicky — motion should support content, not distract.
- Be **fully responsive**, consistent, and easy to extend later with a CMS/backend (JSON now → API later, same shape).

---

## 2. Tech Stack & Architecture

```
Next.js 16+ (App Router, TypeScript)
Tailwind CSS v4 (custom design tokens via @theme in globals.css)
Framer Motion (page transitions, scroll reveals, mega menu, micro-interactions)
next/image (all imagery, AVIF/WEBP)
Static JSON as the "database" (swappable for a CMS later without changing components)
Zod — validate JSON shape at build time so bad data fails fast
```

See [FOLDER-STRUCTURE.md](./FOLDER-STRUCTURE.md) for the full directory layout.

---

## 3. Content Model (Static JSON)

Keep every JSON file's shape identical to what a future CMS (Sanity/Strapi/Contentful) would return. See [DATA-MODEL.md](./DATA-MODEL.md).

---

## 4. Visual Identity — Premium Direction

### Colors
- Base neutrals: off-white `#F7F6F3`, warm grey `#E7E4DF`, charcoal `#1B1B1D`
- Primary accent: deep navy `#0E2A3E`
- Metal accent: brushed gold `#B69A6B` — sparingly
- Functional: success green `#2F7D5E` for U-values/eco badges

### Typography
- Display/Headlines: **Fraunces** (400/500/600, italic for accent words)
- Body/UI: **Inter** (400/500/600)
- Load via `next/font/google`

### Type Scale
```
text-hero: clamp(2.75rem, 6vw, 5.5rem)
text-h2:   clamp(2rem, 4vw, 3.25rem)
text-h3:   clamp(1.5rem, 2.5vw, 2rem)
text-body: 1rem–1.125rem, line-height 1.6
text-caption: 0.875rem, tracking-wide, uppercase
```

See [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) for full token reference.

---

## 5. Page-by-Page Plan

### Home
1. Hero — full-bleed image/video, serif headline, staggered reveal, CTAs
2. USP strip — 4 icons with counter animation
3. Product Category Showcase — Windows / Doors / Panels cards
4. Opening Types Explainer — interactive tabs + animated SVG
5. Why UPVC vs Wood/Aluminum — comparison
6. Before/After slider
7. Process Timeline — Consultation → Installation → Aftercare
8. Testimonials marquee
9. Stats counters
10. Gallery teaser
11. CTA section
12. Footer

### Products Overview
Filterable grid (category, opening type, color) with layout transitions.

### Product Detail
Hero gallery, opening type animation, spec table, color picker, related products, sticky quote CTA.

### Why UPVC
Scrollytelling: sticky visual + scrolling text sections.

### Gallery / Projects
Masonry grid with lightbox, filter by product type/location.

### About
Company story, manufacturing, certifications, team.

### Contact / Get a Quote
Multi-step form with animated step transitions, map, WhatsApp CTA.

---

## 6. Navigation & Mega Menu

- Sticky header, transparent over hero → solid on scroll
- Mega menu: Windows / Doors / Panels columns + featured promo
- Sliding nav underline (`layoutId`)
- Mobile: full-screen overlay with staggered links

---

## 7. Build Order

1. Foundation — docs, rules, design tokens, fonts
2. Data contract — types, JSON, getData
3. Layout shell — Header, MegaMenu, Footer, MobileNav
4. Home page — section by section
5. Products — listing + filters + detail template
6. Remaining pages — gallery, about, why-upvc, contact/quote
7. Polish — animations, a11y, Lighthouse
8. Future — swap getData for API

Full tracking in [TRACKING.md](./TRACKING.md).

---

## 8. Performance & Accessibility

- `next/image` everywhere with proper `sizes`
- Semantic HTML, proper heading hierarchy
- `prefers-reduced-motion` fallback for all animations
- Lighthouse targets: Performance 90+, Accessibility 95+, LCP < 2.5s

See [ANIMATION-SPEC.md](./ANIMATION-SPEC.md) for motion patterns.
