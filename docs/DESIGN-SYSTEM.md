# Design System

Source of truth for Premium UPVC visual identity. Tokens are defined in `app/globals.css` via Tailwind v4 `@theme inline`.

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#F7F6F3` | Page background, light sections |
| `surface-muted` | `#E7E4DF` | Cards, dividers, subtle backgrounds |
| `charcoal` | `#1B1B1D` | Primary text, dark sections |
| `navy` | `#0E2A3E` | Primary accent, headers, CTAs |
| `gold` | `#B69A6B` | Icons, hover underlines, dividers (sparingly) |
| `success` | `#2F7D5E` | U-values, eco badges |

Tailwind classes: `bg-surface`, `text-charcoal`, `text-navy`, `text-gold`, etc.

**Do not** hardcode hex in components. Use theme tokens only.

## Typography

| Role | Font | CSS variable | Tailwind |
|------|------|--------------|----------|
| Display | Fraunces | `--font-fraunces` | `font-display` |
| Body | Inter | `--font-inter` | `font-body` |

### Type Scale

| Token | Value | Usage |
|-------|-------|-------|
| `text-hero` | `clamp(2.75rem, 6vw, 5.5rem)` | Hero headlines |
| `text-h2` | `clamp(2rem, 4vw, 3.25rem)` | Section headings |
| `text-h3` | `clamp(1.5rem, 2.5vw, 2rem)` | Subheadings |
| `text-body` | `1.0625rem` | Body copy (line-height 1.65) |
| `text-caption` | `0.875rem` | Eyebrows, labels (uppercase, tracking-wide) |

Headlines: negative tracking (`-0.02em`). Body: generous line-height (1.6–1.7).

## Spacing & Layout

| Utility class | Effect |
|---------------|--------|
| `.section-padding` | `py-24 md:py-32` |
| `.container-content` | `mx-auto max-w-[90rem] px-6 lg:px-8` |
| `.prose-narrow` | `max-w-3xl` for text-heavy blocks |
| `.eyebrow` | Caption uppercase tracking for section labels |

- 8pt spacing scale
- Max content width ~1440px (`90rem`)
- 12-col desktop grid, 4-col mobile
- Generous whitespace — premium brands under-fill space

## Section Rhythm

Alternate light and dark sections for visual rhythm:
- Light: `bg-surface text-charcoal`
- Muted: `bg-surface-muted`
- Dark: `bg-navy text-surface`

No dark mode toggle — site stays light/warm-neutral (ADR 005).

## Motion Tokens

| Token | Value |
|-------|-------|
| `--ease-premium` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--duration-entrance` | `600ms` |
| `--duration-micro` | `200ms` |

See [ANIMATION-SPEC.md](./ANIMATION-SPEC.md) for component-level motion.

## Imagery

- Real, high-res photography of installed products
- Consistent warm neutral color grading
- Macro/detail shots of hardware and profiles
- Optional subtle grain overlay on hero sections

## Focus States

Custom focus ring matching brand: `ring-2 ring-gold ring-offset-2 ring-offset-surface` — not default browser outline.
