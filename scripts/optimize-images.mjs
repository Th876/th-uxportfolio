import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const originalsDir = path.join(root, "_originals");
const publicDir = path.join(root, "public");
const manifestPath = path.join(root, "scripts", "image-manifest.json");

const budgets = {
  hero: 200 * 1024,
  content: 250 * 1024,
  card: 120 * 1024,
  icon: 20 * 1024,
  about: 150 * 1024,
};

const maxWidths = {
  hero: 2400,
  content: 2400,
  card: 1600,
  icon: 256,
  about: 1600,
};

const qualities = [78, 75];

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const rows = [];
const failures = [];

for (const entry of manifest.images) {
  const sourcePath = path.join(originalsDir, entry.src);
  const sourceStat = await stat(sourcePath);
  const budget = budgets[entry.role];
  const maxWidth = entry.maxWidth ?? maxWidths[entry.role] ?? 2400;

  if (!budget) {
    failures.push(`${entry.src} has unknown role "${entry.role}"`);
    continue;
  }

  const crops = entry.crops?.length
    ? entry.crops
    : [{ name: null, left: 0, top: 0, width: null, height: null }];

  const probe = sharp(sourcePath, { density: 144, limitInputPixels: false });
  const metadata = await probe.metadata();

  if (
    !entry.crops?.length &&
    metadata.width &&
    metadata.height &&
    metadata.height > metadata.width * 2.5
  ) {
    console.warn(
      `${entry.src} is very tall (${metadata.width}×${metadata.height}). Add crops to the manifest instead of shipping the full sheet.`,
    );
  }

  for (const crop of crops) {
    const destBase = crop.name ? `${entry.dest}-${crop.name}` : entry.dest;
    await mkdir(path.dirname(path.join(publicDir, destBase)), { recursive: true });

    for (const format of ["webp", "avif"]) {
      const destPath = path.join(publicDir, `${destBase}.${format}`);
      let written = null;

      for (const quality of qualities) {
        let pipeline = sharp(sourcePath, { density: 144, limitInputPixels: false });
        if (crop.width && crop.height) {
          pipeline = pipeline.extract({
            left: crop.left,
            top: crop.top,
            width: crop.width,
            height: crop.height,
          });
        }
        pipeline = pipeline.rotate().resize({
          width: maxWidth,
          withoutEnlargement: true,
        });

        if (format === "webp") pipeline = pipeline.webp({ quality });
        if (format === "avif") pipeline = pipeline.avif({ quality });

        await pipeline.toFile(destPath);
        const destStat = await stat(destPath);
        written = { quality, size: destStat.size };
        if (destStat.size <= budget) break;
      }

      const relativeDest = path.relative(publicDir, destPath);
      rows.push({
        file: relativeDest,
        oldSize: sourceStat.size,
        newSize: written.size,
        quality: written.quality,
      });

      if (written.size > budget) {
        failures.push(
          `${relativeDest} is ${formatBytes(written.size)} (budget ${formatBytes(budget)} for ${entry.role}). Crop it or lower the source.`,
        );
      }
    }
  }
}

console.log("file\told size\tnew size\tquality");
for (const row of rows) {
  console.log(
    `${row.file}\t${formatBytes(row.oldSize)}\t${formatBytes(row.newSize)}\t${row.quality}`,
  );
}

if (failures.length > 0) {
  console.error("\nThese outputs are still over budget:");
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
