# Contact & Get Quote Pages
Status: planned
Owner: agent
Last reviewed: —

## Purpose
Lead capture via multi-step quote form and direct contact. UPVC buyers often prefer WhatsApp/call.

## Routes
- `app/(marketing)/contact/page.tsx`
- `app/(marketing)/get-quote/page.tsx`

## Design Decisions
- Multi-step form: product type → dimensions → color → contact info
- Animated step transitions between steps
- Map embed for showroom/branches
- Floating WhatsApp button with pulse animation
- Contact page: simpler form + phone/email/WhatsApp links

## Data Sources
- `company.json` — addresses, phone, WhatsApp, email

## Animation Spec
Step transitions: `AnimatePresence` + slide/fade between steps

## Review Checklist
- [ ] Form accessible (labels, focus states)
- [ ] WhatsApp link uses company data
- [ ] No form submission backend yet — UI only or mailto placeholder
