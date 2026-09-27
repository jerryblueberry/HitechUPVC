# ADR 001: Tailwind v4 CSS-First Design Tokens

**Status:** Accepted  
**Date:** 2026-08-23

## Context

The project was scaffolded with Tailwind CSS v4, which uses `@theme inline` in CSS instead of `tailwind.config.ts`.

## Decision

Define all design tokens in `app/globals.css`:

- Colors, typography scale, spacing, motion easing
- Reusable utility classes: `.section-padding`, `.container-content`, `.eyebrow`

Reference documentation in `docs/DESIGN-SYSTEM.md`.

## Consequences

- No `tailwind.config.ts` file
- Agents must read `globals.css` and DESIGN-SYSTEM.md for tokens
- Tailwind v4 `@theme` syntax for custom colors and fonts
