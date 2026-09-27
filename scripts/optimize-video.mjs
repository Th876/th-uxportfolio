import { spawnSync } from "node:child_process";
import { mkdir, readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const ffmpegStatic = require("ffmpeg-static");

const root = process.cwd();
const originalsDir = path.join(root, "_originals");
const publicDir = path.join(root, "public");
const manifest = JSON.parse(
  await readFile(path.join(root, "scripts", "image-manifest.json"), "utf8"),
);
const videoLimit = Math.round(1.5 * 1024 * 1024);

function run(args) {
  const result = spawnSync(ffmpegStatic || "ffmpeg", args, { stdio: "inherit" });
  if (result.error) {
    console.error("ffmpeg is required to encode video. Install it, then re-run.");
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

for (const video of manifest.videos ?? []) {
  const sourcePath = path.join(originalsDir, video.src);
  const sourceStat = await stat(sourcePath);
  const destDir = path.join(publicDir, path.dirname(video.dest));
  await mkdir(destDir, { recursive: true });

  const mp4Path = path.join(publicDir, `${video.dest}.mp4`);
  const webmPath = path.join(publicDir, `${video.dest}.webm`);
  const posterPath = path.join(publicDir, `${video.dest}-poster.webp`);

  const attempts = [
    { crf: 28, webmCrf: 36 },
    { crf: 32, webmCrf: 42 },
    { crf: 36, webmCrf: 48 },
    { crf: 40, webmCrf: 56 },
  ];

  let mp4Size = Infinity;

  for (const attempt of attempts) {
    run([
      "-y",
      "-i",
      sourcePath,
      "-an",
      "-vf",
      "scale=-2:720",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      String(attempt.crf),
      "-movflags",
      "+faststart",
      "-pix_fmt",
      "yuv420p",
      mp4Path,
    ]);
    mp4Size = (await stat(mp4Path)).size;
    if (mp4Size <= videoLimit) break;
  }

  for (const attempt of attempts) {
    run([
      "-y",
      "-i",
      sourcePath,
      "-an",
      "-vf",
      "scale=-2:720",
      "-c:v",
      "libvpx-vp9",
      "-crf",
      String(attempt.webmCrf),
      "-b:v",
      "0",
      "-pix_fmt",
      "yuv420p",
      webmPath,
    ]);
    const webmSize = (await stat(webmPath)).size;
    if (webmSize <= videoLimit) break;
  }

  run([
    "-y",
    "-ss",
    "1",
    "-i",
    sourcePath,
    "-frames:v",
    "1",
    "-vf",
    "scale=1600:-2",
    "-c:v",
    "libwebp",
    "-quality",
    "75",
    posterPath,
  ]);

  const mp4 = await stat(mp4Path);
  const webm = await stat(webmPath);
  const poster = await stat(posterPath);

  console.log("file\told size\tnew size");
  console.log(`${path.relative(publicDir, mp4Path)}\t${formatBytes(sourceStat.size)}\t${formatBytes(mp4.size)}`);
  console.log(`${path.relative(publicDir, webmPath)}\t${formatBytes(sourceStat.size)}\t${formatBytes(webm.size)}`);
  console.log(`${path.relative(publicDir, posterPath)}\t${formatBytes(sourceStat.size)}\t${formatBytes(poster.size)}`);

  const over = [];
  if (mp4.size > videoLimit) over.push(mp4Path);
  if (webm.size > videoLimit) over.push(webmPath);
  if (poster.size > 200 * 1024) over.push(posterPath);

  if (over.length > 0) {
    console.error("Video outputs are still over budget:");
    for (const filePath of over) console.error(`  ${path.relative(publicDir, filePath)}`);
    process.exit(1);
  }
}
