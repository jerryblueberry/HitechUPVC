# ProcessTimeline
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Visual timeline: Consultation → Measurement → Manufacturing → Installation → Aftercare.

## Design Decisions
- Connected spine: **vertical** on phone/tablet (`lg` down), **horizontal** on
  desktop — markers sit on the line (ring punches through the muted ground)
- Even list gap (`gap-7` / `sm:gap-8`) so marker spacing stays consistent
  regardless of copy length; smaller markers on phone (`h-10`), `h-12` from `sm`
- Header matches USP / transformations: gold eyebrow, display clamp heading,
  short supporting line on `bg-surface-muted`
- Numbered navy markers; copy beside the marker on mobile, centred under it on `lg+`
- Semantic `<ol>` of steps; connectors are decorative (`aria-hidden`)

## Props / Data
- `company.json` → `process` array via page `getData`

## Animation Spec
RevealOnScroll staggered 70ms per step. Reduced motion: static.

## Implementation Notes
- File: `components/home/ProcessTimeline.tsx` (server)

## Review Checklist
- [x] Vertical connector on mobile; horizontal on desktop
- [x] Markers visually sit on the spine
- [x] Responsive type / spacing
- [x] Animations respect prefers-reduced-motion
- [x] Matches DESIGN-SYSTEM tokens
