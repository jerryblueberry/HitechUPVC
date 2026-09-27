# Footer
Status: done
Owner: agent
Last reviewed: —

## Purpose
Site footer with nav links, contact info, socials, and certification badges.

## Design Decisions
- Dark section: `bg-navy text-surface`
- Multi-column layout on desktop, stacked on mobile
- Gold accent on link hovers
- Bottom bar: copyright, “Made with love in Nepal”, socials

## Props / Data
- `navigation.json`, `company.json`

## Implementation Notes
- File: `components/layout/Footer.tsx`
- Server component

## Review Checklist
- [ ] Matches DESIGN-SYSTEM tokens
- [ ] Uses getData() not inline JSON
- [ ] Semantic `<footer>` structure
