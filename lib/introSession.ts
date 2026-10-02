/**
 * First-visit doorway intro lock. While the overlay is playing, other WebGL
 * canvases must not be created — two contexts at load stall the doors.
 */

export const INTRO_SESSION_KEY = "upvc-doorway-intro";

let locked = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function isIntroLocked(): boolean {
  return locked;
}

export function lockIntro() {
  if (locked) return;
  locked = true;
  notify();
}

export function unlockIntro() {
  if (!locked) return;
  locked = false;
  notify();
}

export function subscribeIntroLock(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function hasSeenIntro(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    return true;
  }
}
