#!/usr/bin/env python3
"""
Encode captured WebP sequences into scroll-scrub WebMs.

Requires imageio-ffmpeg (ships a static binary — no Homebrew needed):
  python3 -m pip install --user imageio-ffmpeg

Usage (from frontend/):
  python3 scripts/encode-sequences.py
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

try:
    import imageio_ffmpeg
except ImportError:
    sys.exit("Install imageio-ffmpeg: python3 -m pip install --user imageio-ffmpeg")

ROOT = Path(__file__).resolve().parents[1]
SEQ = ROOT / "public" / "images" / "sequences"
OUT = ROOT / "public" / "videos"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

JOBS = [
    ("door-portrait", 30),
    ("door-landscape", 30),
    ("hero-french", 24),
    ("hero-sliding", 24),
    ("hero-tilt-turn", 24),
    ("hero-casement", 24),
    ("hero-folding", 24),
]


def encode(name: str, fps: int) -> None:
    folder = SEQ / name
    frames = sorted(folder.glob("*.webp"))
    if len(frames) < 2:
        print(f"skip {name}: need ≥2 frames")
        return

    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f"{name}.webm"
    pattern = str(folder / "%03d.webp")
    cmd = [
        FFMPEG,
        "-y",
        "-framerate",
        str(fps),
        "-i",
        pattern,
        "-vf",
        "format=rgba,format=yuva420p",
        "-c:v",
        "libvpx-vp9",
        "-pix_fmt",
        "yuva420p",
        "-b:v",
        "0",
        "-crf",
        "36",
        "-an",
        "-auto-alt-ref",
        "0",
        "-row-mt",
        "1",
        str(dest),
    ]
    print(f"encode {name} ({len(frames)} frames) → {dest.relative_to(ROOT)}")
    subprocess.run(cmd, check=True)
    print(f"  {dest.stat().st_size // 1024} KB")


def main() -> None:
    for name, fps in JOBS:
        encode(name, fps)


if __name__ == "__main__":
    main()
