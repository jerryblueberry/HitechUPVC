# StatsCounter
Status: review
Owner: agent
Last reviewed: 2026-09-28

## Purpose
Home proof figures on a navy band: years, installations, cities, satisfaction.

## Design Decisions
- Figures from `company.json`: 10+ years, 1,000+ installations, 48 cities, 98% satisfaction
- Years and installations both use “+”
- Display type at full strength, cream not gold; column hairlines in `surface/15`
- 2×2 on small screens with row/column rules; 4 columns from `lg`
- Left-aligned, not a centered dashboard strip
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
