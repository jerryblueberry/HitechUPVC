"use client";

import dynamic from "next/dynamic";

export const LazyUpvcPanelViewer = dynamic(
  () => import("./UpvcPanelViewer").then((mod) => mod.UpvcPanelViewer),
  { ssr: false }
);
