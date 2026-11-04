"use client";

/**
 * One in-flight download per HDRI URL for the whole visit. Intro, hero and
 * door used to each kick off their own fetch of the 1.5 MB studio map; that
 * doubled transfer on first paint. Callers share this promise instead.
 */

const inflight = new Map<string, Promise<Response>>();

export function prefetchHdri(url: string): Promise<Response> {
  let pending = inflight.get(url);
  if (pending) return pending;
  pending = fetch(url, { cache: "force-cache" });
  inflight.set(url, pending);
  return pending;
}
