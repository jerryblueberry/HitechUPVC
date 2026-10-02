# Footer
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Site footer with nav links, contact info, socials, and certification badges.

## Design Decisions
- Dark section: `bg-navy text-surface`
- Multi-column layout on desktop, stacked on mobile
- Gold accent on link hovers
- Bottom bar: copyright, “Made with love in Nepal”, socials
- Social links show a platform icon beside the label (Instagram glyph)

## Props / Data
- `navigation.json`, `company.json`

## Implementation Notes
- File: `components/layout/Footer.tsx`
- Server component

## Review Checklist
- [x] Matches DESIGN-SYSTEM tokens
- [x] Uses getData() not inline JSON
- [x] Semantic `<footer>` structure
- [x] Instagram social link includes icon
