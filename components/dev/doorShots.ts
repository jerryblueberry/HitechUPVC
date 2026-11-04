import type { CameraShot } from "@/components/three/UpvcScrollScene";

/**
 * Camera path for the scroll-door capture. Landscape targets sit left of the
 * unit so the product composes into the right of the frame, clear of the
 * caption column.
 */
export const LANDSCAPE_SHOTS: CameraShot[] = [
  { at: 0, position: [0.78, -0.02, 0.82], target: [0.3, -0.07, 0.04] },
  { at: 0.34, position: [2.5, 0.3, 3.7], target: [-0.35, -0.05, 0] },
  { at: 0.66, position: [-2.4, 0.62, 3.8], target: [-0.55, -0.05, 0.1] },
  { at: 1, position: [0.3, 0.05, 5.3], target: [-0.5, -0.02, 0] },
];

/**
 * Portrait: product sits high, captions sit low. Pulled further back so the
 * leaf clears the copy on a narrow frame.
 */
export const PORTRAIT_SHOTS: CameraShot[] = [
  { at: 0, position: [0.58, 0.08, 1.15], target: [0.34, -0.38, 0.02] },
  { at: 0.34, position: [2.2, 0.55, 6.4], target: [0, -0.55, 0] },
  { at: 0.66, position: [-2.2, 0.85, 6.6], target: [-0.1, -0.55, 0.1] },
  { at: 1, position: [0.15, 0.2, 8.0], target: [0, -0.58, 0] },
];
