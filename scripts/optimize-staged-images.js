#!/usr/bin/env node
/**
 * Lightweight replacement for `imagemin-lint-staged`.
 *
 * `imagemin-lint-staged` pulled in an abandoned dependency chain
 * (imagemin-gifsicle -> gifsicle -> bin-build -> download -> decompress)
 * that has unpatched security advisories with no upstream fix. This
 * script performs the same job (optimize staged raster/vector images
 * before commit) using only `sharp` (raster: png/jpeg/jpg/gif) and
 * `svgo` (vector: svg), both of which are actively maintained.
 *
 * Usage (wired up via the `lint-staged` config in package.json):
 *   node scripts/optimize-staged-images.js <file1> <file2> ...
 *
 * Each file is optimized in place. If the optimized result is not
 * smaller than the original, the file is left untouched.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { optimize } = require("svgo");

async function optimizeRaster(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const original = fs.readFileSync(filePath);
  let pipeline = sharp(original, { animated: ext === ".gif" });

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, effort: 10 });
  } else if (ext === ".jpeg" || ext === ".jpg") {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true });
  } else if (ext === ".gif") {
    pipeline = pipeline.gif({ effort: 10 });
  } else {
    return;
  }

  const optimized = await pipeline.toBuffer();
  // JPEG is lossy: every re-encode of an already optimized photo loses a
  // little more detail for a few bytes. Keep a re-encode only when it saves
  // at least a tenth of the file, so committing the same JPEG again (a
  // rename, a bulk recompress) does not degrade it a generation each time.
  const minimum =
    ext === ".png" || ext === ".gif"
      ? original.length
      : Math.floor(original.length * 0.9);
  if (optimized.length > 0 && optimized.length < minimum) {
    fs.writeFileSync(filePath, optimized);
    console.log(
      `optimize-staged-images: ${filePath} ${original.length}B -> ${optimized.length}B`,
    );
  }
}

function optimizeSvg(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const result = optimize(original, {
    path: filePath,
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            // icons (hax-iconset and friends) carry width/height AND a
            // viewBox; dropping the viewBox stops them scaling in the
            // Safari mask fallback of simple-icon, so always keep it
            removeViewBox: false,
          },
        },
      },
    ],
  });
  if (result.data && result.data.length < original.length) {
    fs.writeFileSync(filePath, result.data);
    console.log(
      `optimize-staged-images: ${filePath} ${original.length}B -> ${result.data.length}B`,
    );
  }
}

/**
 * Icons a DDD design system bridge copies from its upstream icon set
 * (elements/<theme>/icons/ next to design-system/bridge.json) are kept
 * byte for byte as published: the bridge generator's --check compares
 * them with the pinned package, and the NOTICE says they are unchanged.
 */
function isBridgeIcon(filePath) {
  const parts = path.resolve(filePath).split(path.sep);
  const i = parts.lastIndexOf("icons");
  if (i < 1 || parts[i - 2] !== "elements") {
    return false;
  }
  const themeDir = parts.slice(0, i).join(path.sep);
  return fs.existsSync(path.join(themeDir, "design-system", "bridge.json"));
}

async function run() {
  const files = process.argv.slice(2);
  for (const filePath of files) {
    if (!fs.existsSync(filePath) || isBridgeIcon(filePath)) {
      continue;
    }
    const ext = path.extname(filePath).toLowerCase();
    try {
      if (ext === ".svg") {
        optimizeSvg(filePath);
      } else if ([".png", ".jpeg", ".jpg", ".gif"].includes(ext)) {
        await optimizeRaster(filePath);
      }
    } catch (err) {
      // Never block a commit on an optimization failure; just warn.
      console.warn(
        `optimize-staged-images: skipped ${filePath} (${err.message})`,
      );
    }
  }
}

run();
