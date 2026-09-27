"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface UpvcProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  animate?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

/** Premium presentation for isolated UPVC window/door PNG cutouts */
export function UpvcProductImage({
  src,
  alt,
  className = "",
  priority = false,
  animate = true,
}: UpvcProductImageProps) {
  const inner = (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={720}
      priority={priority}
      className="object-contain w-full h-full max-h-[420px] drop-shadow-[0_24px_48px_rgba(14,42,62,0.18)]"
      sizes="(max-width: 768px) 90vw, 45vw"
    />
  );

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background:
          "linear-gradient(145deg, #e7e4df 0%, #f7f6f3 45%, #ede8df 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(182,154,107,0.25) 0%, transparent 65%)",
        }}
        aria-hidden
      />
      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease }}
          className="relative z-10 flex items-center justify-center h-full min-h-[280px] p-8 lg:p-12"
        >
          {inner}
        </motion.div>
      ) : (
        <div className="relative z-10 flex items-center justify-center h-full min-h-[280px] p-8 lg:p-12">
          {inner}
        </div>
      )}
    </div>
  );
}
