# ProductCategoryShowcase
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Three product tiles linking to Windows, Doors, and Panels, each with a live 3D model.

## Design Decisions
- Apple-style modules: tall studio (`aspect-[3/4]`, `rounded-[2rem]`), caption **under** the model — no nested white card
- Studio chrome matches USP/contact: white field, hairline `ring-charcoal/5`, layered offset shadow, lift on hover — not a bright hotspot or scale-up
- Quiet vertical showroom wash (cream → white → taupe tokens) so the unit sits in the same warm-neutral world as the hero
- Windows: casement; Doors: french; Panels: fluted woodgrain slat wall
- Header is `justify-between` in `container-content` so the CTA’s right edge matches Get a Quote in the site header
- “Explore our products” uses `MagneticButton` (charcoal pill, magnetic hover, tap scale) → `/products`
- Hover/focus opens the unit; touch autoplays (`useCanHover`)
- No overlay pills on the 3D — the tile itself is the link; caption under the model keeps “Explore …”
- Mobile: snap scroller; `md+`: 3 columns with wide gutters

## Props / Data
- `counts: Record<ProductCategory, number>`

## Implementation Notes
- File: `components/home/ProductCategoryShowcase.tsx`
- Panel model: `components/three/UpvcPanelViewer.tsx`

## Review Checklist
- [x] Matches DESIGN-SYSTEM tokens
- [x] Reduced-motion / no-WebGL fallbacks
- [x] Panels are a fluted woodgrain slat wall, not weatherboard or a window photo
- [x] Tile studio matches USP/contact chrome (hairline, offset shadow, lift — no hotspot)
- [x] Header CTA “Explore our products” aligns with Get a Quote; magnetic + chevron motion
- [x] No Explore windows/doors overlay on the 3D tiles
