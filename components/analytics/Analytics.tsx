"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { GTM_ID, isAnalyticsEnabled, trackPageView } from "@/lib/analytics";

/**
 * Fires a GTM `page_view` on first paint and every App Router navigation.
 * Must sit under a Suspense boundary because it reads `useSearchParams`.
 */
function AnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;
    const search = searchParams?.toString();
    const path = search ? `${pathname}?${search}` : pathname;
    if (lastPath.current === path) return;
    lastPath.current = path;
    trackPageView(path);
  }, [pathname, searchParams]);

  return null;
}

/** GTM container + SPA page views. No-ops when analytics is disabled. */
export function Analytics() {
  if (!isAnalyticsEnabled()) return null;

  return (
    <>
      <GoogleTagManager gtmId={GTM_ID} />
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
    </>
  );
}

/** Noscript fallback iframe — place as the first child of `<body>`. */
export function AnalyticsNoscript() {
  if (!isAnalyticsEnabled()) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        title="Google Tag Manager"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
