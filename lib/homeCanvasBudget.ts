/**
 * Home page keeps at most one live WebGL product canvas warm.
 * When the scroll-door pin approaches, the hero releases its context so a
 * mid-tier phone gets the same smooth live door as desktop — without stacking
 * two HDRI canvases.
 */

type Listener = () => void;

let doorClaimed = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function claimHomeDoorCanvas() {
  if (doorClaimed) return;
  doorClaimed = true;
  emit();
}

export function releaseHomeDoorCanvas() {
  if (!doorClaimed) return;
  doorClaimed = false;
  emit();
}

export function isHomeDoorCanvasClaimed() {
  return doorClaimed;
}

/** Drop a stale claim (HMR / early prefetch) so the hero can live again. */
export function resetHomeDoorCanvasClaim() {
  if (!doorClaimed) return;
  doorClaimed = false;
  emit();
}

export function subscribeHomeDoorCanvas(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
