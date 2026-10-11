import type { MetadataRoute } from "next";
import { getCompany } from "@/lib/getData";

/** Matches `--color-surface`, so the browser chrome sits on the page colour. */
const SURFACE = "#f7f6f3";

/**
 * Home-screen and Android icon manifest. The mark files live in `public/icons`
 * because a manifest can only point at public URLs. Tab and Apple icons are
 * the `app/favicon.ico`, `app/icon.png` and `app/apple-icon.png` conventions.
 */
export default function manifest(): MetadataRoute.Manifest {
  const company = getCompany();

  return {
    name: company.companyName,
    short_name: "Hi-Tech uPVC",
    description:
      "uPVC windows, doors, and panels made in Nepal by Hi-Tech uPVC Profile Industries.",
    start_url: "/",
    display: "standalone",
    background_color: SURFACE,
    theme_color: SURFACE,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
