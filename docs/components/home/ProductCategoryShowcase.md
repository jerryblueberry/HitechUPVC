# ProductCategoryShowcase
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Three cards linking to Windows, Doors, and Panels, each with a live parametric 3D model instead of a photo.

## Design Decisions
- Header matches USPStrip: gold eyebrow, display h2, charcoal/60 paragraph
- White `rounded-3xl` cards with an inner radial "studio" panel (`aspect-[4/3.6]`) holding the model
- Windows: casement `LazyUpvcViewer`; Doors: french `LazyUpvcViewer`; Panels: `LazyUpvcPanelViewer` (golden-oak board stack)
- Hover/focus opens the unit (panels fan out); touch devices autoplay instead (`useCanHover`)
- Mobile: horizontal snap scroller with next-card peek (`w-[84%]`, `sm:w-[60%]`); `md+`: 3-column grid
- No top padding: follows USPStrip on the same `bg-surface`

## Props / Data
- `counts: Record<ProductCategory, number>` — passed from the page via `getWindows/getDoors/getPanels`

## Animation Spec
Damped `open` progress inside the 3D viewers; no CSS zoom.

## Implementation Notes
- File: `components/home/ProductCategoryShowcase.tsx`
- Panel model: `components/three/UpvcPanelViewer.tsx` (CSS board-stack fallback when WebGL/reduced motion is unavailable)

## Review Checklist
- [x] Matches DESIGN-SYSTEM tokens
- [x] Reduced-motion and no-WebGL fallbacks (via `UpvcStage` posters / CSS stack)
- [x] Verified desktop grid (3 equal cards) and mobile snap scroller
