"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Navigation } from "@/lib/types";

interface MegaMenuProps {
  navigation: Navigation;
  isOpen: boolean;
  onClose: () => void;
  /** Header dropdown vs stacked panel inside the mobile sheet */
  variant?: "dropdown" | "inline";
}

const COLUMNS = [
  { key: "windows", label: "Windows" },
  { key: "doors", label: "Doors" },
  { key: "panels", label: "Panels" },
] as const;

function ProductColumns({
  navigation,
  onClose,
}: {
  navigation: Navigation;
  onClose: () => void;
}) {
  const { products } = navigation;

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-12 lg:gap-x-10">
      {COLUMNS.map(({ key, label }) => (
        <div key={key} className="sm:col-span-1 lg:col-span-2">
          <p className="eyebrow mb-3 text-gold sm:mb-4">{label}</p>
          <ul className="space-y-2.5">
            {products[key].map((item) => (
              <li key={`${key}-${item.label}`}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-1 text-sm text-charcoal/80 transition-colors duration-300 hover:text-navy"
                  onClick={onClose}
                >
                  {item.label}
                  <span
                    className="translate-x-0 opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-premium)] group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden
                  >
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {products.featured && (
        <div className="sm:col-span-3 lg:col-span-6">
          <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-5 ring-1 ring-charcoal/5 shadow-[0_1px_2px_rgba(27,27,29,0.04),0_16px_36px_-24px_rgba(27,27,29,0.16)] sm:rounded-[1.5rem] sm:p-7">
            <div>
              <p className="eyebrow mb-3 text-gold">Featured</p>
              <p className="font-display text-[1.35rem] leading-tight tracking-tight text-charcoal text-balance sm:text-[1.65rem]">
                {products.featured.title}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-charcoal/60 sm:mt-3">
                {products.featured.description}
              </p>
            </div>
            <Link
              href={products.featured.href}
              className="group mt-5 inline-flex items-center gap-1 text-sm font-medium text-navy sm:mt-6"
              onClick={onClose}
            >
              View product
              <span
                className="transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-0.5"
                aria-hidden
              >
                ›
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function MegaMenu({
  navigation,
  isOpen,
  onClose,
  variant = "dropdown",
}: MegaMenuProps) {
  const reducedMotion = useReducedMotion();

  if (variant === "inline") {
    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-charcoal/8 pb-5 pt-4">
              <ProductColumns navigation={navigation} onClose={onClose} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full z-20 hidden border-t border-charcoal/[0.06] bg-surface shadow-[0_28px_56px_-28px_rgba(27,27,29,0.22)] lg:block"
        >
          <div className="container-content py-10 lg:py-12">
            <ProductColumns navigation={navigation} onClose={onClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-300 ease-[var(--ease-premium)] ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M2.25 4.25 6 8l3.75-3.75"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}