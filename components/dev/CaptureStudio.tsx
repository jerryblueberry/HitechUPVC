"use client";

/**
 * Offline renderer for the home frame sequences. Each job mounts the real
 * scene at the sequence's pixel size, steps it through its motion, lets every
 * damped value settle, then posts the frame to `/api/dev-capture`.
 *
 * Usage (dev server): open `/dev/capture?job=all`, or a comma list such as
 * `?job=door-landscape,hero-french`. Progress is on screen and on
 * `window.__capture`.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { UpvcScrollScene, type CameraShot } from "@/components/three/UpvcScrollScene";
import { UpvcViewer } from "@/components/three/UpvcViewer";
import { HERO_3D_SLIDES, type Hero3DSlide } from "@/lib/heroSlides";
import {
  doorCaptureSequence,
  heroCaptureSequence,
  type FrameSequence,
} from "@/lib/sequences";
import { LANDSCAPE_SHOTS, PORTRAIT_SHOTS } from "./doorShots";

type Job =
  | { name: string; kind: "door"; sequence: FrameSequence; shots: CameraShot[] }
  | { name: string; kind: "hero"; sequence: FrameSequence; slide: Hero3DSlide };

const JOBS: Job[] = [
  {
    name: "door-landscape",
    kind: "door",
    sequence: doorCaptureSequence("landscape"),
    shots: LANDSCAPE_SHOTS,
  },
  {
    name: "door-portrait",
    kind: "door",
    sequence: doorCaptureSequence("portrait"),
    shots: PORTRAIT_SHOTS,
  },
  ...HERO_3D_SLIDES.map(
    (slide): Job => ({
      name: `hero-${slide.id}`,
      kind: "hero",
      sequence: heroCaptureSequence(slide.id),
      slide,
    })
  ),
];

/** The door camera and leaf are damped (λ 18 and 9); this outlasts both. */
const DOOR_SETTLE_MS = 650;
const HERO_SETTLE_MS = 420;
const WEBP_QUALITY = 0.86;

interface CaptureStatus {
  job: string;
  frame: number;
  total: number;
  done: boolean;
  error: string | null;
  bytes: number;
}

declare global {
  interface Window {
    __capture?: CaptureStatus;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const noopSubscribe = () => () => {};

function sequenceName(sequence: FrameSequence) {
  return sequence.dir.split("/").pop() ?? "";
}

async function grabFrame(host: HTMLElement, sequence: FrameSequence): Promise<Blob> {
  const source = host.querySelector("canvas");
  if (!source) throw new Error("No canvas to capture");
  const out = document.createElement("canvas");
  out.width = sequence.width;
  out.height = sequence.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("No 2D context");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, sequence.width, sequence.height);
  return new Promise((resolve, reject) =>
    out.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("WebP encode failed"))),
      "image/webp",
      WEBP_QUALITY
    )
  );
}

function JobRunner({
  job,
  onProgress,
  onDone,
}: {
  job: Job;
  onProgress: (frame: number, bytes: number) => void;
  onDone: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [open, setOpen] = useState(0);
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const { sequence } = job;
  const dpr = window.devicePixelRatio || 1;

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    const run = async () => {
      // Shader compile, HDRI decode and the stage fade all land first.
      await sleep(1500);
      let bytes = 0;
      for (let i = 0; i < sequence.count; i++) {
        if (cancelled) return;
        const t = sequence.count === 1 ? 0 : i / (sequence.count - 1);
        if (job.kind === "door") {
          progressRef.current = t;
          // The camera rig wakes on scroll, then keeps drawing until settled.
          window.dispatchEvent(new Event("scroll"));
          await sleep(DOOR_SETTLE_MS);
        } else {
          setOpen(t);
          await sleep(HERO_SETTLE_MS);
        }
        await nextFrame();
        await nextFrame();
        if (cancelled || !hostRef.current) return;

        const blob = await grabFrame(hostRef.current, sequence);
        const response = await fetch(
          `/api/dev-capture?seq=${sequenceName(sequence)}&i=${i}`,
          { method: "POST", body: blob }
        );
        if (!response.ok) throw new Error(`Save failed: ${response.status}`);
        bytes += blob.size;
        onProgress(i + 1, bytes);
      }
      onDone();
    };

    run().catch((error: unknown) => {
      window.__capture = {
        ...(window.__capture as CaptureStatus),
        error: error instanceof Error ? error.message : String(error),
      };
    });
    return () => {
      cancelled = true;
    };
  }, [ready, job, sequence, onProgress, onDone]);

  return (
    <div
      ref={hostRef}
      style={{ width: sequence.width / dpr, height: sequence.height / dpr }}
      className="relative shrink-0 outline outline-1 outline-charcoal/20"
    >
      {job.kind === "door" ? (
        <UpvcScrollScene
          progressRef={progressRef}
          shots={job.shots}
          openingType="hinged"
          category="doors"
          hardwareSlug="brushed"
          className="h-full w-full"
          fallback={null}
          onReady={handleReady}
          capture
        />
      ) : (
        <UpvcViewer
          openingType={job.slide.openingType}
          category={job.slide.category}
          open={open}
          damping={60}
          quality="high"
          eager
          capture
          maxDpr={2}
          className="h-full w-full"
          onReady={handleReady}
        />
      )}
    </div>
  );
}

export function CaptureStudio() {
  const search = useSyncExternalStore(
    noopSubscribe,
    () => window.location.search,
    () => null
  );
  const [jobIndex, setJobIndex] = useState(0);
  const [status, setStatus] = useState<CaptureStatus | null>(null);

  const requested = new URLSearchParams(search ?? "").get("job") ?? "";
  const jobs =
    requested === "all"
      ? JOBS
      : JOBS.filter((job) => requested.split(",").includes(job.name));
  const job = jobs[jobIndex];

  const handleProgress = useCallback(
    (frame: number, bytes: number) => {
      if (!job) return;
      const next: CaptureStatus = {
        job: job.name,
        frame,
        total: job.sequence.count,
        done: false,
        error: null,
        bytes,
      };
      window.__capture = next;
      setStatus(next);
    },
    [job]
  );

  const handleDone = useCallback(() => {
    setJobIndex((index) => {
      const next = index + 1;
      if (next >= jobs.length) {
        window.__capture = { ...(window.__capture as CaptureStatus), done: true };
        setStatus((current) => (current ? { ...current, done: true } : current));
      }
      return next;
    });
  }, [jobs.length]);

  if (search === null) return null;

  return (
    <main className="min-h-screen bg-surface p-6 text-charcoal">
      <p className="mb-4 font-mono text-xs">
        {jobs.length === 0
          ? `No jobs. Use ?job=all or one of: ${JOBS.map((j) => j.name).join(", ")}`
          : status?.done
            ? `Done — ${jobs.length} sequence(s) written to public/images/sequences`
            : `Job ${Math.min(jobIndex + 1, jobs.length)}/${jobs.length} · ${job?.name ?? ""} · frame ${status?.job === job?.name ? status?.frame : 0}/${job?.sequence.count ?? 0}`}
      </p>
      {job ? (
        <JobRunner
          key={job.name}
          job={job}
          onProgress={handleProgress}
          onDone={handleDone}
        />
      ) : null}
    </main>
  );
}
