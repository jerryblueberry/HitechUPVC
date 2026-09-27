"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { Navigation } from "@/lib/types";

interface MegaMenuProps {
  navigation: Navigation;
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ navigation, isOpen, onClose }: MegaMenuProps) {
  const { products } = navigation;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 top-full border-t border-surface-muted bg-surface shadow-lg"
          onMouseLeave={onClose}
        >
          <div className="container-content py-8">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <p className="eyebrow mb-4">Windows</p>
                <ul className="space-y-2">
                  {products.windows.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-charcoal/80 hover:text-navy transition-colors"
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-4">Doors</p>
                <ul className="space-y-2">
                  {products.doors.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-charcoal/80 hover:text-navy transition-colors"
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-4">Panels</p>
                <ul className="space-y-2">
                  {products.panels.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-charcoal/80 hover:text-navy transition-colors"
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {products.featured && (
                <div className="rounded-lg bg-surface-muted p-6">
                  <p className="eyebrow mb-2">Featured</p>
                  <p className="font-display text-h3 text-navy mb-2">
                    {products.featured.title}
                  </p>
                  <p className="text-sm text-charcoal/70 mb-4">
                    {products.featured.description}
                  </p>
                  <Link
                    href={products.featured.href}
                    className="text-sm font-medium text-gold hover:underline"
                    onClick={onClose}
                  >
                    View product →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
