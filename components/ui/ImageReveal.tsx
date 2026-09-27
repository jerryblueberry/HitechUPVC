"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  direction?: "left" | "up" | "scale";
  priority?: boolean;
  sizes?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function ImageReveal({
  src,
  alt,
  className = "",
  direction = "left",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ImageRevealProps) {
  const reducedMotion = useReducedMotion();

  const initial =
    direction === "scale"
      ? { opacity: 0, scale: 1.08 }
      : direction === "up"
        ? { opacity: 0, y: 32 }
        : { opacity: 0, x: -40, scale: 1.04 };

  const animate =
    direction === "scale"
      ? { opacity: 1, scale: 1 }
      : direction === "up"
        ? { opacity: 1, y: 0 }
        : { opacity: 1, x: 0, scale: 1 };

  if (reducedMotion) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
      </div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
    </motion.div>
  );
}
