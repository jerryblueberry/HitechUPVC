# Home Redesign Plan

**Status:** in progress  
**Source:** External review of `HOME-PAGE-REVIEW.md` (2026-10-20)  
**North star:** One unforgettable moment (scroll door), then calm typography and photography.

---

## Principles

1. **Keep** scroll door as the signature cinematic beat.
2. **Keep, lighter** hero carousel (poster-first; live 3D by tier).
3. **Demote** category tiles and opening-types to poster / hover / on-demand.
4. **Shorten** the page: merge proof, cut stock before/after from home, fold opening education.
5. **Surface company truth** early (Kathmandu / Tarakeshwar / warranty).
6. **Navy only** as the closing CTA “full stop”.
7. **Eyebrows** on at most four sections.

---

## Device-tier WebGL policy

| Tier | Signals | Live 3D |
|------|---------|---------|
| High | `hover: hover`, not saveData, memory ≥ 4 GB | Hero, door, category on hover, opening types on approach |
| Mid | Touch, otherwise unconstrained | Hero + door; category / opening types poster until interaction |
| Low | saveData, memory &lt; 4, slow-2g/2g, no WebGL, reduced motion | Posters only |

Rules:

- Never keep four WebGL contexts alive.
- Secondary viewers (category, opening types) mount only when allowed by tier + interaction/approach.
- Door remains the only full-screen scroll-driven canvas on mid/high.

Implementation: `components/three/quality.ts` (`allowsPrimaryLive3d`, `allowsSecondaryLive3d`).

---

## Motion vocabulary (three tokens)

| Token | Use |
|-------|-----|
| Reveal | opacity + 16px Y, 0.55s — body blocks |
| Mask | overflow-hidden word rise — headlines (door captions) |
| Draw | hairline `scaleX` 0→1 — ruled USP / stats |

Do not animate every section. Stagger by reading order (0 / 0.08 / 0.16 / 0.24). Hover: image scale ~1.03 or underline — not card lifts everywhere.

CSS: `--motion-reveal-*` in `globals.css`. `RevealOnScroll` uses 16px Y.

---

## Target home order

1. Hero (+ visible company identity line)
2. Scroll door (+ one factory / Nepal caption beat)
3. USP ruled strip
4. Products (3 categories, poster-first)
5. Opening types (compact, demoted WebGL)
6. Factory & process (timeline + Tarakeshwar copy)
7. Proof chapter (testimonials + stats + gallery, one heading)
8. Closing CTA (navy)

**Removed from home:** `BeforeAfterSlider` (keep component for case studies / Why uPVC when real Nepal pairs exist).

---

## Eyebrow budget (max 4)

1. Hero / product chips (slide eyebrow)  
2. Why Hi-Tech uPVC (USP)  
3. Our Products  
4. Proof (chapter)  

No eyebrow on: opening types (headline only), process (headline only), CTA.

---

## Implementation checklist

- [x] Plan doc
- [x] Device-tier helpers + secondary WebGL demotion
- [x] Category tiles poster-first
- [x] Opening types demoted
- [x] Proof chapter merge
- [x] Drop before/after from home
- [x] Hero identity + h1
- [x] Door factory beat + shorter phone pin
- [x] Process factory copy
- [x] CTA microcopy
- [x] Motion tokens
- [ ] Lighthouse CI budgets (follow-up)
- [ ] Nepali toggle (follow-up)
- [ ] Mobile sticky WhatsApp/Call bar (follow-up)
- [ ] Delete unused components (follow-up)
- [ ] Gallery Unsplash purge (follow-up)

---

## Out of scope for this pass

Lenis smooth scroll, custom 3D cursor, language toggle, structured data JSON-LD, factory video asset (needs real media), Lighthouse CI wiring.
