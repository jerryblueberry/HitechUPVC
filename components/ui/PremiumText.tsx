"use client";

import { motion, useReducedMotion } from "framer-motion";

interface PremiumTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  /** Word-by-word (headlines) or full block fade (body copy) */
  mode?: "words" | "block";
}

const ease = [0.22, 1, 0.36, 1] as const;

export function PremiumText({
  children,
  className = "",
  as: Tag = "p",
  delay = 0,
  mode = "block",
}: PremiumTextProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  if (mode === "block") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    );
  }

  const words = children.split(" ");

  return (
    <Tag className={className} aria-label={children}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.28em]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            delay: delay + i * 0.045,
            ease,
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
