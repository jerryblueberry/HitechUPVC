# ContactForm
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Contact “send a message” form. Validates inline; success is a dummy preview (no backend).

## Validation
- Name required, ≥ 2 characters
- Email required, basic `name@domain` shape
- Phone optional; if present, 7–20 digit/separator characters
- Interest required
- Message required, ≥ 12 characters
- Errors after blur or submit; first invalid field is focused

## Implementation Notes
- File: `components/ui/ContactForm.tsx`
- Page shell: `components/ui/ContactExperience.tsx`
- Mobile: full-width submit, 16px inputs (no iOS zoom), stacked fields
