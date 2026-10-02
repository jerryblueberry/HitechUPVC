"use client";

import dynamic from "next/dynamic";

export const LazyUpvcDoorwayScene = dynamic(
  () =>
    import(/* webpackPreload: true */ "./UpvcDoorwayScene").then(
      (mod) => mod.UpvcDoorwayScene
    ),
  { ssr: false }
);