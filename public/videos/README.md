# Scroll-scrub videos

VP9 WebMs encoded from `public/images/sequences/*` for the Apple-style offline
path (low tier / Save-Data). Mid and high still use live WebGL.

| File | Role | Size (approx) |
|------|------|---------------|
| `door-portrait.webm` | Phone scroll door | ~116 KB |
| `door-landscape.webm` | Wide scroll door | ~136 KB |
| `hero-*.webm` | Hero open/close per slide | ~48–86 KB |

Rebuild after capture:

```bash
# 1. Capture (dev server, tab focused)
open http://localhost:3000/dev/capture?job=all

# 2. Encode
npm run encode:sequences
```
