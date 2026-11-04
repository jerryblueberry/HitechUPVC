import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Dev-only sink for `/dev/capture`: writes one rendered frame into
 * `public/images/sequences/<seq>/<index>.webp`. Index 0 clears the folder, so
 * a re-capture with fewer frames never leaves stale ones behind.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const seq = url.searchParams.get("seq") ?? "";
  const index = Number(url.searchParams.get("i"));
  if (!/^[a-z0-9-]+$/.test(seq) || !Number.isInteger(index) || index < 0 || index > 999) {
    return new Response("Bad request", { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "images", "sequences", seq);
  if (index === 0) await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const bytes = Buffer.from(await request.arrayBuffer());
  await writeFile(path.join(dir, `${String(index).padStart(3, "0")}.webp`), bytes);

  return Response.json({ ok: true, bytes: bytes.length });
}
