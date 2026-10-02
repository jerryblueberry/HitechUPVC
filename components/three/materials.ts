"use client";

/**
 * PBR materials for the uPVC system. Everything is lit by the CC0 studio HDRI
 * in UpvcStage — these only describe surface response.
 */

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { FinishSpec, GlazingSpec, HardwareSpec } from "@/lib/upvc3d";
import { getGrainTexture } from "./geometry";

export type RenderQuality = "high" | "balanced" | "draft";

/** Releases the GPU resources a material holds once it is replaced or unmounted. */
function useDisposeOnUnmount<T extends { dispose(): void }>(value: T): T {
  useEffect(() => () => value.dispose(), [value]);
  return value;
}

/** Frame, sash, bead and panel surfaces. */
export function useUpvcMaterial(
  finish: FinishSpec,
  quality: RenderQuality = "balanced"
) {
  const material = useMemo(() => {
    if (quality === "draft") {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(finish.color),
        roughness: finish.roughness,
        metalness: 0,
      });
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(finish.color),
      roughness: finish.roughness,
      metalness: 0,
      clearcoat: finish.clearcoat,
      clearcoatRoughness: finish.clearcoatRoughness,
      envMapIntensity: 0.9,
      sheen: 0.12,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color("#ffffff"),
    });

    if (finish.woodgrain) {
      const grain = getGrainTexture();
      if (grain) {
        material.roughnessMap = grain;
        material.bumpMap = grain;
        material.bumpScale = 0.02;
      }
    }

    return material;
  }, [
    finish.color,
    finish.roughness,
    finish.clearcoat,
    finish.clearcoatRoughness,
    finish.woodgrain,
    quality,
  ]);

  return useDisposeOnUnmount(material);
}

/** Handles, hinges, letterplates. */
export function useHardwareMaterial(hardware: HardwareSpec) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(hardware.color),
        metalness: hardware.metalness,
        roughness: hardware.roughness,
        envMapIntensity: 1.35,
      }),
    [hardware.color, hardware.metalness, hardware.roughness]
  );

  return useDisposeOnUnmount(material);
}

/**
 * Sealed double-glazed unit. `high` uses real refraction (an extra pass);
 * `balanced` is an alpha-blended pane with clearcoat; `draft` is a cheap
 * standard material for the page-load intro.
 */
export function useGlassMaterial(glazing: GlazingSpec, quality: RenderQuality) {
  const material = useMemo(() => {
    if (quality === "draft") {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(glazing.color),
        roughness: 0.08,
        metalness: 0,
        transparent: true,
        opacity: 0.28 + glazing.density * 0.35,
        side: THREE.DoubleSide,
      });
    }

    if (quality === "high") {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(glazing.color),
        metalness: 0,
        roughness: glazing.roughness,
        ior: 1.52,
        thickness: 0.024,
        transmission: 1 - glazing.density * 0.35,
        specularIntensity: 1,
        envMapIntensity: 1.2,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });
    }

    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(glazing.color),
      metalness: 0,
      roughness: glazing.roughness,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.2,
      transparent: true,
      opacity: 0.22 + glazing.density * 0.45,
      side: THREE.DoubleSide,
    });
  }, [glazing.color, glazing.roughness, glazing.density, quality]);

  return useDisposeOnUnmount(material);
}

/** Anodised aluminium door threshold — never follows the handle finish. */
export function useThresholdMaterial() {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c2c6c9"),
        metalness: 0.5,
        roughness: 0.44,
        envMapIntensity: 1.1,
      }),
    []
  );

  return useDisposeOnUnmount(material);
}

/** EPDM gasket between bead and glass — a thin dark line that sells the detail. */
export function useGasketMaterial() {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#23272b"),
        roughness: 0.92,
        metalness: 0,
        envMapIntensity: 0.4,
      }),
    []
  );

  return useDisposeOnUnmount(material);
}