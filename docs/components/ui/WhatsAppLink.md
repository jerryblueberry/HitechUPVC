# WhatsAppLink
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Official WhatsApp glyph that opens a chat with the company number (`wa.me`).

## Design Decisions
- Number comes from `company.contact.whatsapp` via `whatsappHref()` — digits only
- Green `#25D366` circle, white glyph; opens in a new tab
- Desktop header (before Get a Quote) and MobileNav drawer — not in the mobile header bar

## Props / Data
- `number: string` — display form, e.g. `+977 981-0058285`

## Implementation Notes
- File: `components/ui/WhatsAppLink.tsx`

## Review Checklist
- [x] Uses getData() / company JSON, not a hardcoded href in the header
- [x] `aria-label` on the icon-only control
