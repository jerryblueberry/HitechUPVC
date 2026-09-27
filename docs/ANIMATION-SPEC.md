# Animation Spec

Framer Motion patterns for Premium UPVC. All motion supports content — never distracts.

## Global Principles

- Easing: `[0.22, 1, 0.36, 1]` (ease-out-expo feel)
- Entrance: 0.4–0.7s; hover/micro: 0.15–0.25s
- Stagger children: 0.05–0.08s
- Max 2–3 animated properties per element
- **`prefers-reduced-motion`**: disable/simplify all animations

## Libraries

| Library | Role |
|---------|------|
| **Framer Motion** | Hero text, hovers, reveals, page transitions, counters, before/after |
| **GSAP + ScrollTrigger** | Cinematic pinned scroll sections (`ScrollStorySection`) |
| **React Three Fiber** | Real-time uPVC units — opening rigs, configurator, scroll sequence |

## Component Patterns

| Component | Animation | Technique |
|-----------|-----------|-----------|
| ScrollStorySection | Pinned image + sash/door open + text crossfade | GSAP ScrollTrigger scrub |
| Scroll progress | Top bar scaleX | Framer `useScroll` + `useSpring` |
| PremiumText | Silent word/block fade | opacity + y:8–10, duration 0.75–0.9s |
| ImageReveal | Scale or slide-in photos | whileInView, duration 1.1s |
| Hero headline | Word/line reveal on load | `staggerChildren` + `AnimatedText` |
| Section entrances | Fade + slight Y translate | `whileInView`, `viewport={{ once: true, amount: 0.3 }}` |
| Product image hover | Zoom + shadow lift | `whileHover={{ scale: 1.04 }}` |
| Mega menu | Height/opacity expand | `AnimatePresence`, `mode="wait"` |
| Nav underline | Sliding indicator | shared `layoutId="nav-underline"` |
| Filter grid reflow | Cards reposition on filter | `layout` prop on `motion.div` |
| Stats counters | Count up on scroll | `useInView` + `animate()` |
| Scrollytelling | Sticky media + scroll progress | `useScroll` + `useTransform` |
| Before/after slider | Draggable handle | `useMotionValue` + `drag="x"` |
| Testimonials marquee | Infinite scroll | CSS keyframe or `animate(x, repeat: Infinity)` |
| Opening-type demo | Cross-fade between states | `AnimatePresence` + SVG |
| Page transitions | Soft fade/slide | `template.tsx` motion wrapper |
| Buttons | Magnetic cursor + scale | `MagneticButton` + spring |
| CTA background | Slow ambient gradient | infinite keyframes, low opacity |

## UPVC Opening-Type Demos

Now rendered in real-time 3D — see
[ADR 006](./decisions/006-parametric-3d-over-downloaded-models.md) and
[components/three/README.md](./components/three/README.md).

Shared component: `components/three/UpvcUnit.tsx`, driven by an `open` value 0 → 1.
The lever always throws first (0 → 0.16), then the leaf moves.

| Opening Type | Animation | Technique |
|--------------|-----------|-----------|
| Sliding | Leaf glides on the front track | `position.x` on the leaf pivot |
| Casement | Side hinge swing | `rotation.y` on a pivot at the hinge stile |
| Tilt & turn | Tilt in, tilt shut, then turn | Nested tilt + turn pivots, sequenced |
| Folding | Panels concertina and stack | Chained pivots, alternating ±2α |
| French | Dual swing from a centre meeting stile | Mirrored hinge pivots |
| Hinged door | Single leaf, 78° arc | `rotation.y`, three hinges |

The Framer Motion SVG version in `components/animations/OpeningTypeDemo.tsx` remains
for contexts too small or too incidental to justify a WebGL context (mega menu promo,
inline diagrams).

### Reduced Motion Fallback
Static rendered frame — no auto-play. Without WebGL, the static product image from
`lib/upvcAssets.ts`.

## Scroll-Driven 3D

`components/home/ScrollDoorSequence.tsx`. Scroll progress is written into a **ref**
by `useMotionValueEvent` and read inside `useFrame` — scrolling must never trigger a
React render. Camera keyframes lerp with smoothstep, then damp (λ = 6).

## Shared Utilities

- `components/ui/AnimatedText.tsx` — text reveal wrapper
- `components/ui/RevealOnScroll.tsx` — scroll-in wrapper
- `components/ui/MagneticButton.tsx` — cursor-follow button
- `components/ui/Marquee.tsx` — infinite horizontal scroll
- `components/ui/AnimatedCounter.tsx` — number count-up

## CSS Helper

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Defined in `app/globals.css`.
