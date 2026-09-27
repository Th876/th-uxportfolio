import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
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

const qualities = [78, 75, 68, 60];

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const rows = [];
const failures = [];
const imageMeta = {};

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

  let metadata;
  try {
    const probe = sharp(sourcePath, { density: 72, limitInputPixels: false });
    metadata = await probe.metadata();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${entry.src} could not be read (${message.split("\n")[0]})`);
    continue;
  }
  const density = metadata.width && metadata.width >= 2400 ? 72 : 192;

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
      const widths = [...new Set([maxWidth, 1600, 1280, 960].filter((width) => width <= maxWidth))];

      for (const width of widths) {
        for (const quality of qualities) {
          let pipeline = sharp(sourcePath, { density, limitInputPixels: false });
          if (crop.width && crop.height) {
            pipeline = pipeline.extract({
              left: crop.left,
              top: crop.top,
              width: crop.width,
              height: crop.height,
            });
          }
          pipeline = pipeline.rotate().resize({
            width,
            withoutEnlargement: true,
          });

          if (format === "webp") pipeline = pipeline.webp({ quality });
          if (format === "avif") pipeline = pipeline.avif({ quality });

          await pipeline.toFile(destPath);
          const destStat = await stat(destPath);
          written = { quality, size: destStat.size, width };
          if (destStat.size <= budget) break;
        }
        if (written.size <= budget) break;
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

      if (format === "webp") {
        const outputMeta = await sharp(destPath).metadata();
        imageMeta[`/${relativeDest.split(path.sep).join("/")}`] = {
          width: outputMeta.width ?? maxWidth,
          height: outputMeta.height ?? maxWidth,
        };
      }
    }
  }
}

await mkdir(path.join(root, "content"), { recursive: true });
await writeFile(
  path.join(root, "content", "image-meta.ts"),
  `export const imageMeta: Record<string, { width: number; height: number }> = ${JSON.stringify(imageMeta, null, 2)};\n`,
);

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
