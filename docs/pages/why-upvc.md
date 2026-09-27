# Why UPVC Page
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Convince homeowners, builders, and architects in Nepal that uPVC is a smarter choice than wood, aluminium, or local frames — especially for Kathmandu dust, noise, monsoon, and temperature swings. SEO landing page for “uPVC Kathmandu / uPVC windows Nepal”.

## Route
`app/(marketing)/why-upvc/page.tsx`

## Design Decisions
- Same Apple-style language as home: `page-top` first band, gold eyebrow, display headings, white cards with hairline + offset shadow
- Reuse live 3D (casement / french / panels) and existing photography — no new downloaded models
- Comparison as three cards, not a cramped table (a compact HTML table sits underneath for crawlers)
- FAQ is native `<details>` (no JS); FAQPage + BreadcrumbList JSON-LD
- CTAs go to `/contact` and WhatsApp (Get Quote route still 404)

## Sections
1. Hero — copy left, live casement 3D right
2. What is uPVC — same live casement 3D studio as the hero
3. uPVC vs wood / aluminium / local
4. Built for Kathmandu
5. Our solutions (windows, doors, panels)
6. Visual proof — existing before/after + project teaser
7. FAQ
8. CTA

## Data Sources
- `faqs.json` via `getFAQs("why-upvc")`
- `getProjects()`, `getCompany()`
- `lib/images.ts` for photography

## Review Checklist
- [x] Reduced motion: 3D still frames, no autoplay
- [x] Semantic heading hierarchy (one h1)
- [x] Sitemap + metadata + JSON-LD
- [x] Matches DESIGN-SYSTEM tokens
