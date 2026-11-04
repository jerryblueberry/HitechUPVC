# Performance — home & site

Status: living  
Owner: agent  
Last reviewed: 2026-11-04

## Goal

A Kathmandu phone on Slow 3G / Save-Data should see the **product** within a couple of seconds, not a blank stage waiting on Three.js + HDRI. Fast desktops keep the live WebGL bonus.

| Metric | Target | Notes |
|--------|--------|-------|
| Desktop FCP | &lt; 1.0 s | Production build |
| Mobile FCP | &lt; 1.5 s | Slow 4G / Slow 3G throttle |
| Mobile LCP | &lt; 2.5 s | Hero poster is the LCP candidate |
| Transfer before first interaction (mobile) | &lt; 300–500 KB | Poster + CSS/fonts; not Three.js |
| Live WebGL canvases (mid phone) | 0 on home hero/door | Sequences or posters |
| Live WebGL canvases (high) | ≤ 1 primary at a time | Pause/unmount before stacking |
| HDRI | 1 shared request | 512 on mid/low, 1k on high |

Always measure with `next build && next start`. DevTools + unminified chunks inflate `npm run dev`.

## Architecture (Apple-style home)

```
HTML/CSS → hero poster (fetchPriority=high) → fonts
  → idle: mid/low frame sequences  |  high: Three.js + shared HDRI
  → gallery / Cloudinary (lazy)
```

| Surface | High (hover desktop) | Mid / low |
|---------|----------------------|-----------|
| Doorway intro | Live WebGL (no HDRI) | Live WebGL if not constrained; else skip |
| Hero | Live `UpvcViewer` | Live (same as high); pauses when door claims canvas. **Low:** `hero-*.webm` scrub (~50–90 KB) |
| Scroll door | Live `UpvcScrollScene` | Live when pin approaches. **Low:** `door-*.webm` scroll scrub (~120 KB) |

Rebuild offline assets: capture at `/dev/capture?job=all`, then `npm run encode:sequences`.
| Category / opening types | Live on hover | Posters only |

Sources of truth:

- Tier gates: `components/three/quality.ts`
- Warming: `components/three/warmHome.ts` + `prefetchHdri.ts`
- Sequences: `lib/sequences.ts`, `components/sequence/*`
- Capture studio: `/dev/capture?job=all` (dev only)

## Generate frames

1. `npm run dev` with the capture tab **focused**.
2. Open `/dev/capture?job=all` (or `door-landscape,hero-french,…`).
3. Wait until `window.__capture.done === true`.
4. Commit `public/images/sequences/**` (expect ~1–3 MB total for door + hero sets).
5. Re-run capture after model / lighting / shot changes.

Capture uses `preserveDrawingBuffer` only in the studio — never on production canvases.

## Loading order checklist

- [ ] Active hero poster: `preload` + `fetchPriority="high"`
- [ ] Three.js only via `next/dynamic` / idle prefetch on **high**
- [ ] One in-flight HDRI (`prefetchHdri`) — 512 mid/low, 1k high
- [ ] Door sequences load when the pin approaches (`nearPin`), not at page load
- [ ] Gallery: `loading="lazy"`; first Cloudinary tile may use `priority` if it is LCP
- [ ] `preconnect` to Cloudinary if remotes remain
- [ ] Respect `prefers-reduced-motion` (static copy for the scroll pin)

## Canvas rules (production)

See [components/three/README.md](./components/three/README.md). Short version:

- Never import `three` outside `components/three/` without lazy entry points
- `frameloop="demand"`; invalidate until settle
- One canvas per viewport region
- No stacked hero + door WebGL on phones
- Soft dissolve on sequences: adjacent frames only, `source-over` — never additive

## Measure

```bash
npm run build && npm run start
# Lighthouse mobile, or CDP Slow 3G matrix from the readiness audit
```

Track LCP, INP, CLS. Prefer WebPageTest / Lighthouse from a region near Nepal when judging real networks.

## Suggested change order

1. HDRI dedupe + 512 on mid (done)
2. Poster priority + deferred Three.js (done)
3. One live canvas on phones / sequences for mid-low (this pass)
4. Commit captured frames + re-measure production
5. Optional: Draco/Meshopt/KTX2 if any GLB ever ships (parametric path has none today)
