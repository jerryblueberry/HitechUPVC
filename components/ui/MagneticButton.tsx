"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackQuoteClick, trackWhatsAppClick } from "@/lib/analytics";

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  /** Analytics location when this is a tracked CTA. */
  trackLocation?: string;
}

function trackHrefClick(href: string, location: string) {
  if (href.includes("wa.me") || href.includes("whatsapp")) {
    trackWhatsAppClick(location);
    return;
  }
  if (href.includes("get-quote") || href.includes("quote")) {
    trackQuoteClick(location);
  }
}

const VARIANTS = {
  primary:
    "bg-navy text-surface shadow-[0_1px_2px_rgba(14,42,62,0.12)] hover:bg-charcoal hover:shadow-[0_8px_20px_-8px_rgba(14,42,62,0.45)]",
  secondary:
    "border border-charcoal/20 text-charcoal hover:border-navy hover:bg-navy/[0.03] hover:text-navy",
} as const;

export function MagneticButton({
  href,
  onClick,
  children,
  className = "",
  variant = "primary",
  trackLocation = "cta",
}: MagneticButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-premium)] active:scale-[0.985] active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-colors motion-reduce:active:scale-100 ${VARIANTS[variant]} ${className}`;

  if (href) {
    const external = href.startsWith("http");
    const handleClick = () => trackHrefClick(href, trackLocation);
    return (
      <div className="block w-full sm:inline-block sm:w-auto">
        {external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
            onClick={handleClick}
          >
            {children}
          </a>
        ) : (
          <Link href={href} className={classes} onClick={handleClick}>
            {children}
          </Link>
        )}
      </div>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
