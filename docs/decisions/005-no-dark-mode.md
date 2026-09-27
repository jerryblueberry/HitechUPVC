# ADR 005: No Dark Mode

**Status:** Accepted  
**Date:** 2026-08-23

## Context

Premium construction/materials sites typically use light, warm-neutral palettes. Dark mode adds complexity without brand benefit.

## Decision

- No dark mode toggle
- Remove `prefers-color-scheme: dark` overrides from globals.css
- Use section rhythm instead: alternate `bg-surface`, `bg-surface-muted`, `bg-navy` for visual variety

## Consequences

- Simpler CSS and component logic
- Agents must not add dark: variants or theme switchers unless explicitly requested
