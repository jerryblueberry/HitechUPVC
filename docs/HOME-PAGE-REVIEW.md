# Home Page Review — Hi-Tech uPVC

**Status:** current-state audit (for external model / design review)  
**Route:** `/` → `app/(marketing)/page.tsx`  
**Company:** Hi-Tech uPVC Profile Industries (Nepal — manufacturer, not a generic importer)  
**Last reviewed:** 2026-10-20  

Use this document as a brief when asking another model (or a designer) to critique animation, content flow, adaptive layout, and premium company positioning. It describes **what ships today**, not an aspirational redesign.

---

## 1. How to use this brief

Ask reviewers to evaluate against:

1. **Premium manufacturer feel** — does the page read as a factory / fitted-product brand in Kathmandu, or as a template landing page?
2. **Motion quality** — is animation smooth, purposeful, and consistent (`[0.22, 1, 0.36, 1]`), or noisy / sticky / half-finished?
3. **Content clarity** — can a homeowner or architect understand products → proof → next step without scrolling confusion?
4. **Adaptive behaviour** — phone (≈390), tablet, laptop (~1000–1280), wide desktop; touch vs hover; reduced motion; no-WebGL.
5. **Performance vs spectacle** — two heavy WebGL moments (hero + scroll door); are they earned, and does the rest of the page stay light?

Repo references: `docs/ANIMATION-SPEC.md`, `docs/DESIGN-SYSTEM.md` (if present), `docs/components/home/*.md`, `data/company.json`.

---

## 2. Brand & visual system (incumbent)

| Token / element | Value / role |
|-----------------|--------------|
| Surface | `#f7f6f3` — default page ground |
| Surface muted | `#e7e4df` — testimonials band |
| Charcoal | `#1b1b1d` — primary type |
| Navy | `#0e2a3e` — CTA closing band (stats no longer use this) |
| Gold | `#b69a6b` — eyebrows, accents, progress |
| Display type | Fraunces (`font-display`) |
| Body type | Inter / sans stack |
| Easing | `--ease-premium: cubic-bezier(0.22, 1, 0.36, 1)` |
| Layout helpers | `.section-padding`, `.container-content`, `.eyebrow` |

**Design direction in practice:** warm off-white studio, serif headlines, restrained gold labels, hairline rules over card grids where recently refined (USP, stats). Live parametric 3D (React Three Fiber) for product storytelling. Dark mode is intentionally out of scope.

---

## 3. Stack relevant to the home page

- **Next.js** App Router (marketing layout + home server component compose)
- **Framer Motion** — reveals, captions, counters, carousel copy, before/after
- **React Three Fiber / drei / three** — hero carousel, scroll door, category tiles, opening-type demo
- **Data** — JSON via `lib/getData.ts` (`company`, products, projects, testimonials)
- **Motion utilities** — `RevealOnScroll`, `PremiumText`, `AnimatedCounter`, `MagneticButton`

Global motion rules: short entrances (~0.55s), stagger 0.05–0.11s, respect `prefers-reduced-motion`, avoid scroll-driven React re-renders in the door sequence (progress in a **ref**, read in `useFrame`).

---

## 4. Actual section order (source of truth)

Composition in `page.tsx` today:

| # | Section | Component | Surface / role |
|---|---------|-----------|----------------|
| 1 | Hero + doorway intro | `Hero` | Surface studio; 3D carousel |
| 2 | Scroll door story | `ScrollDoorSequence` | Pinned 3D + caption beats |
| 3 | Why Hi-Tech (USPs) | `USPStrip` | Ruled spec row (no cards) |
| 4 | Product categories | `ProductCategoryShowcase` | 3D tiles → windows / doors / panels |
| 5 | Opening types | `OpeningTypesExplainer` | Tabbed 3D open/shut demo |
| 6 | Before / after | `BeforeAfterSlider` | Drag comparison |
| 7 | Process | `ProcessTimeline` | 5 steps, spine layout |
| 8 | Testimonials | `TestimonialsMarquee` | `bg-surface-muted` |
| 9 | Company figures | `StatsCounter` | Surface + hairline grid (was navy) |
| 10 | Gallery teaser | `GalleryTeaser` | Real Cloudinary install photos |
| 11 | Closing CTA | `CTASection` | Solid navy band |
| — | Footer | marketing layout | Nav, contact, certifications |

**Note:** `docs/pages/home.md` is stale (order and SEO title do not match the live page). Prefer this review + `page.tsx`.

**Not mounted on home (still in repo):** `HeroCarousel`, `CurtainWindowReveal`, `ScrollStorySection`, `ColorFinishes`.

---

## 5. Section-by-section review

### 5.1 Hero (`Hero.tsx`)

**What it does**  
Optional session doorway intro (French doors open, walk-through), then a two-column product carousel: copy + chips + CTAs, live 3D unit that opens/shuts per slide (French, Sliding, Tilt & Turn, Casement, Bi-Fold). Poster WebP stills for LCP / no-WebGL. Prefetch warms door-section chunk + HDRI.

**Animation**  
Intro once per session; skip on click / reduced motion / no WebGL. Carousel: ~7s autoplay, open ~0.7s / shut ~4.6s after compile; chip progress bar; pause on hover/touch; copy crossfade on slide change. Easing premium.

**Responsive**  
Desktop: copy left, stage right. Mobile: vertical stack, swipe stage, snap chips.

**Strengths**  
- Strong brand-first product presence; matches manufacturer (real systems, not stock lifestyle only).  
- Poster-first + eager stage improves perceived load.  
- Accessible carousel patterns (tabs, labelled controls).

**Gaps / risks**  
- Heavy: intro canvas + hero WebGL + later door WebGL — phone CPU cost.  
- Hidden `h1` from `company.hero.headline` vs visible slide headlines — SEO/a11y hierarchy worth a second look.  
- Company name/location story is light in the first viewport (product-first, Nepal context later).

---

### 5.2 Scroll door sequence (`ScrollDoorSequence.tsx` + `UpvcScrollScene.tsx`)

**What it does**  
Pinned scrollytelling: camera starts on hardware, door opens, orbits, settles on elevation. Three caption beats. Desktop vs mobile shot sets. Poster stills until scene ready.

**Animation**  
- Scroll → ref → damp (λ=18) → Catmull-Rom camera + glide (no hard stop at keys).  
- Door open 0.18→0.68 of progress.  
- Captions: beat index + hysteresis; timed `AnimatePresence` (word mask, blur settle); not scrubbed opacity.  
- Optional mouse parallax on hover devices.  
- Reduced motion: static prose section.

**Responsive**  
Pin height 260–320vh; mobile bottom captions + shorter copy; desktop left scrim.

**Strengths**  
- Most “premium product page” moment on the site; motion system is intentional and documented.  
- Performance-aware (ref-driven, DPR step-down, prefetch).

**Gaps / risks**  
- Long pin can feel like work on short phones / trackpads.  
- Story is product-generic (hardware / opening / doorway) — little Nepal / Hi-Tech factory narrative.  
- `ANIMATION-SPEC.md` still partly describes older caption fade behaviour — docs drift.

---

### 5.3 USP strip (`USPStrip.tsx`) — recent revamp

**What it does**  
“Why Hi-Tech uPVC” — Energy Efficiency (1.1 W/m²K), Security, Low Maintenance, Warranty (10 years). Ruled hairline grid; no white cards / icons / hover lift.

**Animation**  
`RevealOnScroll` on stacked layouts; desktop shared-row grid without motion wrappers (`display: contents` incompatible with Framer transforms).

**Responsive**  
1 → 2 → 4 columns; desktop titles / figures / descriptions share rows for alignment.

**Strengths**  
- Cleaner, more editorial; matches “spec sheet” premium feel.  
- Aligns with stats section language.

**Gaps / risks**  
- Two columns without figures can feel empty vs 1.1 / 10.  
- Claims (U-value, warranty years) need ongoing factual ownership.  
- Eyebrow + heading pattern repeats every section — risk of monotony.

---

### 5.4 Product category showcase

**What it does**  
Three tall studio tiles (windows / doors / panels) with live 3D; caption under; Magnetic “Explore our products”.

**Animation**  
Reveal stagger; hover opens unit (autoplay on touch); magnetic CTA.

**Responsive**  
Mobile snap scroller; `md+` three columns.

**Strengths**  
- Clear IA into catalogue; 3D reinforces “we make systems”.  
- Studio chrome consistent with premium tiles.

**Gaps / risks**  
- Fourth WebGL surface on the page (after hero + door + this + opening explainer) — cumulative cost.  
- Still “module tiles”; watch against card fatigue after USP moved off cards.

---

### 5.5 Opening types explainer

**What it does**  
Tabs for mechanisms; one `UpvcViewer` loops open/shut; short “what it’s for” copy.

**Animation**  
Auto-play open cycle (~7s); tab copy `AnimatePresence` crossfade; shallow orbit.

**Responsive**  
Single viewer all breakpoints (fixed prior dual-WebGL bug); aspect ratio steps.

**Strengths**  
- Educational; differentiates manufacturer expertise.  
- One WebGL context — correct engineering choice.

**Gaps / risks**  
- Section can feel long after two 3D stories already; consider shortening or linking deeper content to `/products` / `/why-upvc`.

---

### 5.6 Before / after slider

**What it does**  
Drag handle compare tired opening vs sealed install.

**Animation**  
Shared motion value for clip + handle; no redundant drag transforms.

**Gaps / risks**  
- Image authenticity vs stock; Nepal-specific “after” would strengthen company truth.  
- Placement after two 3D demos — cognitive load.

---

### 5.7 Process timeline

**What it does**  
Five steps: consultation → measurement → manufacturing → installation → aftercare. Vertical spine mobile; horizontal spine desktop.

**Animation**  
Reveal stagger; numbered markers.

**Strengths**  
- Strong company / ops story (measured, made, fitted).  
- Layout is non-cardy and clear.

**Gaps / risks**  
- Copy is short; could name Tarakeshwar factory / local install more explicitly for SEO and trust.

---

### 5.8 Testimonials

**What it does**  
Featured + stack (desktop); snap carousel (mobile). Kathmandu-valley framing.

**Surface**  
`bg-surface-muted` — only mid-page band that breaks pure surface (besides navy CTA).

**Gaps / risks**  
- Cards return here — intentional for quotes, but denser than USP/stats.  
- Verify quotes/locations are approved real customers.

---

### 5.9 Stats counter — recent revamp

**What it does**  
10+ years, 1,000+ installations, 48 cities, 98% satisfaction. Surface + hairline grid (navy band removed).

**Animation**  
`AnimatedCounter` on stacked layouts; desktop aligned figure/label rows without scroll wrappers.

**Strengths**  
- Visually consistent with USP; less “banner ad” navy block.  
- Left-aligned, not dashboard-centered.

**Gaps / risks**  
- Back-to-back with testimonials then gallery — three “proof” beats; may want a single proof chapter.  
- Navy CTA still uses the old contrast language — intentional closer, or another surface pass?

---

### 5.10 Gallery teaser — recent revamp

**What it does**  
Three real installs (Cloudinary): House elevation, Terrace doors, Rooftop canopy. Section blurb under “Completed projects”; no fake neighbourhood lines on teaser. Links to `/gallery`.

**Animation**  
Reveal + image scale hover; gallery cards share soft ring/shadow language.

**Strengths**  
- Real photos improve company authenticity vs Unsplash placeholders.  
- SEO-friendly section description.

**Gaps / risks**  
- Mixed portrait/landscape aspect handling is clever but fragile; titles-only may under-explain for SEO.  
- Full gallery still has mixed stock + real assets.

---

### 5.11 CTA section

**What it does**  
Navy closer: quote + contact / WhatsApp. Magnetic pills. Reused site-wide.

**Strengths**  
- Clear conversion end.  
- High contrast after light page.

**Gaps / risks**  
- Only remaining full navy band after stats lightened — either keep as intentional “period” or soften for continuity.  
- Docs still say “same family as StatsCounter” — outdated.

---

## 6. Cross-cutting animation assessment

| Pattern | Where | Smoothness notes |
|---------|--------|------------------|
| Premium ease `[0.22,1,0.36,1]` | Most Framer work | Consistent language |
| `RevealOnScroll` | Many sections | Same fade+Y everywhere — can feel repetitive |
| Word / caption choreography | Door sequence, PremiumText | Higher craft; door is the reference |
| Scroll-scrubbed 3D | Door only | Damped, spline camera — strong |
| Carousel open/shut | Hero, opening explainer | Product-led; good if compile wait is respected |
| Counters | Stats (+ USP figures) | Fine; desktop stats skip reveal wrappers |
| Reduced motion | Hero skip intro, door static prose, etc. | Present; uneven depth per section |

**Smoothness opportunities (for next reviewers)**  
1. Unify section entrances (vary delay / distance, or drop reveal on ruled grids).  
2. Keep **one** cinematic 3D pin (door) and demote other WebGL to hover/idle or static posters on low-end.  
3. Sync `ANIMATION-SPEC.md` with door caption + stats/USP reality.  
4. Prefer time-based caption reveals over scroll-scrubbed text anywhere remaining.  
5. Ensure every hover lift has a reduced-motion static equivalent.

---

## 7. Content & information architecture

**Story arc today**

1. See the product move (hero)  
2. Feel the product open (door scroll)  
3. Spec claims (USP)  
4. Choose category (showcase)  
5. Learn mechanisms (opening types)  
6. See transformation (before/after)  
7. Trust process + people + numbers + photos  
8. Convert (CTA)

**Works**  
Product-led manufacturer narrative; clear CTAs to quote / products / gallery / WhatsApp.

**Weaker for “company based” Nepal brand**  
- Factory / three locations / “made in Tarakeshwar” appear late or only in footer.  
- Little bilingual or local-climate framing on home (stronger on `/why-upvc`).  
- Hero company headline vs slide titles underused.  
- Proof cluster (testimonials → stats → gallery) could be tightened into one chapter with one heading.

---

## 8. Adaptive / responsive checklist (current)

| Concern | Current approach | Review ask |
|---------|------------------|------------|
| Phone | Snap carousels, shorter door pin, mobile shots, bottom captions | Is door pin still too long? |
| Tablet | 2-col USP/stats; product snap → grid | Mid-width 3D DPR / layout |
| Desktop | Shared-row USP/stats; left door captions | Alignment at ~1000–1100 before `lg`/`xl` |
| Touch | Autoplay open; no mouse parallax | Confirm no scroll hijack on canvases (`pointer-events-none` door) |
| Reduced motion | Intro skip, static door prose, counters final | Spot-check every section |
| No WebGL | Posters / PNG cutouts | Visual quality of fallbacks |
| Safe areas | Door captions use safe-area inset | Gallery/CTA thumbs |

---

## 9. Premium feel — summary score (subjective)

| Dimension | Score (1–5) | Comment |
|-----------|-------------|---------|
| Visual craft (type, colour, space) | 4 | Strong tokens; ruled USP/stats improve vs cards |
| Motion craft | 4 | Door + hero are high; page-wide reveal is average |
| Product truth (3D / real photos) | 4.5 | Differentiator if performance holds |
| Company / place truth | 3 | Process + testimonials help; factory underplayed on home |
| Content pacing | 3 | Long page; many similar section headers |
| Adaptive polish | 4 | Thoughtful breakpoints; dual WebGL cost remains |
| Conversion clarity | 4 | Quote CTAs repeated; navy closer clear |

---

## 10. Known inconsistencies / doc debt

- `docs/pages/home.md` — wrong section order; SEO title “Premium UPVC…” vs live Hi-Tech metadata.  
- `docs/ANIMATION-SPEC.md` — door captions / GSAP ScrollStorySection partly outdated.  
- `CTASection.md` — still ties navy to StatsCounter.  
- Unused home components still in tree (`HeroCarousel`, `CurtainWindowReveal`, etc.).  
- Gallery data mix of real Cloudinary + leftover Unsplash assets beyond the teaser three.

---

## 11. Suggested prompts for other models

Copy one or more:

**A — Motion & smoothness**  
> Using `docs/HOME-PAGE-REVIEW.md`, propose a smoother, more consistent motion system for the Hi-Tech uPVC home page. Preserve premium easing `[0.22,1,0.36,1]` and reduced-motion rules. Prioritise scroll door + hero; reduce noise elsewhere. Give concrete per-section changes.

**B — Adaptive layout**  
> Critique responsive behaviour of each home section at 390 / 768 / 1024 / 1440. Flag pin height, 3D DPR, caption collisions, and mid-breakpoint divider bugs. Prefer the ruled USP/stats pattern over card grids.

**C — Company & content**  
> Rewrite the home narrative so Hi-Tech reads as a Nepal manufacturer (factory, install, climate) without losing the premium product-led opening. Suggest section cuts or merges for a shorter, clearer scroll.

**D — Performance budget**  
> With up to four WebGL moments on one page, propose a device-tier policy: what mounts when, what becomes poster-only, and how to keep LCP and scroll FPS healthy on mid Android phones.

**E — Design QA**  
> Audit against premium manufacturer sites (not SaaS dashboards). Call out remaining cardy patterns, eyebrow fatigue, navy/surface inconsistency, and gallery authenticity gaps.

---

## 12. File map (quick)

```
app/(marketing)/page.tsx          # compose only
components/home/*.tsx             # sections
components/three/*                # WebGL stages
components/ui/RevealOnScroll.tsx  # default entrance
data/company.json                 # usps, stats, process, hero CTAs
data/projects.json                # gallery teaser
docs/ANIMATION-SPEC.md
docs/components/home/*.md
docs/HOME-PAGE-REVIEW.md          # this file
```

---

## 13. Verdict (one paragraph)

The home page is a **product-spectacle manufacturer site**: strong 3D storytelling (hero + scroll door), a warming visual system (surface, Fraunces, gold), and recent clean-ups that replace cardy USP/stats with ruled typography and real gallery photos. It already feels more premium than a stock uPVC template. The main gaps for the next review pass are **pacing** (too many similar sections and WebGL beats), **company/place truth early in the scroll**, **doc/spec drift**, and **motion monotony** outside the door sequence. Treat the door caption + spline camera and the USP/stats hairline grids as the motion/layout north stars when refining the rest.
