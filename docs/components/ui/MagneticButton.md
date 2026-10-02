# MagneticButton
Status: review
Owner: agent
Last reviewed: 2026-09-29

## Purpose
Button with subtle cursor-follow magnetic effect and scale on press.

## Animation Spec
Soft spring (`stiffness 220 / damping 26`); hover scale 1.02, tap 0.98; colour 300ms premium ease. Reduced motion: static.

## Implementation Notes
- File: `components/ui/MagneticButton.tsx`
- `gap-2` so icon + label CTAs (WhatsApp) align cleanly

## Review Checklist
- [x] Works as link or button
- [x] Reduced motion: standard button only
