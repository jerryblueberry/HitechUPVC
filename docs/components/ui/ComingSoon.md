# ComingSoon
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Shared “under development — arriving soon” band for unfinished marketing routes so nav/footer links do not 404.

## Implementation Notes
- File: `components/ui/ComingSoon.tsx`
- Used by `/get-quote`, `/gallery`, `/about`
- First band: `section-padding page-top`
- Quote/WhatsApp/products CTAs use live routes
- Pages are `noindex` until the real content ships

## Review Checklist
- [x] No 404 on Get Quote, Gallery, About
- [x] Matches existing inner-page type
