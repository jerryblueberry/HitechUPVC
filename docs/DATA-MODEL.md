# Data Model

Static JSON shapes designed to match future CMS API responses. Components consume data only via `lib/getData.ts`.

## Files

| File | Type | Getter |
|------|------|--------|
| `company.json` | `Company` | `getCompany()` — includes `logo`, `phones`, `emails` |
| `navigation.json` | `Navigation` | `getNavigation()` |
| `windows.json` | `Product[]` | `getWindows()` |
| `doors.json` | `Product[]` | `getDoors()` |
| `panels.json` | `Product[]` | `getPanels()` |
| `products.json` | `ProductIndexEntry[]` | `getProducts()` |
| `colors.json` | `ColorSwatch[]` | `getColors()` |
| `testimonials.json` | `Testimonial[]` | `getTestimonials()` |
| `faqs.json` | `FAQ[]` | `getFAQs(category?)` |
| `projects.json` | `Project[]` | `getProjects()` |
| `team.json` | `TeamMember[]` | `getTeam()` |

## Product Shape

```json
{
  "slug": "tilt-turn-classic",
  "category": "windows",
  "name": "Tilt & Turn Classic",
  "shortDescription": "...",
  "openingType": "tilt-turn",
  "heroImage": "/images/windows/tilt-turn-hero.jpg",
  "galleryImages": ["..."],
  "profileSystem": "70mm 5-chamber",
  "glazingOptions": ["Double", "Triple"],
  "colors": ["white", "anthracite-grey"],
  "features": ["..."],
  "uValue": "1.1 W/m²K",
  "warranty": "10 years",
  "specs": { "frameDepth": "70mm", "chambers": 5 },
  "badges": ["Best Seller"],
  "priceFrom": "optional"
}
```

## Opening Types

`sliding` | `casement` | `tilt-turn` | `folding` | `french` | `hinged` | `fixed`

Labels in `lib/constants.ts` → `OPENING_TYPE_LABELS`.

## CMS Migration

When swapping to Sanity/Strapi/Contentful:

1. Implement API fetchers in `lib/getData.ts` with same return types
2. Keep `lib/types.ts` unchanged
3. Components require zero changes

## Validation

Zod schemas in `lib/schemas.ts` validate JSON at build time. Run validation in `getData.ts` or a build script.

## Rules

- Field names use camelCase
- Slugs are kebab-case, unique per category
- Image paths start with `/images/`
- Never import JSON directly in components
