"use client";

import { useState } from "react";
import { usePrefersReducedMotion } from "./hooks";

export type PreviewMotion = "demo" | "open" | "closed";

const MOTIONS: { id: PreviewMotion; label: string }[] = [
  { id: "demo", label: "Play" },
  { id: "open", label: "Open" },
  { id: "closed", label: "Closed" },
];

/**
 * Play / Open / Closed state for a 3D preview. Reduced motion never plays:
 * "Play" is hidden and falls back to closed.
 */
export function usePreviewMotion(initial: PreviewMotion = "demo") {
  const reducedMotion = usePrefersReducedMotion();
  const [motion, setMotion] = useState<PreviewMotion>(initial);
  const effective: PreviewMotion = reducedMotion && motion === "demo" ? "closed" : motion;
  return { motion: effective, setMotion, reducedMotion };
}

interface PreviewMotionControlProps {
  value: PreviewMotion;
  onChange: (motion: PreviewMotion) => void;
  reducedMotion: boolean;
}

export function PreviewMotionControl({ value, onChange, reducedMotion }: PreviewMotionControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Preview motion"
      className="pointer-events-auto inline-flex rounded-full bg-white/90 p-0.5 shadow-sm ring-1 ring-charcoal/[0.08] backdrop-blur"
    >
      {MOTIONS.filter((option) => !(reducedMotion && option.id === "demo")).map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          onClick={() => onChange(option.id)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            value === option.id ? "bg-navy text-surface" : "text-charcoal/55 hover:text-charcoal"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
