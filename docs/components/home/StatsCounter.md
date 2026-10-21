# StatsCounter
Status: review
Owner: agent
Last reviewed: 2026-09-28

## Purpose
Home proof figures on the same ruled spec grid as `USPStrip`: years, installations,
cities, satisfaction.

## Design Decisions
- Figures from `company.json`: 10+ years, 1,000+ installations, 48 cities, 98% satisfaction
- Years and installations both use “+”
- `bg-surface`, charcoal display figures, charcoal/70 labels — no navy band
- Hairline dividers (`charcoal/12`); 2×2 below `lg`, shared two-row grid from `lg`
- Desktop grid uses `display: contents` so figures and labels align across columns
- Count-up via `AnimatedCounter` (locale grouping); reduced motion shows the final number

## Props / Data
- `company.json` → `stats`

## Implementation Notes
- File: `components/home/StatsCounter.tsx`

## Review Checklist
- [x] Uses company.json stats
- [x] Reduced motion: show final numbers immediately
- [x] Matches DESIGN-SYSTEM tokens
- [x] Readable at 390px and 1280px
