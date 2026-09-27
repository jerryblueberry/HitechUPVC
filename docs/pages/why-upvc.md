# Why UPVC Page
Status: planned
Owner: agent
Last reviewed: —

## Purpose
Education page comparing UPVC vs wood and aluminum. Scrollytelling layout builds trust and aids SEO.

## Route
`app/(marketing)/why-upvc/page.tsx`

## Design Decisions
- Sticky visual on one side, scrolling text on the other (desktop)
- `useScroll` + `useTransform` for progress-linked visuals
- Mobile: stacked sections, no sticky

## Data Sources
- `faqs.json` — expandable FAQ section at bottom
- Static comparison content in page or dedicated JSON later

## Animation Spec
See [ANIMATION-SPEC.md](../ANIMATION-SPEC.md) — Scrollytelling section

## Review Checklist
- [ ] Reduced motion: static comparison table fallback
- [ ] Semantic heading hierarchy
