"use client";

import dynamic from "next/dynamic";

export const LazyUpvcScrollScene = dynamic(
  () => import("./UpvcScrollScene").then((mod) => mod.UpvcScrollScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  }
);

/** Warm the scroll-scene chunk before the sticky pin mounts it. */
export function prefetchUpvcScrollScene() {
  void import("./UpvcScrollScene");
}
