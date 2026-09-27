# StatsCounter
Status: planned
Owner: agent
Last reviewed: —

## Purpose
Animated stat counters: years in business, installations, cities served.

## Props / Data
- `company.json` stats object

## Animation Spec
AnimatedCounter — count up on useInView

## Implementation Notes
- File: `components/home/StatsCounter.tsx`

## Review Checklist
- [ ] Uses company.json stats
- [ ] Reduced motion: show final numbers immediately
