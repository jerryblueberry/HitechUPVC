"use client";

/**
 * Window and door furniture. The lever rotates from vertical (locked) to
 * horizontal (unlocked) just before the sash moves — the same sequence as a
 * real espagnolette, and the detail that makes the opening feel observed
 * rather than invented.
 *
 * The rotating group is exposed as a ref so UpvcUnit can drive it per frame
 * without re-rendering React.
 */

import { RoundedBox } from "@react-three/drei";
import type { Ref } from "react";
import type * as THREE from "three";

interface HandleProps {
  material: THREE.Material;
  leverRef?: Ref<THREE.Group>;
  position: [number, number, number];
}

export function WindowHandle({ material, leverRef, position }: HandleProps) {
  return (
    <group position={position}>
      {/* Backplate fixed to the sash */}
      <RoundedBox
        args={[0.026, 0.1, 0.009]}
        radius={0.006}
        smoothness={3}
        material={material}
      />

      <group ref={leverRef}>
        <mesh material={material} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.016]}>
          <cylinderGeometry args={[0.012, 0.014, 0.022, 20]} />
        </mesh>
        <RoundedBox
          args={[0.019, 0.1, 0.017]}
          radius={0.008}
          smoothness={3}
          position={[0, -0.05, 0.03]}
          material={material}
        />
        <mesh material={material} position={[0, -0.098, 0.03]}>
          <sphereGeometry args={[0.0095, 16, 12]} />
        </mesh>
      </group>
    </group>
  );
}

export function DoorHandle({ material, leverRef, position }: HandleProps) {
  return (
    <group position={position}>
      {/* Long backplate with the euro cylinder below the lever */}
      <RoundedBox
        args={[0.042, 0.3, 0.008]}
        radius={0.008}
        smoothness={3}
        material={material}
      />
      <mesh material={material} position={[0, -0.09, 0.008]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.013, 0.008, 20]} />
      </mesh>

      <group position={[0, 0.06, 0]}>
        <group ref={leverRef}>
          <mesh material={material} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.016, 0.018, 0.03, 20]} />
          </mesh>
          <RoundedBox
            args={[0.022, 0.125, 0.02]}
            radius={0.009}
            smoothness={3}
            position={[0, -0.062, 0.04]}
            material={material}
          />
          <mesh material={material} position={[0, -0.122, 0.04]}>
            <sphereGeometry args={[0.011, 16, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

interface HingesProps {
  material: THREE.Material;
  count: number;
  /** Leaf height — hinges are distributed across it */
  span: number;
  position: [number, number, number];
}

export function Hinges({ material, count, span, position }: HingesProps) {
  const usable = span * 0.74;

  return (
    <group position={position}>
      {Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const y = -usable / 2 + usable * t;

        return (
          <mesh key={i} material={material} position={[0, y, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.075, 16]} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Letterplate({
  material,
  position,
}: {
  material: THREE.Material;
  position: [number, number, number];
}) {
  return (
    <RoundedBox
      args={[0.28, 0.05, 0.01]}
      radius={0.008}
      smoothness={3}
      position={position}
      material={material}
    />
  );
}
