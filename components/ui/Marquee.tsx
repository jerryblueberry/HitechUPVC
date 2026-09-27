"use client";

import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
}

export function Marquee({ children, className = "" }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max gap-8 animate-marquee motion-reduce:animate-none">
        {children}
        {children}
      </div>
    </div>
  );
}
