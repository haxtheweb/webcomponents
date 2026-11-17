/**
 * Copy every element's locales/*.json into the build, as they are.
 *
 * Locale files are most of the files in a build (tens of thousands) and the
 * polymer build only ever passed them through unchanged, one at a time,
 * through its whole stream pipeline. polymer.json leaves them out now and
 * this copies them straight across, which writes the same bytes far faster.
 *
 *   node scripts/copy-locales.mjs [build/es6]
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const out = path.resolve(process.argv[2] || "build/es6");
const scope = path.join("node_modules", "@haxtheweb");
const started = Date.now();
const copies = [];
let packages = 0;
for (const name of fs.readdirSync(scope).sort()) {
  const from = path.join(scope, name, "locales");
  let entries;
  try {
    entries = fs.readdirSync(from, { withFileTypes: true });
  } catch (e) {
    continue;
  }
  const names = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name);
  if (!names.length) {
    continue;
  }
  const to = path.join(out, scope, name, "locales");
  fs.mkdirSync(to, { recursive: true });
  names.forEach((file) => {
    copies.push([path.join(from, file), path.join(to, file)]);
  });
  packages += 1;
}
// many small files: copying a batch at a time is several times faster than
// one after another
const files = copies.length;
let next = 0;
await Promise.all(
  Array.from({ length: 64 }, async () => {
    while (next < files) {
      const [from, to] = copies[next];
      next += 1;
      await fs.promises.copyFile(from, to);
    }
  }),
);
console.log(
  `copy-locales: ${files} files from ${packages} packages, ${((Date.now() - started) / 1000).toFixed(1)}s`,
);
