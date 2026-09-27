# BrandLogo
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Site lockup: circular HTD mark + two-line Hi-Tech wordmark.

## Design Decisions
- Mark is `/images/brand/htd-mark.png` (transparent HTD circle from Cloudinary)
- Fixed 44–48px square so it cannot collapse beside the wordmark
- Wordmark keeps “uPVC” casing (not uppercased)
- `next/image` + Cloudinary remote pattern in `next.config.ts`

## Props / Data
- `name`, `src` from `getCompany()`
- `priority` on the sticky header

## Implementation Notes
- File: `components/ui/BrandLogo.tsx`
- Used in Header, Footer, DoorwayIntro

## Review Checklist
- [x] Aligns with header height and nav row
- [x] Same lockup in footer and intro
- [x] Logo URL lives in `data/company.json`
