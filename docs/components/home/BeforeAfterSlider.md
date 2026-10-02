# BeforeAfterSlider
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Draggable before/after comparison slider for renovation showcase — home and
`/why-upvc`.

## Design Decisions
- Matches USP / testimonials header: gold eyebrow, display clamp heading,
  supporting sentence, charcoal type on warm `bg-surface` with a soft radial wash
  (replaces flat `surface-muted`)
- Full `container-content` width so the image lines up with the section title
- Aspect: `5/4` phone → `16/10` tablet → `21/10` desktop; radius scales with width
- Handle and reveal share one `useMotionValue` — no Framer `drag="x"`
- Drawn SVG drag glyph (not ↔); Before / After chips stay readable on the photo
- Keyboard arrows / Home / End; `touch-none` so the page does not scroll while dragging

## Animation Spec
Pointer 1:1 with the finger. Reduced motion: still interactive, no extra easing.
RevealOnScroll on heading + frame.

## Implementation Notes
- File: `components/home/BeforeAfterSlider.tsx`
- Client component
- Images from `lib/images.ts` → `IMAGES.beforeAfter`

## Review Checklist
- [x] Handle and clipped image stay aligned while dragging
- [x] Image width matches title / container margins
- [x] Premium header + supporting copy; responsive aspect / type
- [x] Touch drag works on mobile
- [x] Keyboard operable
- [x] Matches DESIGN-SYSTEM tokens (surface, charcoal, gold)
