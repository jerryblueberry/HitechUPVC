"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export function MagneticButton({
  href,
  onClick,
  children,
  className = "",
  variant = "primary",
}: MagneticButtonProps) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const baseStyles =
    variant === "primary"
      ? "bg-navy text-surface hover:bg-charcoal"
      : "border border-charcoal/20 text-charcoal hover:border-navy hover:text-navy";

  const classes = `inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-colors ${baseStyles} ${className}`;

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const motionProps = reducedMotion
    ? {}
    : {
        style: { x: springX, y: springY },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        whileTap: { scale: 0.97 },
      };

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
