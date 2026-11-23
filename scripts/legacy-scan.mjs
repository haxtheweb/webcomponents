/**
 * Weekly Modern Web Guidance `legacy-scan` report (haxtheweb/issues#3298).
 * Plain scripting, no AI. It only reads the checkout and prints a report; it
 * never changes a file, opens an issue or a pull request, or comments.
 * Run weekly by .github/workflows/legacy-scan.yml and by hand:
 *
 *   node scripts/legacy-scan.mjs [element ...]
 *       markdown report on stdout (all of elements/, or the named elements)
 *   node scripts/legacy-scan.mjs --json-file <file> [element ...]
 *       also write the filtered findings as JSON
 *   node scripts/legacy-scan.mjs --mwg-dir <dir> [element ...]
 *       use an already unpacked copy of the package (its version is checked,
 *       its bytes are not) instead of downloading it
 *
 * What it reports: older patterns still in element source that Modern Web
 * Guidance (MWG) has a deterministic rule for, grouped by element. That is
 * about a fifth of the MWG guides, and a match can be a deliberate fallback,
 * so the output is a hint list, not a to-do list. AGENTS.md ("Browser support
 * and outside guidance") decides what is worth changing: HAX rules win over
 * MWG, and no fix changes an authorable element's front-end API.
 *
 * The tool: the exact npm version pinned in praw's skills-lock.json
 * (https://github.com/haxtheweb/praw/blob/main/skills-lock.json). The tarball
 * is fetched with `npm pack`, its sha512 is compared with the pinned
 * integrity before anything from it runs, and it is unpacked into a temp
 * folder (the package has no dependencies and no install scripts are run).
 * It runs with DISABLE_TELEMETRY=1, which turns off its usage reporting to
 * Google. A version bump changes MWG_VERSION and MWG_INTEGRITY together, in
 * its own pull request.
 *
 * Left out of the report: third-party and generated files (the same list the
 * license header check uses, plus locales, dist, build and *.min.js), docs,
 * demos and tests (the tool's own default), and anything listed in
 * scripts/legacy-scan.set-aside.json: a guide, or one guide in one file,
 * that HAX has decided not to follow, with the reason.
 *
 * Exit 0 whatever it finds; exit 1 only when the scan itself could not run.
 * Node built-ins only.
 */
import { execFileSync } from "node:child_process";
import console from "node:console";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { isThirdParty } from "./license-header-check.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ELEMENTS = path.join(ROOT, "elements");
const SET_ASIDE_FILE = path.join(ROOT, "scripts", "legacy-scan.set-aside.json");

const MWG_PACKAGE = "modern-web-guidance";
const MWG_VERSION = "1.0.0";
const MWG_INTEGRITY =
  "sha512-vafIZwC8AS6QjM2yyoflZbnc7n3/TVOMLbEMRdPTwcFy0f9/Tq8s5rJQ8UIqRt2KPl9ixravyaMR4nTGuUrcmg==";
const MWG_BIN = path.join("skills", "modern-web-guidance", "modern-web.mjs");
const MWG_GUIDES = path.join("skills", "modern-web-guidance", "guides");

const SKIP_DIR =
  /(^|\/)(locales|node_modules|dist|build|vendor|public|coverage)\//;
const SKIP_NAME = /(\.min\.js|(^|\/)custom-elements\.json)$/;
const ELEMENT_NAME = /^[a-z0-9][a-z0-9-]*$/;
const MAX_BUFFER = 256 * 1024 * 1024;

function fail(message) {
  console.error(`legacy-scan: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { elements: [], jsonFile: "", mwgDir: "" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json-file") opts.jsonFile = argv[++i] || "";
    else if (arg === "--mwg-dir") opts.mwgDir = argv[++i] || "";
    else if (arg.startsWith("--")) fail(`unknown option ${arg}`);
    else opts.elements.push(arg.replace(/^elements\//, "").replace(/\/+$/, ""));
  }
  for (const name of opts.elements) {
    if (!ELEMENT_NAME.test(name) || !fs.existsSync(path.join(ELEMENTS, name)))
      fail(`no such element: ${name}`);
  }
  return opts;
}

/** download the pinned tarball, check its integrity, unpack it; returns the package folder */
function fetchPinned(workDir) {
  let packed;
  try {
    packed = JSON.parse(
      execFileSync(
        "npm",
        [
          "pack",
          `${MWG_PACKAGE}@${MWG_VERSION}`,
          "--json",
          "--ignore-scripts",
          "--pack-destination",
          workDir,
        ],
        { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      ),
    );
  } catch (e) {
    fail(`npm pack ${MWG_PACKAGE}@${MWG_VERSION} failed: ${e.message}`);
  }
  const tarball = path.join(workDir, path.basename(String(packed[0].filename)));
  const digest = crypto
    .createHash("sha512")
    .update(fs.readFileSync(tarball))
    .digest("base64");
  if (`sha512-${digest}` !== MWG_INTEGRITY)
    fail(
      `integrity mismatch for ${MWG_PACKAGE}@${MWG_VERSION}: got sha512-${digest}. Nothing from the package was run.`,
    );
  execFileSync("tar", ["-xzf", tarball, "-C", workDir]);
  return path.join(workDir, "package");
}

function checkVersion(dir) {
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  } catch (e) {
    fail(`${dir} is not an unpacked ${MWG_PACKAGE} package: ${e.message}`);
  }
  if (pkg.name !== MWG_PACKAGE || pkg.version !== MWG_VERSION)
    fail(
      `${dir} holds ${pkg.name}@${pkg.version}, the pin is ${MWG_PACKAGE}@${MWG_VERSION}`,
    );
}

function runScan(mwgDir, target) {
  let out;
  try {
    out = execFileSync(
      process.execPath,
      [path.join(mwgDir, MWG_BIN), "legacy-scan", target, "--json"],
      {
        cwd: ROOT,
        encoding: "utf8",
        maxBuffer: MAX_BUFFER,
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, DISABLE_TELEMETRY: "1" },
      },
    );
  } catch (e) {
    fail(`legacy-scan of ${path.relative(ROOT, target)} failed: ${e.message}`);
  }
  try {
    return JSON.parse(out);
  } catch (e) {
    fail(`legacy-scan did not print JSON: ${e.message}`);
  }
  return null;
}

function findGuideFile(dir, guideId) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const hit = findGuideFile(full, guideId);
      if (hit) return hit;
    } else if (entry.name === `${guideId}.md`) return full;
  }
  return "";
}

/** the Baseline status lines a guide carries for the features it suggests */
function baselineOf(mwgDir, guideId) {
  const file = findGuideFile(path.join(mwgDir, MWG_GUIDES), guideId);
  const found = { widely: [], newly: [] };
  if (!file) return found;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line.startsWith("Baseline status for ")) continue;
    const rest = line.slice("Baseline status for ".length);
    const widely = rest.indexOf(": Widely available");
    const newly = rest.indexOf(": Newly available");
    if (widely > 0) found.widely.push(rest.slice(0, widely));
    else if (newly > 0) found.newly.push(rest.slice(0, newly));
  }
  return found;
}

function baselineText(baseline) {
  const parts = [];
  if (baseline.newly.length) parts.push(`Newly: ${baseline.newly.join(", ")}`);
  if (baseline.widely.length)
    parts.push(`Widely: ${baseline.widely.join(", ")}`);
  return parts.length ? parts.join("; ") : "none stated";
}

function loadSetAside() {
  let data = {};
  if (fs.existsSync(SET_ASIDE_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(SET_ASIDE_FILE, "utf8"));
    } catch (e) {
      fail(
        `scripts/legacy-scan.set-aside.json is not valid JSON: ${e.message}`,
      );
    }
  }
  return {
    guides: new Map(Object.entries(data.guides || {})),
    findings: new Map(Object.entries(data.findings || {})),
  };
}

/** one line of plain text, safe inside a ~~~text block and a table cell */
function plain(value) {
  return String(value)
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[|`~<>]/g, " ")
    .trim()
    .slice(0, 300);
}

function collect(mwgDir, targets) {
  const kept = [];
  const dropped = { generated: 0, setAside: 0 };
  const guides = new Map();
  const setAside = loadSetAside();
  let checked = "";
  let skippedDocsAndTests = 0;
  for (const target of targets) {
    const scan = runScan(mwgDir, target);
    checked = `${Number(scan.activeGuideCount) || 0} guides, ${Number(scan.activeRuleCount) || 0} deterministic rules`;
    skippedDocsAndTests += Number(scan.skippedDocsAndTestsCount) || 0;
    for (const guide of scan.guides || []) {
      for (const rule of guide.rules || []) {
        for (const finding of rule.findings || []) {
          const file = path
            .relative(ROOT, path.resolve(target, String(finding.file)))
            .split(path.sep)
            .join("/");
          if (!file.startsWith("elements/")) continue;
          if (
            SKIP_DIR.test(file) ||
            SKIP_NAME.test(file) ||
            isThirdParty(file)
          ) {
            dropped.generated++;
            continue;
          }
          if (
            setAside.guides.has(guide.guideId) ||
            setAside.findings.has(`${guide.guideId} ${file}`)
          ) {
            dropped.setAside++;
            continue;
          }
          if (!guides.has(guide.guideId))
            guides.set(guide.guideId, {
              guideId: guide.guideId,
              summary: rule.summary || "",
              count: 0,
              elements: new Set(),
            });
          const entry = guides.get(guide.guideId);
          entry.count++;
          entry.elements.add(file.split("/")[1]);
          kept.push({
            element: file.split("/")[1],
            file,
            line: Number(finding.line) || 0,
            guideId: guide.guideId,
            message: finding.message || rule.summary || "",
          });
        }
      }
    }
  }
  kept.sort(
    (a, b) =>
      a.element.localeCompare(b.element) ||
      a.file.localeCompare(b.file) ||
      a.line - b.line,
  );
  for (const entry of guides.values())
    entry.baseline = baselineText(baselineOf(mwgDir, entry.guideId));
  return { kept, dropped, guides, checked, skippedDocsAndTests };
}

function report(result, scope, verified) {
  const lines = [];
  const guides = [...result.guides.values()].sort(
    (a, b) => b.count - a.count || a.guideId.localeCompare(b.guideId),
  );
  const elements = new Set(result.kept.map((f) => f.element));
  lines.push("## Modern Web Guidance legacy-scan");
  lines.push("");
  lines.push(
    `\`${MWG_PACKAGE}@${MWG_VERSION}\` (${verified ? "integrity checked" : "local copy, integrity not checked"}, telemetry off) on ${scope}: **${result.kept.length}** hint${result.kept.length === 1 ? "" : "s"} in ${elements.size} element${elements.size === 1 ? "" : "s"}, from ${guides.length} guide${guides.length === 1 ? "" : "s"}.`,
  );
  lines.push("");
  lines.push(
    'This is a hint list, not a to-do list. The scan only knows the guides with deterministic rules, and a match can be a deliberate fallback. HAX rules win over MWG, and no fix changes an authorable element\'s attributes, usage or labels (AGENTS.md, "Browser support and outside guidance").',
  );
  lines.push("");
  lines.push(
    `Checked: ${result.checked}. Left out: ${result.skippedDocsAndTests} docs, demo and test files (tool default), ${result.dropped.generated} hint${result.dropped.generated === 1 ? "" : "s"} in third-party or generated files, ${result.dropped.setAside} set aside in \`scripts/legacy-scan.set-aside.json\`.`,
  );
  lines.push("");
  if (!result.kept.length) {
    lines.push("Nothing to report.");
    return lines.join("\n") + "\n";
  }
  lines.push("### By guide");
  lines.push("");
  lines.push(
    "| Guide | Hints | Elements | Baseline status of the features the guide names |",
  );
  lines.push("| --- | ---: | ---: | --- |");
  for (const g of guides)
    lines.push(
      `| \`${plain(g.guideId)}\` | ${g.count} | ${g.elements.size} | ${plain(g.baseline)} |`,
    );
  lines.push("");
  lines.push(
    "Widely available features are used freely; Newly available ones go behind feature detection with a working plain path; a feature with no Baseline status is Limited availability and needs a reason in the PR. The list covers every feature a guide names, so check the one a fix would use.",
  );
  lines.push("");
  lines.push(
    `Read a guide with \`DISABLE_TELEMETRY=1 npx -y ${MWG_PACKAGE}@${MWG_VERSION} retrieve <guide>\`.`,
  );
  lines.push("");
  lines.push("### By element");
  lines.push("");
  lines.push("~~~text");
  let current = "";
  for (const f of result.kept) {
    if (f.element !== current) {
      if (current) lines.push("");
      current = f.element;
      lines.push(current);
    }
    lines.push(
      `  ${plain(f.file)}:${f.line}  [${plain(f.guideId)}]  ${plain(f.message)}`,
    );
  }
  lines.push("~~~");
  return lines.join("\n") + "\n";
}

function main(argv) {
  const opts = parseArgs(argv);
  let mwgDir = opts.mwgDir ? path.resolve(opts.mwgDir) : "";
  let workDir = "";
  if (!mwgDir) {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), "legacy-scan-"));
    mwgDir = fetchPinned(workDir);
  }
  checkVersion(mwgDir);
  const targets = opts.elements.length
    ? opts.elements.map((name) => path.join(ELEMENTS, name))
    : [ELEMENTS];
  const scope = opts.elements.length
    ? opts.elements.map((name) => `\`elements/${name}\``).join(", ")
    : "`elements/`";
  const result = collect(mwgDir, targets);
  if (opts.jsonFile)
    fs.writeFileSync(
      opts.jsonFile,
      JSON.stringify(
        {
          package: MWG_PACKAGE,
          version: MWG_VERSION,
          guides: [...result.guides.values()].map((g) => ({
            guideId: g.guideId,
            count: g.count,
            elements: [...g.elements].sort(),
            baseline: g.baseline,
          })),
          findings: result.kept,
          leftOut: {
            docsAndTests: result.skippedDocsAndTests,
            thirdPartyOrGenerated: result.dropped.generated,
            setAside: result.dropped.setAside,
          },
        },
        null,
        2,
      ) + "\n",
    );
  process.stdout.write(report(result, scope, Boolean(workDir)));
  if (workDir) fs.rmSync(workDir, { recursive: true, force: true });
  return 0;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  process.exitCode = main(process.argv.slice(2));
}
