# BeforeAfterSlider
Status: planned
Owner: agent
Last reviewed: —

## Purpose
Draggable before/after comparison slider for renovation showcase.

## Design Decisions
- Full-width or contained in section
- Drag handle centered, touch-enabled

## Animation Spec
useMotionValue + drag="x" with constraints; see ANIMATION-SPEC.md

## Implementation Notes
- File: `components/home/BeforeAfterSlider.tsx`
- Client component

## Review Checklist
- [ ] Touch drag works on mobile
- [ ] Reduced motion: show side-by-side static
