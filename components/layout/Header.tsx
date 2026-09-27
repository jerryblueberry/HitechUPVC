"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { Navigation } from "@/lib/types";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  navigation: Navigation;
  companyName: string;
}

export function Header({ navigation, companyName }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const allNavItems: { label: string; href: string; hasMega?: boolean }[] = [
    { label: "Products", href: "/products", hasMega: true },
    ...navigation.main.filter((item) => item.label !== "Products"),
  ];

  const logoClass = "text-navy";

  const linkClass = (active: boolean) =>
    active ? "text-navy" : "text-charcoal/80 hover:text-navy";

  const ctaClass = "bg-charcoal text-surface hover:bg-navy";

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-500 ${
          scrolled
            ? "bg-surface/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container-content flex items-center justify-between h-16 lg:h-20">
          <Link
            href="/"
            aria-label={`${companyName} — Home`}
            className={`transition-colors duration-300 ${logoClass}`}
          >
            <BrandLogo
              name={companyName}
              className="text-[1.375rem] lg:text-2xl"
              subClassName="text-charcoal/60"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
            {allNavItems.map((item) =>
              item.hasMega ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                >
                  <Link
                    href={item.href}
                    className={`relative text-sm font-medium transition-colors duration-300 ${linkClass(pathname.startsWith("/products"))}`}
                  >
                    {item.label}
                    {pathname.startsWith("/products") && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                      />
                    )}
                  </Link>
                  <MegaMenu
                    navigation={navigation}
                    isOpen={megaOpen}
                    onClose={() => setMegaOpen(false)}
                  />
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${linkClass(pathname === item.href)}`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                    />
                  )}
                </Link>
              )
            )}
            <Link
              href="/get-quote"
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${ctaClass}`}
            >
              Get a Quote
            </Link>
          </nav>

          <button
            type="button"
            className="lg:hidden p-2 transition-colors text-charcoal"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <MobileNav
        items={[
          { label: "Products", href: "/products" },
          ...navigation.main.filter((i) => i.label !== "Products"),
        ]}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
