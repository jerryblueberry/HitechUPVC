/**
 * Google Tag Manager analytics helpers.
 *
 * Load the container once via `Analytics` in the root layout. Configure GA4
 * (and Ads) tags inside GTM — do not also hard-code gtag.js here.
 *
 * SPA note: App Router navigations do not reload the page. We push a custom
 * `page_view` event on each route change. In GTM, trigger GA4 page_view off
 * that event (and turn off the default "All Pages" trigger to avoid doubles).
 */

import { sendGTMEvent } from "@next/third-parties/google";

/** Public container ID — override with NEXT_PUBLIC_GTM_ID in Vercel if needed. */
export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-5TP729V4";

export function isAnalyticsEnabled() {
  return Boolean(GTM_ID) && process.env.NODE_ENV !== "test";
}

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

function push(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) return;
  sendGTMEvent({ event, ...payload });
}

/** Virtual page view for App Router client navigations. */
export function trackPageView(path: string, title?: string) {
  push("page_view", {
    page_path: path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
    page_location:
      typeof window !== "undefined" ? window.location.href : undefined,
  });
}

/** Header / CTA WhatsApp chip or link. */
export function trackWhatsAppClick(location: string) {
  push("click_whatsapp", { location });
}

/** Any “Get a Quote” / quote CTA. */
export function trackQuoteClick(location: string) {
  push("click_quote", { location });
}

/** Quote builder → Send on WhatsApp (primary conversion). */
export function trackQuoteLead(payload: {
  openings: number;
  projectType?: string;
  timeline?: string;
}) {
  push("generate_lead", {
    lead_source: "quote_builder",
    openings: payload.openings,
    project_type: payload.projectType,
    timeline: payload.timeline,
  });
}
