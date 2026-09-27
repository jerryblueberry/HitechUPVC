# Hi-Tech uPVC Profile Industries — Project Documentation

Documentation-first workflow for the Hi-Tech uPVC Profile Industries ecommerce website. Every agent session and human contributor should start here.

## Quick Start for Agents

1. Read [TRACKING.md](./TRACKING.md) — what is backlog, in progress, review, or done
2. Read the relevant page doc in `pages/` or component doc in `components/`
3. Follow [AGENT-WORKFLOW.md](./AGENT-WORKFLOW.md) — plan → doc → review → implement
4. Reference [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) for tokens, never hardcode colors/spacing
5. Reference [DATA-MODEL.md](./DATA-MODEL.md) for JSON shapes — use `lib/getData.ts` only

## Document Index

| Document | Purpose |
|----------|---------|
| [MASTER-PLAN.md](./MASTER-PLAN.md) | Full product spec, pages, stack, build order |
| [AGENT-WORKFLOW.md](./AGENT-WORKFLOW.md) | Plan → write docs → review → implement loop |
| [FOLDER-STRUCTURE.md](./FOLDER-STRUCTURE.md) | Canonical paths and naming conventions |
| [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) | Colors, fonts, spacing, layout rhythm |
| [DATA-MODEL.md](./DATA-MODEL.md) | JSON shapes, CMS migration, Zod validation |
| [ANIMATION-SPEC.md](./ANIMATION-SPEC.md) | Framer Motion patterns, UPVC opening demos |
| [components/three/README.md](./components/three/README.md) | Real-time 3D system — geometry, materials, opening rigs |
| [CONTENT-CHECKLIST.md](./CONTENT-CHECKLIST.md) | Assets and copy still needed |
| [TRACKING.md](./TRACKING.md) | Todo / in-progress / review / done board |
| [decisions/](./decisions/) | Architecture Decision Records (ADRs) |

## Page Docs

- [home.md](./pages/home.md)
- [products-overview.md](./pages/products-overview.md)
- [product-detail.md](./pages/product-detail.md)
- [why-upvc.md](./pages/why-upvc.md)
- [gallery.md](./pages/gallery.md)
- [about.md](./pages/about.md)
- [contact-get-quote.md](./pages/contact-get-quote.md)

## Component Doc Template

Every component doc in `components/` uses this structure:

- **Status**: planned | in-progress | review | done
- **Purpose**, **Design Decisions**, **Props/Data**, **Animation Spec**
- **Responsive Behavior**, **Accessibility**, **Dependencies**
- **Implementation Notes**, **Review Checklist**

## Rules

Cursor rules live in `.cursor/rules/`. See also `AGENTS.md` at the project root.
