# Contact & Get Quote Pages
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Lead capture via a contact form, WhatsApp/call, plus a single map of all Hi-Tech sites.

## Routes
- `app/(marketing)/contact/page.tsx` — live
- `app/(marketing)/get-quote/page.tsx` — coming-soon placeholder (multi-step form still backlog)

## Design Decisions
- Header matches home sections (gold eyebrow, display h1, muted body)
- First section uses `section-padding page-top` so it sits under the nav, not a full section below it
- Desktop: form (7) + reach-us / sites (5); map full width below
- Mobile: Reach us + stacked sites first (tap to call), then form, then map. No horizontal overflow.
- Form is client-only: inline validation on blur + submit, dummy 700ms success (no backend)
- Each site has its own Google Maps embed iframe (no API key). Tapping a site swaps the iframe.
- WhatsApp uses `company.contact.whatsapp`
- Call numbers from `company.contact.phones` (`+977 985-1033536`, `+977 981-0058285`)

## Form fields
Name, email, optional phone, interest, message. Errors sit under the field (`aria-invalid` + `aria-describedby`).

## Review Checklist
- [x] WhatsApp link uses company data
- [x] Three markers on one map
- [x] Form labels, focus rings, inline errors, success state
- [x] Get Quote coming-soon page live (multi-step form still outstanding)
