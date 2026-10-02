"use client";

import { useRef, type ReactNode } from "react";
import { useHasApproached } from "./hooks";

/** Keeps `children` unmounted until the host is near the viewport (and intro is done). */
export function ApproachedMount({
  children,
  className,
  rootMargin,
}: {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const approached = useHasApproached(ref, rootMargin);

  return (
    <div ref={ref} className={className}>
      {approached ? children : null}
    </div>
  );
}
