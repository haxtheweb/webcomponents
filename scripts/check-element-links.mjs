/**
 * Broken in-repo link check for element READMEs and demos
 * (haxtheweb/issues#3262). Plain scripting, no AI; run weekly by
 * .github/workflows/docs-weekly.yml and by hand:
 *
 *   node scripts/check-element-links.mjs [element ...]
 *       prints one line per broken link: <file>:<line>\t<target>
 *       and exits 1 when any is found
 *   node scripts/check-element-links.mjs --markdown [element ...]
 *       the same as a markdown report (for a job summary)
 *
 * Checked: relative links in elements/<name>/README.md (markdown links and
 * images, plus href/src attributes in inline HTML) and href/src attributes in
 * elements/<name>/demo/*.html. A link is broken when the file or folder it
 * points to does not exist in the checkout. Root-relative links ("/x") resolve
 * against the repository root, as the demo server serves it, and a demo's
 * <base href> is honored.
 *
 * Not checked: external URLs (http:, https:, //, mailto:, data:, ...),
 * fragment-only links, anything under node_modules (not part of the repo),
 * templated values (containing ${, {{ or a space) and root-relative paths
 * with no file extension (app routes such as "/step2", not files).
 *
 * Node built-ins only.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ELEMENTS = path.join(ROOT, "elements");

const MD_LINK = /!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^)]*["'])?\s*\)/g;
const ATTR_LINK = /\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const FENCE = /^\s*(```|~~~)/;

function skipTarget(target) {
  if (!target) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return true; // http:, mailto:, data:, ...
  if (target.startsWith("//") || target.startsWith("#")) return true;
  if (/\$\{|\{\{|\s/.test(target)) return true; // templated or not a path
  if (target.split(/[\\/]/).includes("node_modules")) return true;
  const bare = target.split("#")[0].split("?")[0];
  if (bare.startsWith("/") && !/\.[a-z0-9]+$/i.test(bare)) return true; // a route
  return false;
}

const BASE = /<base\s[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i;

// the folder relative links resolve against: the file's own, or its <base href>
function baseDir(root, file, text) {
  const own = path.dirname(file);
  const m = BASE.exec(text);
  if (!m) return own;
  const href = (m[1] || m[2] || "").trim();
  if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//"))
    return own;
  const dir = href.endsWith("/") ? href : path.posix.dirname(href);
  return dir.startsWith("/") ? path.join(root, dir) : path.resolve(own, dir);
}

function exists(root, fromDir, target) {
  let clean = target.split("#")[0].split("?")[0];
  if (!clean) return true;
  try {
    clean = decodeURIComponent(clean);
  } catch (e) {
    // keep the raw value when it is not valid percent-encoding
  }
  const resolved = clean.startsWith("/")
    ? path.join(root, clean)
    : path.resolve(fromDir, clean);
  // a link must stay inside the checkout to count as an in-repo link
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return false;
  return fs.existsSync(resolved);
}

function linksIn(root, file, markdown) {
  const out = [];
  const source = fs.readFileSync(file, "utf8");
  const dir = markdown ? path.dirname(file) : baseDir(root, file, source);
  const lines = source.split(/\r?\n/);
  let inFence = false;
  lines.forEach((line, i) => {
    if (markdown && FENCE.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    const text = markdown ? line.replace(/`[^`]*`/g, "") : line;
    const patterns = markdown ? [MD_LINK, ATTR_LINK] : [ATTR_LINK];
    for (const re of patterns) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text))) {
        const target = (m[1] || m[2] || "").trim();
        if (!skipTarget(target)) out.push({ line: i + 1, target, dir });
      }
    }
  });
  return out;
}

// root: the repository (or test fixture) root holding elements/<name>
export function checkElement(name, root = ROOT) {
  const dir = path.join(root, "elements", name);
  const files = [];
  const readme = path.join(dir, "README.md");
  if (fs.existsSync(readme)) files.push({ file: readme, markdown: true });
  const demo = path.join(dir, "demo");
  if (fs.existsSync(demo)) {
    for (const f of fs.readdirSync(demo).sort()) {
      if (f.endsWith(".html"))
        files.push({ file: path.join(demo, f), markdown: false });
    }
  }
  const broken = [];
  for (const { file, markdown } of files) {
    for (const link of linksIn(root, file, markdown)) {
      if (!exists(root, link.dir, link.target)) {
        broken.push({
          file: path.relative(root, file),
          line: link.line,
          target: link.target,
        });
      }
    }
  }
  return { checked: files.length, broken };
}

function main() {
  const args = process.argv.slice(2);
  const markdown = args.includes("--markdown");
  const asked = args.filter((a) => !a.startsWith("--"));
  const names = asked.length
    ? asked
    : fs
        .readdirSync(ELEMENTS, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort();
  let files = 0;
  const broken = [];
  for (const name of names) {
    const result = checkElement(name);
    files += result.checked;
    broken.push(...result.broken);
  }
  if (markdown) {
    console.log("## Broken in-repo links (element READMEs and demos)");
    console.log("");
    console.log(
      `${files} files in ${names.length} elements checked; ${broken.length} broken link(s).`,
    );
    if (broken.length) {
      console.log("");
      console.log("| File | Line | Target |");
      console.log("| --- | --- | --- |");
      for (const b of broken) {
        // "|" would split the table cell and "`" end the code span
        const target = b.target.replace(/\|/g, "\u00a6").replace(/`/g, "'");
        console.log(`| \`${b.file}\` | ${b.line} | \`${target}\` |`);
      }
    }
  } else {
    for (const b of broken) console.log(`${b.file}:${b.line}\t${b.target}`);
    console.error(
      `${files} files in ${names.length} elements checked; ${broken.length} broken link(s)`,
    );
  }
  process.exitCode = broken.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
