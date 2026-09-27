# ProcessTimeline
Status: planned
Owner: agent
Last reviewed: —

## Purpose
Visual timeline: Consultation → Measurement → Manufacturing → Installation → Aftercare.

## Design Decisions
- Horizontal on desktop, vertical on mobile
- Line-draw animation on scroll into view

## Props / Data
- Static steps in component or company.json process array

## Animation Spec
SVG path draw or staggered step reveal on whileInView

## Implementation Notes
- File: `components/home/ProcessTimeline.tsx`

## Review Checklist
- [ ] Responsive layout switch
- [ ] Animations respect prefers-reduced-motion
