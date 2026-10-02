"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!isInView) return;

    if (reducedMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });

    return () => controls.stop();
  }, [isInView, value, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {display !== null ? `${display.toLocaleString("en-US")}${suffix}` : `\u00A0`}
    </span>
  );
}
