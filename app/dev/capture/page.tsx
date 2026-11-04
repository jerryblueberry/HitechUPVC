import { notFound } from "next/navigation";
import { CaptureStudio } from "@/components/dev/CaptureStudio";

export const metadata = { robots: { index: false, follow: false } };

/** Renders the home sequences frame by frame. Dev server only. */
export default function CapturePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <CaptureStudio />;
}
