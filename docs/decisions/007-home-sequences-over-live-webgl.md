# ADR 007: Pre-rendered home sequences for mid/low

**Status:** Accepted  
**Date:** 2026-11-04

## Context

Live Three.js + a 1.5 MB HDRI made the home hero and scroll-door pin feel blank for several seconds on Slow 3G Nepal phones, even though posters were already 14–40 KB. Apple product pages scrub pre-rendered frames instead of shipping WebGL to every device.

ADR 006 still stands for **configurators and high-tier hover surfaces** — parametric live 3D remains the source of truth for finishes and interactivity.

## Decision

- **High tier** (hover desktop): keep live WebGL on hero + scroll door + secondary viewers.
- **Mid / low**: play offline WebP sequences on a 2D `SequenceCanvas` (or stay on posters until frames are published). No home HDRI / Three.js on that path.
- Capture frames from the same parametric scenes via `/dev/capture` so the look stays brand-owned and re-runnable.

## Consequences

- Home mid/low transfer drops from multi‑MB JS+HDRI to hundreds of KB of progressive frames.
- Must re-capture after model, lighting, or camera-shot changes.
- Intro doorway may still use a short WebGL pass (no HDRI) on capable phones; constrained devices skip it.
