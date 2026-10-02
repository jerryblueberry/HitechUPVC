# CTASection
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Closing call to action — quote and contact — reused on home, products, category, and Why uPVC.

## Design Decisions
- Solid navy band (same family as StatsCounter), no pulsing gold blob
- Desktop: headline left, actions right, vertically centred with the copy block
- Mobile / tablet: stacked copy, full-width equal buttons; from `sm` side-by-side with shared min width
- Heading uses a responsive clamp; body stays short so it never spans 90rem
- Primary gold pill → `/get-quote`; secondary ghost on navy; WhatsApp glyph optional
- Magnetic wrappers stretch full-width under `sm` so CTA alignment stays even

## Implementation Notes
- File: `components/home/CTASection.tsx`

## Review Checklist
- [x] Matches DESIGN-SYSTEM tokens
- [x] CTA links to /get-quote on home
- [x] Readable and tappable at 390px and 1280px
- [x] Reduced motion: no decorative animation
- [x] WhatsApp secondary shows the glyph beside the label
