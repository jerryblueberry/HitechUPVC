# DoorwayIntro
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
First-visit page-load: French doors open and the camera walks through onto the home page.

## Performance
- No HDRI on this canvas (1.5 MB `studio_small_09_1k.hdr` is for later viewers; the 410 KB `studio_small_09_512.hdr` is reserved for Save-Data, low-memory and 2g devices)
- Skipped on touch (`pointer: coarse`), Save-Data, and `deviceMemory < 4`; the SSR cover is hidden with `pointer-coarse:hidden` so phones never see it
- `quality="draft"` materials (MeshStandard, no clearcoat/refraction) so shaders compile fast
- Antialias off, DPR capped (1.05 touch / 1.35 desktop), `frameloop` idle until `compileAsync` then always
- Clock starts only after compile — first frame parks the camera at the correct start Z
- Touch devices use a shorter open + walk (~1.0s) so phones finish before the fail-open
- `lib/introSession.ts` locks other canvases until the overlay exits
- Finish is once-only: canvas unmounts immediately, cover fades (~240ms), then hero WebGL mounts
- Hero `LazyUpvcViewer` mounts on `onComplete`, not mid-walk
- Below-fold 3D stays unmounted (`ApproachedMount`, 220px) until the intro unlocks
- Home `template.tsx` does not fade `/`, so the cover is never opacity 0
- Fail-open in 2.4s if three.js is slow; click skips
- Brand logo loads with `priority`; HDRI is prefetched after the intro finishes

## Review Checklist
- [x] Intro does not wait on the studio HDRI
- [x] Clock starts after `compileAsync`; fail-open at 2.4s
- [x] Reduced motion / no WebGL still skip
- [x] Hero 3D not created until the overlay completes (canvas dropped first)
- [x] Other home canvases wait on the intro lock
- [x] Mobile timeline is shorter and still smooth
- [x] `tsc --noEmit` passes
