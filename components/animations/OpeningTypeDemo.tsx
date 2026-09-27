"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { OpeningType } from "@/lib/types";
import { OPENING_TYPE_LABELS } from "@/lib/constants";

interface OpeningTypeDemoProps {
  openingType: OpeningType;
  className?: string;
}

function WindowFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 240"
      className="w-full max-w-xs mx-auto"
      aria-hidden
    >
      <rect
        x="20"
        y="20"
        width="160"
        height="200"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-charcoal"
      />
      <rect
        x="28"
        y="28"
        width="144"
        height="184"
        fill="currentColor"
        className="text-surface-muted"
        opacity="0.5"
      />
      {children}
    </svg>
  );
}

function SlidingDemo() {
  return (
    <WindowFrame>
      <motion.rect
        x="28"
        y="28"
        width="72"
        height="184"
        fill="currentColor"
        className="text-navy"
        animate={{ x: [0, 36, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
    </WindowFrame>
  );
}

function CasementDemo() {
  return (
    <WindowFrame>
      <motion.g
        style={{ originX: "28px", originY: "120px" }}
        animate={{ rotate: [0, 45, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x="28"
          y="28"
          width="72"
          height="184"
          fill="currentColor"
          className="text-navy"
        />
      </motion.g>
    </WindowFrame>
  );
}

function TiltTurnDemo() {
  return (
    <WindowFrame>
      <motion.g
        animate={{
          rotateX: [0, 15, 0],
          rotate: [0, 0, 30, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "100px 120px" }}
      >
        <rect
          x="54"
          y="28"
          width="72"
          height="184"
          fill="currentColor"
          className="text-navy"
        />
      </motion.g>
    </WindowFrame>
  );
}

function FoldingDemo() {
  const panels = [0, 1, 2];
  return (
    <WindowFrame>
      {panels.map((i) => (
        <motion.rect
          key={i}
          x={28 + i * 36}
          y="28"
          width="32"
          height="184"
          fill="currentColor"
          className="text-navy"
          animate={{ scaleX: [1, 0.3, 1], x: [0, i * 8, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </WindowFrame>
  );
}

function FrenchDemo() {
  return (
    <WindowFrame>
      <motion.g
        style={{ originX: "28px", originY: "120px" }}
        animate={{ rotate: [0, -35, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect x="28" y="28" width="68" height="184" fill="currentColor" className="text-navy" />
      </motion.g>
      <motion.g
        style={{ originX: "172px", originY: "120px" }}
        animate={{ rotate: [0, 35, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect x="104" y="28" width="68" height="184" fill="currentColor" className="text-navy" />
      </motion.g>
    </WindowFrame>
  );
}

function HingedDemo() {
  return (
    <WindowFrame>
      <motion.g
        style={{ originX: "28px", originY: "120px" }}
        animate={{ rotate: [0, 55, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect x="28" y="28" width="144" height="184" fill="currentColor" className="text-navy" />
      </motion.g>
    </WindowFrame>
  );
}

function FixedDemo() {
  return (
    <WindowFrame>
      <rect x="28" y="28" width="144" height="184" fill="currentColor" className="text-navy" opacity="0.8" />
    </WindowFrame>
  );
}

const DEMOS: Record<OpeningType, () => React.ReactNode> = {
  sliding: SlidingDemo,
  casement: CasementDemo,
  "tilt-turn": TiltTurnDemo,
  folding: FoldingDemo,
  french: FrenchDemo,
  hinged: HingedDemo,
  fixed: FixedDemo,
};

export function OpeningTypeDemo({ openingType, className = "" }: OpeningTypeDemoProps) {
  const reducedMotion = useReducedMotion();
  const Demo = DEMOS[openingType];
  const label = OPENING_TYPE_LABELS[openingType];

  if (reducedMotion) {
    return (
      <div className={`text-center ${className}`}>
        <WindowFrame>
          <rect
            x="28"
            y="28"
            width="144"
            height="184"
            fill="currentColor"
            className="text-navy"
            opacity="0.6"
          />
        </WindowFrame>
        <p className="mt-4 text-sm text-charcoal/70">{label} — static diagram</p>
      </div>
    );
  }

  return (
    <div className={`text-charcoal ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={openingType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Demo />
        </motion.div>
      </AnimatePresence>
      <p className="mt-4 text-center text-sm font-medium text-navy">{label}</p>
    </div>
  );
}
