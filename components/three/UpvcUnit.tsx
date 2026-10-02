"use client";

/**
 * A complete uPVC unit: outer frame, leaves, sealed glazing units, beads,
 * gaskets and furniture — all generated from a UpvcModelSpec.
 *
 * Opening is driven imperatively in useFrame so scroll-linked animation never
 * re-renders React. Pass `open` for a discrete target, or `openSource` for a
 * per-frame value (used by the scroll hero).
 */

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type {
  FinishSpec,
  GlazingSpec,
  HardwareSpec,
  UpvcModelSpec,
} from "@/lib/upvc3d";
import { SETTLE_EPSILON, useInvalidateOn } from "./demand";
import { ringGeometry, slabGeometry } from "./geometry";
import {
  useGasketMaterial,
  useGlassMaterial,
  useHardwareMaterial,
  useThresholdMaterial,
  useUpvcMaterial,
  type RenderQuality,
} from "./materials";
import { DoorHandle, Hinges, Letterplate, WindowHandle } from "./UpvcHardware";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

type EdgeSide = "left" | "right";

/**
 * A sculptured profile: an outer flange with the main face stepped back behind
 * it. Real extrusions are never a flat picture frame, and the step is what
 * gives the frame its shadow line.
 */
function Profile({
  width,
  height,
  face,
  depth,
  material,
}: {
  width: number;
  height: number;
  face: number;
  depth: number;
  material: THREE.Material;
}) {
  const flangeFace = face * 0.42;
  const innerFace = face - flangeFace;
  const step = depth * 0.1;

  return (
    <group>
      <mesh
        geometry={ringGeometry(width, height, flangeFace, depth)}
        material={material}
      />
      <mesh
        geometry={ringGeometry(
          width - flangeFace * 2 + 0.001,
          height - flangeFace * 2 + 0.001,
          innerFace,
          depth - step * 2
        )}
        material={material}
        position={[0, 0, -step]}
      />
    </group>
  );
}

interface GlazedApertureProps {
  width: number;
  height: number;
  y: number;
  spec: UpvcModelSpec;
  upvcMat: THREE.Material;
  glassMat: THREE.Material;
  gasketMat: THREE.Material;
  bars: number;
}

function GlazedAperture({
  width,
  height,
  y,
  spec,
  upvcMat,
  glassMat,
  gasketMat,
  bars,
}: GlazedApertureProps) {
  const beadZ = spec.sashDepth / 2 - spec.beadDepth / 2;

  return (
    <group position={[0, y, 0]}>
      {/* EPDM gasket wrapping the edge of the sealed unit */}
      <mesh
        geometry={ringGeometry(width + 0.005, height + 0.005, 0.008, spec.sashDepth * 0.62, 0.002)}
        material={gasketMat}
      />

      {/* Sealed double-glazed unit */}
      <mesh geometry={slabGeometry(width, height, 0.026, 0.002)} material={glassMat} />

      {/* Internal glazing bead, then the slimmer external weather bead */}
      <mesh
        geometry={ringGeometry(width + 0.02, height + 0.02, spec.beadFace, spec.beadDepth, 0.002)}
        material={upvcMat}
        position={[0, 0, beadZ]}
      />
      <mesh
        geometry={ringGeometry(
          width + 0.02,
          height + 0.02,
          spec.beadFace * 0.7,
          spec.beadDepth * 0.8,
          0.002
        )}
        material={upvcMat}
        position={[0, 0, -beadZ]}
      />

      {Array.from({ length: bars }, (_, i) => (
        <mesh
          key={i}
          geometry={slabGeometry(width, spec.sashFace * 0.42, spec.sashDepth * 0.85, 0.002)}
          material={upvcMat}
          position={[0, -height / 2 + (height * (i + 1)) / (bars + 1), 0]}
        />
      ))}
    </group>
  );
}

interface LeafProps {
  width: number;
  height: number;
  spec: UpvcModelSpec;
  upvcMat: THREE.Material;
  glassMat: THREE.Material;
  gasketMat: THREE.Material;
  hardwareMat: THREE.Material;
  isDoor: boolean;
  /** Stile the handle sits on — the edge opposite the hinge */
  freeEdge: EdgeSide | null;
  hingeSide: EdgeSide | null;
  leverRef?: React.Ref<THREE.Group>;
}

function Leaf({
  width,
  height,
  spec,
  upvcMat,
  glassMat,
  gasketMat,
  hardwareMat,
  isDoor,
  freeEdge,
  hingeSide,
  leverRef,
}: LeafProps) {
  const apertureW = width - spec.sashFace * 2;
  const apertureH = height - spec.sashFace * 2;
  const faceZ = spec.sashDepth / 2;

  // A panelled door splits the aperture into glazing over a solid panel.
  const railH = spec.sashFace * 1.15;
  const panelH = spec.lowerPanel ? apertureH * 0.4 : 0;
  const glassH = spec.lowerPanel ? apertureH - panelH - railH : apertureH;
  const glassY = spec.lowerPanel ? apertureH / 2 - glassH / 2 : 0;
  const railY = apertureH / 2 - glassH - railH / 2;
  const panelY = -apertureH / 2 + panelH / 2;

  const handleX =
    freeEdge === "right"
      ? width / 2 - spec.sashFace / 2
      : -width / 2 + spec.sashFace / 2;

  return (
    <group>
      {/* Sash profile */}
      <Profile
        width={width}
        height={height}
        face={spec.sashFace}
        depth={spec.sashDepth}
        material={upvcMat}
      />

      <GlazedAperture
        width={apertureW}
        height={glassH}
        y={glassY}
        spec={spec}
        upvcMat={upvcMat}
        glassMat={glassMat}
        gasketMat={gasketMat}
        bars={spec.glazingBars}
      />

      {spec.lowerPanel && (
        <>
          {/* Mid rail */}
          <mesh
            geometry={slabGeometry(apertureW, railH, spec.sashDepth, 0.002)}
            material={upvcMat}
            position={[0, railY, 0]}
          />
          {/* Raised lower panel with a moulded surround */}
          <mesh
            geometry={slabGeometry(apertureW, panelH, spec.sashDepth * 0.7, 0.003)}
            material={upvcMat}
            position={[0, panelY, 0]}
          />
          <mesh
            geometry={ringGeometry(
              apertureW - 0.04,
              panelH - 0.04,
              0.022,
              spec.sashDepth * 0.22,
              0.004
            )}
            material={upvcMat}
            position={[0, panelY, spec.sashDepth * 0.42]}
          />
          <Letterplate
            material={hardwareMat}
            position={[0, panelY + panelH / 2 - 0.02, faceZ + 0.005]}
          />
        </>
      )}

      {hingeSide && (
        <Hinges
          material={hardwareMat}
          count={isDoor ? 3 : 2}
          span={height}
          position={[hingeSide === "left" ? -width / 2 : width / 2, 0, faceZ * 0.35]}
        />
      )}

      {freeEdge &&
        (isDoor ? (
          <DoorHandle
            material={hardwareMat}
            leverRef={leverRef}
            position={[handleX, spec.handleY, faceZ + 0.004]}
          />
        ) : (
          <WindowHandle
            material={hardwareMat}
            leverRef={leverRef}
            position={[handleX, spec.handleY, faceZ + 0.004]}
          />
        ))}
    </group>
  );
}

export interface UpvcUnitProps {
  spec: UpvcModelSpec;
  finish: FinishSpec;
  hardware: HardwareSpec;
  glazing: GlazingSpec;
  quality?: RenderQuality;
  isDoor?: boolean;
  /** Discrete target, 0 = shut, 1 = fully open */
  open?: number;
  /** Per-frame target; takes precedence over `open` */
  openSource?: () => number;
  /** Higher settles faster */
  damping?: number;
}

export function UpvcUnit({
  spec,
  finish,
  hardware,
  glazing,
  quality = "high",
  isDoor = false,
  open = 0,
  openSource,
  damping = 3.4,
}: UpvcUnitProps) {
  const upvcMat = useUpvcMaterial(finish, quality);
  const hardwareMat = useHardwareMaterial(hardware);
  const glassMat = useGlassMaterial(glazing, quality);
  const gasketMat = useGasketMaterial();
  const thresholdMat = useThresholdMaterial();

  const layout = useMemo(() => {
    const innerW = spec.width - spec.frameFace * 2;
    const innerH = spec.height - spec.frameFace * 2;
    const gap = 0.004;
    const isSlide = spec.rig.kind === "slide";

    // Sliding leaves overlap at the meeting stile; everything else divides the
    // structural opening evenly with a shadow gap.
    const leafW = isSlide ? innerW / 2 + 0.035 : innerW / spec.leaves - gap;
    const leafH = innerH - gap;
    const bay = innerW / spec.leaves;
    const sashZ = spec.frameDepth / 2 - spec.sashDepth / 2 - 0.007;
    const trackGap = spec.sashDepth * 1.08;

    const centres = Array.from(
      { length: spec.leaves },
      (_, i) => -innerW / 2 + bay * (i + 0.5)
    );

    if (isSlide) {
      centres[0] = -innerW / 2 + leafW / 2;
      centres[1] = innerW / 2 - leafW / 2;
    }

    return { innerW, innerH, leafW, leafH, sashZ, trackGap, centres };
  }, [spec]);

  const pivots = useRef<Array<THREE.Group | null>>([]);
  const tiltPivot = useRef<THREE.Group>(null);
  const lever = useRef<THREE.Group>(null);
  const progress = useRef(0);

  const leverSweep = useMemo(() => {
    const rig = spec.rig;
    if (rig.kind === "swing") {
      return rig.hinges[spec.handleLeaf % rig.hinges.length] === "left" ? -1 : 1;
    }
    if (rig.kind === "tilt-turn" || rig.kind === "fold") {
      return rig.hinge === "left" ? -1 : 1;
    }
    return -1;
  }, [spec.rig, spec.handleLeaf]);

  useInvalidateOn([open, openSource]);

  useFrame((state, delta) => {
    const target = clamp01(openSource ? openSource() : open);
    progress.current = THREE.MathUtils.damp(
      progress.current,
      target,
      damping,
      Math.min(delta, 0.1)
    );
    if (Math.abs(target - progress.current) < SETTLE_EPSILON) {
      progress.current = target;
    } else {
      state.invalidate();
    }

    const p = progress.current;
    const rig = spec.rig;

    // The lever always throws first, then the leaf moves.
    if (lever.current) {
      lever.current.rotation.z =
        smooth(clamp01(p / 0.16)) * (Math.PI / 2) * leverSweep;
    }

    const sashP = smooth(clamp01((p - 0.12) / 0.88));

    switch (rig.kind) {
      case "swing": {
        for (let i = 0; i < spec.leaves; i++) {
          const group = pivots.current[i];
          if (!group) continue;
          const hinge = rig.hinges[i % rig.hinges.length];
          group.rotation.y = (hinge === "left" ? -1 : 1) * rig.maxAngle * sashP;
        }
        break;
      }

      case "slide": {
        const group = pivots.current[1];
        if (group) {
          group.position.x =
            layout.centres[1] - rig.travel * layout.leafW * sashP;
        }
        break;
      }

      case "tilt-turn": {
        // Tilt open, tilt shut, then turn — how the handle actually sequences.
        const tilt =
          smooth(clamp01(p / 0.3)) * (1 - smooth(clamp01((p - 0.42) / 0.14)));
        const turn = smooth(clamp01((p - 0.58) / 0.42));

        if (tiltPivot.current) tiltPivot.current.rotation.x = rig.tiltAngle * tilt;
        const group = pivots.current[0];
        if (group) {
          group.rotation.y = (rig.hinge === "left" ? -1 : 1) * rig.turnAngle * turn;
        }
        break;
      }

      case "fold": {
        const a = rig.maxAngle * sashP;
        for (let i = 0; i < spec.leaves; i++) {
          const group = pivots.current[i];
          if (!group) continue;
          group.rotation.y = i === 0 ? -a : i % 2 === 1 ? 2 * a : -2 * a;
        }
        break;
      }
    }
  });

  const leafCommon = {
    width: layout.leafW,
    height: layout.leafH,
    spec,
    upvcMat,
    glassMat,
    gasketMat,
    hardwareMat,
    isDoor,
  };

  const setPivot = (i: number) => (el: THREE.Group | null) => {
    pivots.current[i] = el;
  };

  function renderLeaves() {
    const rig = spec.rig;
    const { leafW, leafH, sashZ, trackGap, centres, innerW } = layout;

    if (rig.kind === "fixed") {
      return (
        <group position={[centres[0], 0, sashZ]}>
          <Leaf {...leafCommon} freeEdge={null} hingeSide={null} />
        </group>
      );
    }

    if (rig.kind === "slide") {
      return centres.map((cx, i) => (
        <group
          key={i}
          ref={setPivot(i)}
          position={[cx, 0, sashZ - (i === 0 ? trackGap : 0)]}
        >
          <Leaf
            {...leafCommon}
            freeEdge={i === spec.handleLeaf ? "left" : null}
            hingeSide={null}
            leverRef={i === spec.handleLeaf ? lever : undefined}
          />
        </group>
      ));
    }

    if (rig.kind === "tilt-turn") {
      const hinge = rig.hinge;
      const cx = centres[0];
      const pivotX = hinge === "left" ? cx - leafW / 2 : cx + leafW / 2;
      const innerX = hinge === "left" ? leafW / 2 : -leafW / 2;

      return (
        <group ref={setPivot(0)} position={[pivotX, 0, sashZ]}>
          <group position={[innerX, 0, 0]}>
            <group ref={tiltPivot} position={[0, -leafH / 2, 0]}>
              <group position={[0, leafH / 2, 0]}>
                <Leaf
                  {...leafCommon}
                  freeEdge={hinge === "left" ? "right" : "left"}
                  hingeSide={hinge}
                  leverRef={lever}
                />
              </group>
            </group>
          </group>
        </group>
      );
    }

    if (rig.kind === "fold") {
      // Each panel hinges off the free edge of the one before it, so the stack
      // concertinas toward the jamb exactly like a bi-fold on a track.
      const build = (i: number): React.ReactNode => {
        if (i >= spec.leaves) return null;

        return (
          <group
            key={i}
            ref={setPivot(i)}
            position={i === 0 ? [-innerW / 2, 0, sashZ] : [leafW / 2, 0, 0]}
          >
            <group position={[leafW / 2, 0, 0]}>
              <Leaf
                {...leafCommon}
                freeEdge={i === spec.handleLeaf ? "right" : null}
                hingeSide={i === 0 ? "left" : null}
                leverRef={i === spec.handleLeaf ? lever : undefined}
              />
              {build(i + 1)}
            </group>
          </group>
        );
      };

      return build(0);
    }

    return centres.map((cx, i) => {
      const hinge = rig.hinges[i % rig.hinges.length];
      const pivotX = hinge === "left" ? cx - leafW / 2 : cx + leafW / 2;
      const innerX = hinge === "left" ? leafW / 2 : -leafW / 2;

      return (
        <group key={i} ref={setPivot(i)} position={[pivotX, 0, sashZ]}>
          <group position={[innerX, 0, 0]}>
            <Leaf
              {...leafCommon}
              freeEdge={i === spec.handleLeaf ? (hinge === "left" ? "right" : "left") : null}
              hingeSide={hinge}
              leverRef={i === spec.handleLeaf ? lever : undefined}
            />
          </group>
        </group>
      );
    });
  }

  return (
    <group>
      {/* Outer frame */}
      <Profile
        width={spec.width}
        height={spec.height}
        face={spec.frameFace}
        depth={spec.frameDepth}
        material={upvcMat}
      />

      {spec.hasSill && (
        <mesh
          geometry={slabGeometry(spec.width + 0.1, 0.03, spec.frameDepth + 0.055, 0.004)}
          material={upvcMat}
          position={[0, -spec.height / 2 - 0.015, 0.014]}
          rotation={[-0.06, 0, 0]}
        />
      )}

      {spec.hasThreshold && (
        <mesh
          geometry={slabGeometry(spec.width, 0.024, spec.frameDepth + 0.018, 0.003)}
          material={thresholdMat}
          position={[0, -spec.height / 2 - 0.012, 0]}
        />
      )}

      {/* Rigs only write the transforms they use, so a leaf reused from another
          rig would keep its stale rotation. Keying forces fresh pivots. */}
      <group key={`${spec.rig.kind}-${spec.leaves}-${spec.width}-${spec.height}`}>
        {renderLeaves()}
      </group>
    </group>
  );
}
