# ADR 004: Font Pairing Fraunces + Inter

**Status:** Accepted  
**Date:** 2026-08-23

## Context

Premium materials brands use display/body font contrast for architectural feel.

## Decision

- **Display/Headlines:** Fraunces (400/500/600, italic for accent words)
- **Body/UI:** Inter (400/500/600)
- Load via `next/font/google` in `app/layout.tsx`
- CSS variables: `--font-fraunces`, `--font-inter`

## Consequences

- Replaces default Geist fonts from create-next-app
- Headlines use `font-display` with negative tracking
- Body uses `font-body` at 1.0625rem / line-height 1.65
