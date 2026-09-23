import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");
const generalLimit = 300 * 1024;
const videoLimit = Math.round(1.5 * 1024 * 1024);
const videoExtensions = new Set([".mp4", ".webm"]);

function isOg(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");
  const base = path.basename(normalized).toLowerCase();
  return (
    normalized.startsWith("og/") ||
    normalized.includes("/og/") ||
    base.startsWith("og-") ||
    base.startsWith("opengraph")
  );
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${Math.ceil(bytes / 1024)} KB`;
}

const directoryStat = await stat(publicDir).catch(() => null);
if (!directoryStat?.isDirectory()) {
  process.exit(0);
}

const offenders = [];

for (const filePath of await walk(publicDir)) {
  const relativePath = path.relative(publicDir, filePath);
  if (relativePath === "resume.pdf") continue;
  if (isOg(relativePath)) continue;

  const { size } = await stat(filePath);
  const extension = path.extname(filePath).toLowerCase();

  if (videoExtensions.has(extension)) {
    if (size > videoLimit) {
      offenders.push(
        `${relativePath} is ${formatBytes(size)} (video limit ${formatBytes(videoLimit)})`,
      );
    }
    continue;
  }

  if (size > generalLimit) {
    offenders.push(
      `${relativePath} is ${formatBytes(size)} (limit ${formatBytes(generalLimit)})`,
    );
  }
}

if (offenders.length > 0) {
  console.error("Asset size check failed. These files in public/ are over the budget:");
  for (const line of offenders) console.error(`  ${line}`);
  process.exit(1);
}
