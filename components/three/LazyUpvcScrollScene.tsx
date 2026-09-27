"use client";

import dynamic from "next/dynamic";

export const LazyUpvcScrollScene = dynamic(
  () => import("./UpvcScrollScene").then((mod) => mod.UpvcScrollScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  }
);
