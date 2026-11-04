# Home frame sequences

Pre-rendered WebP frames for the Apple-style home motion path (mid/low tiers).

## Generate (dev only)

```bash
npm run dev
# Keep this tab focused — background tabs throttle rAF and stretch capture.
open http://localhost:3000/dev/capture?job=all
```

Progress is on screen and on `window.__capture`. Frames land here as:

| Folder | Frames | Size | Used by |
|--------|-------:|------|---------|
| `door-landscape/` | 40 | 1920×960 | Scroll door (wide) |
| `door-portrait/` | 40 | 1080×1440 | Scroll door (tall) |
| `hero-{slideId}/` | 24 | 1200×1200 | Hero carousel |

Re-capture after changing a model, lighting, door camera shots, or hero framing.

After capture, encode scroll-scrub videos:

```bash
npm run encode:sequences
```

Mid/high use live WebGL. Low uses the WebMs (or WebP canvas if a video is missing).
