"use client";

/**
 * Client-only entry point for the 3D viewer. three.js is ~600 KB, so it is
 * kept out of the initial bundle and never server-rendered.
 */

import dynamic from "next/dynamic";

export const LazyUpvcViewer = dynamic(
  () => import("./UpvcViewer").then((mod) => mod.UpvcViewer),
  {
    ssr: false,
    // The stage fades the model in once ready; a pulse here would flash first.
    loading: () => <div className="h-full w-full" />,
  }
);
