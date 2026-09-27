"use client";

import dynamic from "next/dynamic";

export const LazyUpvcDoorwayScene = dynamic(
  () => import("./UpvcDoorwayScene").then((mod) => mod.UpvcDoorwayScene),
  { ssr: false }
);
