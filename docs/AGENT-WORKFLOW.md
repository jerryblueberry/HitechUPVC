# Agent Workflow

Mandatory loop for every task on the Premium UPVC project.

## Flow

```
User request
  → Read TRACKING.md + relevant page/component doc
  → Plan (chat or plan mode)
  → Write or update MD doc (Status: planned → in-progress)
  → Human review doc (optional for small fixes)
  → Implement code
  → Self-review against doc checklist
  → Update TRACKING.md + doc Status (review → done)
```

## Before Coding

1. Open [TRACKING.md](./TRACKING.md) and pick **one** item (or accept assigned item)
2. Read the matching doc in `pages/` or `components/`
3. Read [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) if touching UI
4. Read [DATA-MODEL.md](./DATA-MODEL.md) if touching data
5. Read [ANIMATION-SPEC.md](./ANIMATION-SPEC.md) if adding motion
6. Set doc **Status** to `in-progress` and move TRACKING item to **In Progress**

## While Coding

- Minimal diffs — only what the task requires
- Use design tokens from `app/globals.css` — no hardcoded hex values
- Read data via `lib/getData.ts` — never import JSON in components
- Match [FOLDER-STRUCTURE.md](./FOLDER-STRUCTURE.md) paths exactly
- Client components only when needed (motion, interactivity)

## After Coding

1. Run through the doc **Review Checklist**
2. Update **Implementation Notes** in the component doc
3. Move TRACKING item to **Review**
4. Set doc **Status** to `review`
5. After human approval: **Status** → `done`, TRACKING → **Done**

## Never

- Mark **done** without updating TRACKING and the component doc
- Skip docs for new components or pages
- Add dark mode (see ADR 005)
- Import JSON files directly in components
- Hardcode brand copy in components — use JSON data

## Status Definitions

| Status | Meaning |
|--------|---------|
| planned | Doc exists, not started |
| in-progress | Agent or human actively building |
| review | Code complete, awaiting checklist review |
| done | Reviewed and merged |
