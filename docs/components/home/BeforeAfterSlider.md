# BeforeAfterSlider
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Draggable before/after comparison slider for renovation showcase.

## Design Decisions
- Full `container-content` width so the image lines up with the section title
- Handle and reveal share one `useMotionValue` — no Framer `drag="x"` (that stacked a transform on `left` and desynced the split)
- Pointer capture on the whole frame; keyboard arrows / Home / End
- `touch-none` so the page does not scroll while dragging

## Animation Spec
Pointer 1:1 with the finger. Reduced motion: still interactive, no extra easing.

## Implementation Notes
- File: `components/home/BeforeAfterSlider.tsx`
- Client component
- Used on home and `/why-upvc`

## Review Checklist
- [x] Handle and clipped image stay aligned while dragging
- [x] Image width matches title / container margins
- [x] Touch drag works on mobile
- [x] Keyboard operable
