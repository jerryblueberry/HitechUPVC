# Home Page
Status: done
Owner: agent
Last reviewed: —

## Purpose
Primary landing page positioning Premium UPVC as a premium manufacturer. Converts visitors via quote CTA and product exploration.

## Sections (top to bottom)
1. Hero — see [Hero.md](../components/home/Hero.md)
2. USPStrip — see [USPStrip.md](../components/home/USPStrip.md)
3. ProductCategoryShowcase
4. OpeningTypesExplainer
5. Why UPVC comparison (inline or link to /why-upvc)
6. BeforeAfterSlider
7. ProcessTimeline
8. TestimonialsMarquee
9. StatsCounter
10. Gallery teaser
11. CTASection
12. Footer (layout)

## Route
`app/(marketing)/page.tsx`

## Data Sources
- `company.json` — stats, hero copy
- `navigation.json`
- `testimonials.json`
- `projects.json` — gallery teaser
- `windows.json` / `doors.json` / `panels.json` — category showcase

## SEO
- Title: "Premium UPVC | Windows, Doors & Panels"
- Meta description: energy efficiency, security, warranty focus

## Review Checklist
- [ ] All sections use section-padding and container-content
- [ ] Page loads with server components where possible
- [ ] Each section doc marked done
