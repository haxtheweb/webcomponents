/**
 * Minify the JS of a build folder with terser, in place, on every CPU core.
 *
 * Does what the old `gulp terser` task did (terser.minify on each *.js file
 * with the same options), but minifies classic scripts as scripts and not as
 * modules (see isModuleSource), spreads the files over worker threads and
 * remembers results between runs:
 *
 * - each file is minified on its own, so the order and the worker it lands on
 *   cannot change its output;
 * - a result is stored under a key made of the terser version, the options
 *   and the file's bytes, so a stored result is exactly what terser would
 *   write again. A file that changed, a new terser or new options miss the
 *   store and are minified as usual.
 *
 * The store lives in node_modules/.cache/hax-ubiquity/terser and is safe to
 * delete at any time.
 *
 *   node scripts/terser-build.mjs build/es6 [--exclude <path prefix>]...
 *   node scripts/terser-build.mjs build/es6 --no-cache     always run terser
 *   HAX_BUILD_CACHE=0 does the same as --no-cache; HAX_BUILD_JOBS=<n> sets
 *   the number of workers (default: one per core).
 */
import console from "node:console";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from "node:worker_threads";

const require = createRequire(import.meta.url);
const { minify } = require("terser");

// the options the build has always used; they are part of the cache key.
// `module` is added per file by optionsFor().
export const TERSER_OPTIONS = {
  ecma: 2022,
  keep_fnames: true,
  mangle: true,
};

/**
 * Is this source an ES module, or a classic script?
 *
 * The build holds both: our elements are modules, but libraries loaded with a
 * plain script tag (through es-global-bridge, or from a site's index.html) are
 * classic scripts, whose top-level names are globals. Minified as a module, a
 * classic script gets those names shortened to `e`, `t`, `r`, and the first
 * one to declare `const e` makes every later script with a top-level `var e`
 * fail with "Identifier 'e' has already been declared".
 *
 * A file is a module when it has an import or export statement, or uses
 * import.meta. Anything else is minified as a script, which leaves its
 * top-level names alone and is also correct for a module with no imports or
 * exports.
 */
export async function isModuleSource(source) {
  if (!/\b(?:import|export)\b/.test(source)) {
    return false;
  }
  if (/\bimport\.meta\b/.test(source)) {
    return true;
  }
  // the words can sit in a string or comment, so ask the parser
  const parsed = await minify(source, {
    parse: { module: true },
    compress: false,
    mangle: false,
    format: { ast: true, code: false },
  });
  return parsed.ast.body.some(
    (node) => node.TYPE === "Import" || node.TYPE === "Export",
  );
}

/** the terser options for one file */
export async function optionsFor(source) {
  return { ...TERSER_OPTIONS, module: await isModuleSource(source) };
}

/**
 * every *.js and *.mjs under dir, skipping dot files and dot folders like
 * gulp.src. .mjs is always a module; vendored ES module bundles ship it
 * (sheet-music's alphaTab.core.mjs is 2.3MB unminified, about 1.3MB after)
 */
export function listJs(dir, excludes, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (excludes.some((ex) => full === ex || full.startsWith(ex + path.sep))) {
      continue;
    }
    if (entry.isDirectory()) {
      listJs(full, excludes, out);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".js") || entry.name.endsWith(".mjs"))
    ) {
      out.push(full);
    }
  }
  return out;
}

async function minifyFile(file, cachePath) {
  const source = fs.readFileSync(file, "utf8");
  const result = await minify(source, await optionsFor(source));
  // an empty result leaves the file as it was, as gulp-terser did
  const code = result.code ? result.code : null;
  if (code !== null) {
    fs.writeFileSync(file, code);
  }
  if (cachePath) {
    const tmp = `${cachePath}.${process.pid}.${workerData ? workerData.id : 0}`;
    fs.writeFileSync(tmp, code === null ? source : code);
    fs.renameSync(tmp, cachePath);
  }
}

if (!isMainThread) {
  parentPort.on("message", async (job) => {
    try {
      await minifyFile(job.file, job.cachePath);
      parentPort.postMessage({ ok: true });
    } catch (e) {
      parentPort.postMessage({
        ok: false,
        file: job.file,
        message: e && e.message ? e.message : String(e),
      });
    }
  });
} else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const excludes = [];
  const dirs = [];
  let useCache = process.env.HAX_BUILD_CACHE !== "0";
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--exclude") {
      i += 1;
      excludes.push(path.resolve(argv[i]));
    } else if (argv[i] === "--no-cache") {
      useCache = false;
    } else {
      dirs.push(path.resolve(argv[i]));
    }
  }
  if (!dirs.length) {
    console.error(
      "usage: node scripts/terser-build.mjs <dir> [--exclude <path>]... [--no-cache]",
    );
    process.exit(2);
  }
  const started = Date.now();
  const cacheDir = path.resolve("node_modules/.cache/hax-ubiquity/terser");
  if (useCache) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  // "per-file-module" marks results made since classic scripts stopped being
  // minified as modules, so older stored results are not reused
  const salt = JSON.stringify([
    require("terser/package.json").version,
    TERSER_OPTIONS,
    "per-file-module",
  ]);
  const jobs = [];
  let files = 0;
  let hits = 0;
  for (const dir of dirs) {
    for (const file of listJs(dir, excludes)) {
      files += 1;
      const bytes = fs.readFileSync(file);
      let cachePath = null;
      if (useCache) {
        const key = createHash("sha256")
          .update(salt)
          .update(bytes)
          .digest("hex");
        cachePath = path.join(cacheDir, key);
        if (fs.existsSync(cachePath)) {
          const stored = fs.readFileSync(cachePath);
          if (!stored.equals(bytes)) {
            fs.writeFileSync(file, stored);
          }
          hits += 1;
          continue;
        }
      }
      jobs.push({ file, cachePath, size: bytes.length });
    }
  }
  // biggest first, so one huge file does not end up last on a single worker
  jobs.sort((a, b) => b.size - a.size);
  const wanted =
    Number(process.env.HAX_BUILD_JOBS) || os.availableParallelism();
  const count = Math.max(1, Math.min(wanted, jobs.length));
  const failures = [];
  await Promise.all(
    Array.from({ length: jobs.length ? count : 0 }, (unused, id) => {
      return new Promise((resolve, reject) => {
        const worker = new Worker(fileURLToPath(import.meta.url), {
          workerData: { id },
        });
        const next = () => {
          const job = jobs.shift();
          if (!job) {
            worker.terminate().then(resolve);
            return;
          }
          worker.postMessage({ file: job.file, cachePath: job.cachePath });
        };
        worker.on("message", (msg) => {
          if (!msg.ok) {
            failures.push(
              `${path.relative(process.cwd(), msg.file)}: ${msg.message}`,
            );
          }
          next();
        });
        worker.on("error", reject);
        next();
      });
    }),
  );
  if (failures.length) {
    console.error(`terser-build: ${failures.length} file(s) failed`);
    failures.forEach((f) => console.error(`  ${f}`));
    process.exit(1);
  }
  console.log(
    `terser-build: ${files} files, ${files - hits} minified on ${count} worker(s), ${hits} from cache, ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );
}
