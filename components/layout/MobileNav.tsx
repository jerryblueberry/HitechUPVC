"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { whatsappHref } from "@/lib/constants";
import type { NavItem, Navigation } from "@/lib/types";
import { ChevronDown, MegaMenu } from "./MegaMenu";

interface MobileNavProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  whatsapp: string;
  navigation: Navigation;
  companyName: string;
  logo: string;
  tagline: string;
}

export function MobileNav({
  items,
  isOpen,
  onClose,
  whatsapp,
  navigation,
  companyName,
  logo,
  tagline,
}: MobileNavProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [productsOpen, setProductsOpen] = useState(false);
  if (!isOpen && productsOpen) setProductsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal/30 lg:hidden"
            onClick={onClose}
          />
          <motion.nav
            initial={reducedMotion ? { opacity: 0 } : { x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-[min(20.5rem,86vw)] flex-col bg-surface text-charcoal shadow-[-24px_0_48px_-28px_rgba(27,27,29,0.28)] lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="border-b border-charcoal/8 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href="/"
                  aria-label={`${companyName} — Home`}
                  onClick={onClose}
                  className="min-w-0 text-navy"
                >
                  <BrandLogo
                    name={companyName}
                    src={logo}
                    className="text-[1.2rem]"
                    subClassName="text-charcoal/55"
                    markClassName="h-10 w-10"
                  />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal hover:bg-charcoal/5"
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                    <path d="M5 5l10 10M15 5 5 15" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 whitespace-nowrap text-xs leading-none text-charcoal/50">
                {tagline}
              </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">
              <ul>
                {items.map((item) => {
                  const products = item.label === "Products";
                  const active = isActive(item.href);

                  return (
                    <li key={item.href} className="border-b border-charcoal/8 last:border-0">
                      {products ? (
                        <>
                          <div className="flex items-center">
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={`flex-1 py-3.5 text-[1.125rem] font-medium tracking-tight ${
                                active || productsOpen ? "text-navy" : "text-charcoal"
                              }`}
                            >
                              {item.label}
                            </Link>
                            <button
                              type="button"
                              className="flex h-10 w-10 items-center justify-center text-charcoal"
                              aria-expanded={productsOpen}
                              aria-label={productsOpen ? "Collapse products" : "Expand products"}
                              onClick={() => setProductsOpen((open) => !open)}
                            >
                              <ChevronDown open={productsOpen} />
                            </button>
                          </div>
                          <MegaMenu
                            variant="inline"
                            navigation={navigation}
                            isOpen={productsOpen}
                            onClose={onClose}
                          />
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block py-3.5 text-[1.125rem] font-medium tracking-tight ${
                            active ? "text-navy" : "text-charcoal"
                          }`}
                          onClick={onClose}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto flex flex-col gap-2.5 pt-6">
                <a
                  href={whatsappHref(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-charcoal ring-1 ring-charcoal/10"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white" aria-hidden>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  WhatsApp
                </a>
                <Link
                  href="/get-quote"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-4 py-2.5 text-sm font-medium text-surface"
                  onClick={onClose}
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}