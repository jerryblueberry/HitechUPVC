# DoorwayIntro
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
First-visit page-load: French doors open and the camera walks through onto the home page.

## Performance
- No HDRI on this canvas (1.5 MB `studio_small_09_1k.hdr` is for later viewers; the 410 KB `studio_small_09_512.hdr` is reserved for Save-Data, low-memory and 2g devices)
- Plays on phones as well as desktops. Skipped for Save-Data, 2g, `deviceMemory < 4`, reduced motion, and no WebGL
- Touch framing is tighter (doors fill the width) with a slightly later walk so the swing reads before the camera moves
- `quality="draft"` materials (MeshStandard, no clearcoat/refraction) so shaders compile fast
- DPR capped (1.25 touch with antialias / 1.35 desktop without), `frameloop` idle until `compileAsync` then always
- Clock starts only after compile — first frame parks the camera at the correct start Z
- Touch timeline is about 1.1s: leaves swing open, then the camera walks through
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
