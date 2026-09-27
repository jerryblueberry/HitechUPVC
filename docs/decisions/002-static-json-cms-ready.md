# ADR 002: Static JSON with CMS-Ready Shapes

**Status:** Accepted  
**Date:** 2026-08-23

## Context

The site launches with static JSON. A CMS (Sanity/Strapi/Contentful) may be added later.

## Decision

- JSON files in `data/` mirror future API response shapes
- TypeScript interfaces in `lib/types.ts` define the contract
- Components read data only via `lib/getData.ts`
- Field names use camelCase, stable across JSON and future API

## Consequences

- Migration is a data-source swap in `getData.ts`, not a component rewrite
- Components never import JSON directly
- Optional Zod validation at build time
