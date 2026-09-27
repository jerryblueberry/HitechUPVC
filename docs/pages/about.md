# About Page
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Company story, manufacturing process, certifications, and team. Builds trust for B2B and homeowner buyers.

## Route
`app/(marketing)/about/page.tsx`

## Current state
Coming-soon placeholder (`ComingSoon`) so `/about` does not 404. Story/team still backlog.

## Data Sources
- `company.json` — stats, certifications, story
- `team.json`

## Design Decisions
- Placeholder: `page-top`, links to Why uPVC + Contact
- Finished page: alternating image/text, certification badges, team grid

## Review Checklist
- [x] `/about` renders a clean coming-soon page
- [ ] Company stats from JSON
- [ ] Team cards use RevealOnScroll
