# Folder Structure

Canonical paths for the Premium UPVC frontend. Do not invent alternate locations.

```
frontend/
  app/
    (marketing)/
      page.tsx                      → Home (/)
      products/page.tsx             → Products overview
      products/windows/page.tsx
      products/windows/[slug]/page.tsx
      products/doors/page.tsx
      products/doors/[slug]/page.tsx
      products/panels/page.tsx
      products/panels/[slug]/page.tsx
      gallery/page.tsx
      about/page.tsx
      why-upvc/page.tsx
      contact/page.tsx
      get-quote/page.tsx
    layout.tsx
    template.tsx                    → Page transitions
    globals.css                     → Design tokens (@theme)

  components/
    layout/                         → Header, Footer, MegaMenu, MobileNav
    home/                           → Home page sections
    why/                            → Why uPVC page sections
    products/                       → Product listing & detail
    gallery/                        → GalleryView, GalleryCard, GalleryLightbox
    ui/                             → Reusable wrappers (AnimatedText, etc.)
    animations/                     → OpeningTypeDemo, shared motion
    three/                          → Real-time 3D (ADR 006) — see components/three/README.md

  data/                             → Static JSON (CMS-ready shapes)
  lib/                              → types.ts, getData.ts, constants.ts, schemas.ts, upvc3d.ts
  public/images/                    → windows/, doors/, panels/, gallery/, team/
  public/hdri/                      → CC0 Poly Haven studio HDRI for 3D lighting
  docs/                             → This documentation tree
  .cursor/rules/                    → Cursor agent rules
```

## 3D Code

`three` and `@react-three/*` may only be imported from `components/three/`. Every
other module reaches 3D through the `Lazy*` entry points, which are `next/dynamic`
with `ssr: false`. Model specs live in `lib/upvc3d.ts`, which imports no three.js so
it stays safe to read from server components.

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase file + export | `ProductCard.tsx` |
| Pages | `page.tsx` in route folder | `app/(marketing)/about/page.tsx` |
| JSON data | kebab or plural nouns | `windows.json`, `navigation.json` |
| Images | kebab-case, category prefix | `tilt-turn-hero.jpg` |
| Docs | PascalCase or kebab | `Hero.md`, `contact-get-quote.md` |
| Types | PascalCase interfaces | `Product`, `OpeningType` |

## Route Group

`(marketing)` is a route group — it does **not** appear in URLs. `/about` not `/marketing/about`.

## Import Aliases

Use `@/` prefix (configured in tsconfig):

```typescript
import { getWindows } from "@/lib/getData";
import { Header } from "@/components/layout/Header";
```

## Adding New Files

1. Check this doc for the correct folder
2. Create or update the matching doc in `docs/components/` or `docs/pages/`
3. Add entry to TRACKING.md backlog if not already listed
