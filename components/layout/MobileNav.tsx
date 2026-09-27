"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { NavItem } from "@/lib/types";

interface MobileNavProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ items, isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-navy text-surface lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between p-6 border-b border-surface/10">
              <span className="font-display text-lg">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-surface/80 hover:text-surface"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <ul className="p-6 space-y-4">
              {items.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className="block text-lg font-medium hover:text-gold transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: items.length * 0.05, duration: 0.3 }}
                className="pt-4"
              >
                <Link
                  href="/get-quote"
                  className="inline-block bg-gold text-charcoal px-6 py-3 rounded-full text-sm font-medium"
                  onClick={onClose}
                >
                  Get a Quote
                </Link>
              </motion.li>
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
