"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
  /**
   * Above the fold: animate with CSS from the server HTML instead of waiting
   * for hydration, so the page copy paints (and counts for LCP) immediately.
   */
  priority?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  as = "div",
  priority = false,
}: RevealOnScrollProps) {
  const reducedMotion = useReducedMotion();

  if (priority) {
    const Tag = as;
    return (
      <Tag
        className={`reveal-load ${className}`}
        style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
      >
        {children}
      </Tag>
    );
  }

  if (reducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.55,
        delay,
        ease,
      }}
    >
      {children}
    </MotionTag>
  );
}
