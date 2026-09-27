/**
 * Parametric uPVC geometry. Every part is extruded from a real profile
 * cross-section with a chamfered edge — the chamfer is what catches the
 * highlight that makes white plastic read as plastic rather than paper.
 *
 * Geometries are cached by parameter signature and shared across instances.
 */

import * as THREE from "three";

const cache = new Map<string, THREE.BufferGeometry>();

function cached(key: string, build: () => THREE.BufferGeometry) {
  let geo = cache.get(key);
  if (!geo) {
    geo = build();
    cache.set(key, geo);
  }
  return geo;
}

function roundedRect(ctx: THREE.Path, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4));
  const x = -w / 2;
  const y = -h / 2;

  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

/**
 * A closed profile ring — the outer frame, a sash, or a glazing bead.
 * Extruded as one continuous shape so the mitred corners are seamless.
 * Returned geometry is centred on all three axes.
 */
export function ringGeometry(
  width: number,
  height: number,
  face: number,
  depth: number,
  cornerRadius = 0.005
): THREE.BufferGeometry {
  const key = `ring:${width}:${height}:${face}:${depth}:${cornerRadius}`;

  return cached(key, () => {
    const shape = new THREE.Shape();
    roundedRect(shape, width, height, cornerRadius);

    const hole = new THREE.Path();
    roundedRect(hole, width - face * 2, height - face * 2, cornerRadius * 0.6);
    shape.holes.push(hole);

    const bevel = Math.min(0.0035, face * 0.14, depth * 0.1);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: depth - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelOffset: 0,
      bevelSegments: 2,
      curveSegments: 3,
    });

    geo.translate(0, 0, -depth / 2 + bevel);
    return geo;
  });
}

/** Chamfered slab — glazing units, door panels, sills, thresholds. */
export function slabGeometry(
  width: number,
  height: number,
  depth: number,
  cornerRadius = 0.003
): THREE.BufferGeometry {
  const key = `slab:${width}:${height}:${depth}:${cornerRadius}`;

  return cached(key, () => {
    const shape = new THREE.Shape();
    roundedRect(shape, width, height, cornerRadius);

    const bevel = Math.min(0.0025, depth * 0.2);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: depth - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelOffset: 0,
      bevelSegments: 1,
      curveSegments: 2,
    });

    geo.translate(0, 0, -depth / 2 + bevel);
    return geo;
  });
}

/** Flat pane with no bevel — used behind transmissive glass for reflections. */
export function paneGeometry(width: number, height: number) {
  const key = `pane:${width}:${height}`;
  return cached(key, () => new THREE.PlaneGeometry(width, height));
}

/** Horizontal glazing bar spanning a leaf. */
export function barGeometry(width: number, thickness: number, depth: number) {
  return slabGeometry(width, thickness, depth, 0.002);
}

/**
 * Procedural woodgrain. Generated once on a canvas so woodgrain finishes need
 * no downloaded texture — used as roughness and subtle normal variation.
 */
let grainTexture: THREE.Texture | null = null;

export function getGrainTexture(): THREE.Texture | null {
  if (grainTexture) return grainTexture;
  if (typeof document === "undefined") return null;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);

  // Long grain fibres running along the profile length.
  for (let i = 0; i < 1400; i++) {
    const y = Math.random() * size;
    const length = 40 + Math.random() * 300;
    const x = Math.random() * size;
    const shade = 96 + Math.random() * 90;
    ctx.strokeStyle = `rgba(${shade},${shade},${shade},${0.1 + Math.random() * 0.3})`;
    ctx.lineWidth = 0.4 + Math.random() * 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x + length * 0.33,
      y + (Math.random() - 0.5) * 5,
      x + length * 0.66,
      y + (Math.random() - 0.5) * 5,
      x + length,
      y + (Math.random() - 0.5) * 3
    );
    ctx.stroke();
  }

  // Occasional darker cathedral figure.
  for (let i = 0; i < 18; i++) {
    const y = Math.random() * size;
    ctx.strokeStyle = `rgba(70,70,70,${0.08 + Math.random() * 0.12})`;
    ctx.lineWidth = 1.5 + Math.random() * 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(size * 0.3, y + 14, size * 0.6, y - 14, size, y + 4);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.anisotropy = 4;
  grainTexture = texture;
  return texture;
}

export function disposeUpvcGeometryCache() {
  cache.forEach((geo) => geo.dispose());
  cache.clear();
  grainTexture?.dispose();
  grainTexture = null;
}
