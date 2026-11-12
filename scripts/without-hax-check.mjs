#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * "Works with or without HAX" gate on HAX-capable elements.
 *
 * Invariant (praw RULES.md, "Works With or Without HAX";
 * https://github.com/haxtheweb/issues/issues/3324): anything an author can
 * put in a page body (1) works without the editor, (2) works without
 * HAXcms, and (3) still works when its HTML is pasted onto a plain page
 * that only has the wc-autoload magic script; or the failure is already
 * listed in scripts/without-hax.baseline.json. The baseline only shrinks.
 * Elements built for a HAX site (the haxcms-elements package: site-*
 * blocks, learner progress) are exempt.
 *
 * Which tags: hax-elements-registry.json, with the module that defines
 * each from wc-registry.json. Checks, per tag:
 *
 * - static: the module's import graph inside the monorepo. A static import
 *   that reaches editor code (hax-body, h-a-x, super-daemon) or HAXcms code
 *   (haxcms-elements, app-hax) is a finding; a path through an import() is
 *   lazy, which is the allowed way to reach them, and is only listed.
 * - bare: Chromium opens a page with no editor and no HAXcms, imports only
 *   the element's module and inserts each demoSchema entry the way HAX
 *   does. It must define, not throw, render something with a size, and not
 *   pull editor or HAXcms modules in at runtime.
 * - paste: the HTML the bare level inserted goes, as plain markup, onto a
 *   page with only wc-autoload and wc-registry.json. It must upgrade, not
 *   throw and render something.
 *
 * Pages are served locally by the repo's web-dev-server config with every
 * outside request aborted, never a live site. A tag with new findings runs
 * again and only what both runs show counts.
 *
 *   yarn test:without-hax                     tags in element folders changed vs the base branch
 *   yarn test:without-hax --base <ref>        compare with another ref (CI passes HEAD^1)
 *   yarn test:without-hax --tags a-b,c-d      only these tags
 *   yarn test:without-hax --all               every authorable tag
 *   yarn test:without-hax --static            import graph only (no browser)
 *   yarn test:without-hax --report <file>     also write every finding as markdown
 *   yarn test:without-hax --update-baseline   drop what is fixed (only removes)
 *   yarn test:without-hax --update-baseline --allow-additions   only add (CI fails a baseline that grew)
 *   yarn test:without-hax --check-baseline <ref>   fail if the baseline grew compared with <ref>
 *
 * Exit 1 on a new finding (or a grown baseline), 0 otherwise.
 */
import { execFileSync } from "node:child_process";
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { changedFiles, changedFolders } from "./lib/i18n-layout.mjs";
import {
  LOCAL,
  SETTLE_MS,
  launchChromium,
  runPool,
  startServer,
} from "./lib/demo-runner.mjs";
import {
  baselineGrowth,
  baselineSize,
  compareToBaseline,
  mergeResults,
  shrinkBaseline,
  sortBaseline,
} from "./lib/gate-baseline.mjs";
import {
  BARE_HTML,
  CHECKS,
  areaOfUrl,
  authorableTags,
  importFindings,
  isEmptyMarkup,
  isServiceRequest,
  normalizeError,
  pageBare,
  pageRendered,
  pasteHtml,
} from "./lib/without-hax.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_REL = "scripts/without-hax.baseline.json";
const BASELINE = path.join(root, BASELINE_REL);
const CONCURRENCY = Number(process.env.WITHOUT_HAX_CONCURRENCY) || 4;
const PAGE_TIMEOUT = Number(process.env.WITHOUT_HAX_PAGE_TIMEOUT) || 45000;
const DEFINE_WAIT = 10000;
const LIST_LIMIT = 8;
const STATIC_GROUPS = ["editor-import", "haxcms-import"];
// changes to the check itself re-check every tag
const TOOLING = [
  /^scripts\/without-hax/,
  /^scripts\/lib\/without-hax\.mjs$/,
  /^scripts\/lib\/demo-runner\.mjs$/,
  /^scripts\/lib\/gate-baseline\.mjs$/,
  /^web-dev-server\.config\.mjs$/,
  /^hax-elements-registry\.json$/,
  /^wc-registry\.json$/,
  /^\.github\/workflows\/without-hax\.yml$/,
];

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith("--")
    ? argv[i + 1]
    : null;
};

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

function findBase() {
  return ["origin/HEAD", "origin/master", "origin/main"].find(
    (ref) => git(["rev-parse", "--verify", "--quiet", ref]) !== null,
  );
}

function parseBaseline(text) {
  try {
    return JSON.parse(text).elements || {};
  } catch {
    return {};
  }
}

function readBaseline() {
  try {
    return parseBaseline(fs.readFileSync(BASELINE, "utf8"));
  } catch {
    return {};
  }
}

function writeBaseline(elements) {
  const data = {
    about:
      'Known "works with or without HAX" failures: tag -> check -> finding -> count. Shrink-only: generated by yarn test:without-hax --update-baseline, which only removes entries. See CONTRIBUTING.md ("Works with or without HAX" check) and https://github.com/haxtheweb/issues/issues/3324.',
    elements: sortBaseline(elements),
  };
  fs.writeFileSync(BASELINE, JSON.stringify(data, null, 2) + "\n");
}

function selectTags(all) {
  const wanted = option("--tags");
  if (wanted) {
    const want = new Set(wanted.split(",").map((t) => t.trim()));
    return {
      picked: all.filter((t) => want.has(t.tag)),
      why: `--tags (${want.size})`,
    };
  }
  if (flag("--all")) {
    return { picked: all, why: "all authorable tags" };
  }
  const base = option("--base") || findBase();
  const files = changedFiles(root, base);
  if (files.some((f) => TOOLING.some((re) => re.test(f)))) {
    return {
      picked: all,
      why: "the check itself changed: all authorable tags",
    };
  }
  const folders = changedFolders(files);
  return {
    picked: all.filter((t) => folders.has(t.folder)),
    why: `element folders changed vs ${base || "local changes"}: ${[...folders].sort().join(", ") || "none"}`,
  };
}

function checkBaselineShrinkOnly(ref) {
  const before = git(["show", `${ref}:${BASELINE_REL}`]);
  if (before === null) {
    console.log(
      `without-hax: no ${BASELINE_REL} at ${ref}; nothing to compare (first baseline).`,
    );
    return 0;
  }
  const grown = baselineGrowth(parseBaseline(before), readBaseline());
  if (!grown.length) {
    console.log(
      `without-hax: ${BASELINE_REL} did not grow compared with ${ref}.`,
    );
    return 0;
  }
  console.log(
    `\n${BASELINE_REL} grew compared with ${ref} (${grown.length} entr${grown.length === 1 ? "y" : "ies"}). The baseline only shrinks: fix the element instead.`,
  );
  grown
    .slice(0, 40)
    .forEach((g) =>
      console.log(
        `  ${g.element}  ${g.group}  ${g.key}  (${g.baseline} -> ${g.count})`,
      ),
    );
  return 1;
}

function add(map, group, key) {
  map[group] = map[group] || {};
  map[group][key] = (map[group][key] || 0) + 1;
}

/** static level for one tag: findings plus lazy paths (advisory) */
function staticLevel(t) {
  const { hard, lazy } = importFindings(root, t.file);
  const findings = {};
  for (const [area, chain] of Object.entries(hard)) {
    add(findings, `${area}-import`, chain.join(" > "));
  }
  return { findings, hard, lazy };
}

/** open a generated page on the local origin; outside requests aborted */
async function openGenerated(browser, origin, name, html, watch) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const url = `${origin}/__without-hax/${name}.html`;
  await context.route(
    (u) => !LOCAL.test(u.href),
    (route) => {
      const u = route.request().url();
      if (isServiceRequest(u) && !watch.services.includes(u)) {
        watch.services.push(u);
      }
      return route.abort();
    },
  );
  // registered last, so it wins for the generated page
  await context.route(url, (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: html }),
  );
  const page = await context.newPage();
  page.setDefaultTimeout(PAGE_TIMEOUT);
  page.on("pageerror", (e) =>
    watch.errors.push(normalizeError((e && e.message) || e, origin)),
  );
  page.on("request", (req) => {
    const area = areaOfUrl(req.url());
    if (area && !watch.areas[area]) {
      watch.areas[area] = req.url().split(origin).join("");
    }
  });
  await page.goto(url, { waitUntil: "load", timeout: PAGE_TIMEOUT });
  return { context, page };
}

async function settle(page) {
  await page
    .waitForLoadState("networkidle", { timeout: 10000 })
    .catch(() => {});
  await page.waitForTimeout(SETTLE_MS);
}

/** bare level: no editor, no HAXcms, only the element's module */
async function bareLevel(browser, origin, t, staticHard) {
  const watch = { errors: [], areas: {}, services: [] };
  const findings = {};
  let context;
  try {
    const opened = await openGenerated(
      browser,
      origin,
      "bare",
      BARE_HTML,
      watch,
    );
    context = opened.context;
    const { page } = opened;
    const moduleUrl = `/elements/${path
      .relative(path.join(root, "elements"), t.file)
      .split(path.sep)
      .join("/")}`;
    const r = await page.evaluate(pageBare, {
      tag: t.tag,
      moduleUrl,
      waitMs: DEFINE_WAIT,
    });
    await settle(page);
    if (r.importError) {
      add(
        findings,
        "throws",
        `import: ${normalizeError(r.importError, origin)}`,
      );
    } else if (!r.defined) {
      add(findings, "undefined", t.tag);
    } else {
      const seen = await page.evaluate(pageRendered, t.tag);
      // a bare tag with nothing set has nothing to show
      if (!seen.rendered && !isEmptyMarkup(r.html)) {
        add(findings, "blank", "demoSchema");
      }
    }
    for (const e of new Set(watch.errors)) {
      add(findings, "throws", e);
    }
    for (const [area, url] of Object.entries(watch.areas)) {
      // already reported by the static walk: don't count it twice
      if (!staticHard[area]) {
        add(findings, `loads-${area}`, url.split("?")[0]);
      }
    }
    return {
      findings,
      html: r.defined ? r.html : "",
      noDemoSchema: !!r.noDemoSchema,
      emptyMarkup: !!r.defined && isEmptyMarkup(r.html),
      services: watch.services,
    };
  } catch (e) {
    return { error: String((e && e.message) || e).split("\n")[0] };
  } finally {
    if (context) {
      await context.close().catch(() => {});
    }
  }
}

/** paste level: the inserted HTML on a page with only wc-autoload */
async function pasteLevel(browser, origin, t, html, bareFindings) {
  const watch = { errors: [], areas: {}, services: [] };
  const findings = {};
  let context;
  try {
    const opened = await openGenerated(
      browser,
      origin,
      "paste",
      pasteHtml(html),
      watch,
    );
    context = opened.context;
    const { page } = opened;
    await page
      .waitForFunction((tag) => !!customElements.get(tag), t.tag, {
        timeout: DEFINE_WAIT * 1.5,
      })
      .catch(() => {});
    await settle(page);
    const seen = await page.evaluate(pageRendered, t.tag);
    if (!seen.defined) {
      add(findings, "paste-undefined", t.tag);
    } else if (!seen.rendered && !bareFindings.blank && !isEmptyMarkup(html)) {
      add(findings, "paste-blank", "demoSchema");
    }
    const bareErrors = new Set(Object.keys(bareFindings.throws || {}));
    for (const e of new Set(watch.errors)) {
      if (!bareErrors.has(e)) {
        add(findings, "paste-throws", e);
      }
    }
    return { findings, services: watch.services };
  } catch (e) {
    return { error: String((e && e.message) || e).split("\n")[0] };
  } finally {
    if (context) {
      await context.close().catch(() => {});
    }
  }
}

// runtime checks that an offline run can't judge when the element needs an
// outside service (CI aborts every outside request); static and loads-*
// findings are about HAX and always count
const NETWORK_GROUPS = [
  "throws",
  "blank",
  "undefined",
  "paste-throws",
  "paste-blank",
  "paste-undefined",
];

async function runRuntime(picked, staticByTag) {
  const browser = await launchChromium(process.env.WITHOUT_HAX_CHROMIUM);
  let server;
  let origin;
  try {
    ({ server, origin } = await startServer(
      root,
      Number(process.env.WITHOUT_HAX_PORT) || 8767,
    ));
  } catch (e) {
    await browser.close().catch(() => {});
    throw e;
  }
  console.log(
    `without-hax: ${picked.length} tag(s), bare and pasted, in Chromium (${origin})`,
  );
  const results = {};
  const errors = {};
  const noDemo = [];
  const emptyMarkup = [];
  const needsNetwork = {};
  try {
    await runPool(
      picked,
      CONCURRENCY,
      async (t) => {
        const hard = staticByTag[t.tag].hard;
        const bare = await bareLevel(browser, origin, t, hard);
        if (bare.error) {
          errors[t.tag] = bare.error;
          return;
        }
        if (bare.noDemoSchema) {
          noDemo.push(t.tag);
        }
        if (bare.emptyMarkup) {
          emptyMarkup.push(t.tag);
        }
        let paste = { findings: {} };
        if (bare.html) {
          paste = await pasteLevel(
            browser,
            origin,
            t,
            bare.html,
            bare.findings,
          );
          if (paste.error) {
            errors[t.tag] = `paste: ${paste.error}`;
            paste = { findings: {} };
          }
        }
        const found = { ...bare.findings, ...paste.findings };
        const services = [
          ...new Set([...bare.services, ...(paste.services || [])]),
        ];
        if (services.length) {
          const held = NETWORK_GROUPS.filter((g) => found[g]);
          if (held.length) {
            needsNetwork[t.tag] = {
              service: services[0].split("?")[0],
              findings: held.flatMap((g) =>
                Object.keys(found[g]).map((k) => `${g}: ${k}`),
              ),
            };
            held.forEach((g) => delete found[g]);
          }
        }
        results[t.tag] = found;
      },
      "without-hax",
    );
  } finally {
    await browser.close().catch(() => {});
    await server.stop().catch(() => {});
  }
  return {
    results,
    errors,
    noDemo: noDemo.sort(),
    emptyMarkup: emptyMarkup.sort(),
    needsNetwork,
  };
}

function line(out, text) {
  console.log(text);
  out.push(text);
}

function listItems(out, items) {
  const by = {};
  for (const i of items) {
    (by[`${i.element}  ${i.group}`] =
      by[`${i.element}  ${i.group}`] || []).push(i);
  }
  for (const head of Object.keys(by)) {
    line(out, `  ${head}`);
    by[head]
      .slice(0, LIST_LIMIT)
      .forEach((i) =>
        line(
          out,
          `      ${i.key}${i.count > 1 || i.baseline ? `  (${i.count}${i.baseline ? `, baseline ${i.baseline}` : ""})` : ""}`,
        ),
      );
    if (by[head].length > LIST_LIMIT) {
      line(out, `      ...and ${by[head].length - LIST_LIMIT} more`);
    }
  }
}

/** every finding per tag as a markdown report (for the issue) */
function writeReport(file, all, picked, results, lazyByTag, errors, extras) {
  const { noDemo, emptyMarkup, needsNetwork } = extras;
  const rows = [];
  const tags = picked.map((t) => t.tag);
  const clean = tags.filter(
    (t) => results[t] && !Object.keys(results[t]).length && !errors[t],
  );
  rows.push(`# Works with or without HAX: report`);
  rows.push("");
  rows.push(
    `${tags.length} authorable tag(s) checked, ${clean.length} with no findings. Exempt (built for a HAX site): ${all
      .filter((t) => t.site)
      .map((t) => `\`${t.tag}\``)
      .join(", ")}.`,
  );
  rows.push("");
  rows.push("| Tag | Check | Finding |");
  rows.push("| --- | --- | --- |");
  for (const tag of tags) {
    const r = results[tag] || {};
    for (const group of Object.keys(r).sort()) {
      for (const key of Object.keys(r[group]).sort()) {
        // backslashes first, then the cell separator
        const cell = key.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
        rows.push(`| \`${tag}\` | ${group} | ${cell} |`);
      }
    }
  }
  const lazy = Object.entries(lazyByTag).filter(
    ([, l]) => Object.keys(l).length,
  );
  if (lazy.length) {
    rows.push("");
    rows.push("## Lazy (import()) paths, allowed, listed for review");
    for (const [tag, l] of lazy) {
      for (const [area, chain] of Object.entries(l)) {
        rows.push(`- \`${tag}\` ${area}: ${chain.join(" > ")}`);
      }
    }
  }
  const network = Object.keys(needsNetwork);
  if (network.length) {
    rows.push("");
    rows.push(
      "## Needs an outside service, not judged offline (CI aborts every outside request)",
    );
    for (const tag of network) {
      const n = needsNetwork[tag];
      rows.push(`- \`${tag}\` (${n.service}): ${n.findings.join("; ")}`);
    }
  }
  if (emptyMarkup.length) {
    rows.push("");
    rows.push(
      `## demoSchema is a bare tag with nothing set (nothing to render, so not judged blank)\n${emptyMarkup.map((t) => `\`${t}\``).join(", ")}`,
    );
  }
  if (noDemo.length) {
    rows.push("");
    rows.push(
      `## No demoSchema for its own tag (checked as a bare tag)\n${noDemo.map((t) => `\`${t}\``).join(", ")}`,
    );
  }
  const errNames = Object.keys(errors);
  if (errNames.length) {
    rows.push("");
    rows.push("## Did not load, not checked");
    errNames.forEach((t) => rows.push(`- \`${t}\`: ${errors[t]}`));
  }
  fs.writeFileSync(file, rows.join("\n") + "\n");
  console.log(`without-hax: report written to ${file}`);
}

async function main() {
  const shrinkRef = option("--check-baseline");
  if (shrinkRef) {
    return checkBaselineShrinkOnly(shrinkRef);
  }
  const all = authorableTags(root);
  const exempt = all.filter((t) => t.site);
  const { picked: chosen, why } = selectTags(all);
  const picked = chosen.filter((t) => !t.site);
  console.log(`without-hax: ${why}`);
  if (exempt.length) {
    console.log(
      `without-hax: exempt, built for a HAX site: ${exempt.map((t) => t.tag).join(", ")}`,
    );
  }
  if (!picked.length) {
    console.log("without-hax: no authorable tags to check.");
    return 0;
  }
  const staticByTag = {};
  const lazyByTag = {};
  for (const t of picked) {
    staticByTag[t.tag] = staticLevel(t);
    lazyByTag[t.tag] = staticByTag[t.tag].lazy;
  }
  let results = {};
  let errors = {};
  const noExtras = { noDemo: [], emptyMarkup: [], needsNetwork: {} };
  let extras = noExtras;
  const runtime = !flag("--static");
  const collect = async (tags) => {
    const out = {};
    for (const t of tags) {
      out[t.tag] = { ...staticByTag[t.tag].findings };
    }
    if (!runtime) {
      return { results: out, errors: {}, extras: noExtras };
    }
    const r = await runRuntime(tags, staticByTag);
    for (const tag of Object.keys(out)) {
      if (r.results[tag]) {
        Object.assign(out[tag], r.results[tag]);
      } else if (r.errors[tag]) {
        // not loaded: keep its static findings only, never drop the tag
        // from a baseline over a load failure
        delete out[tag];
      }
    }
    return {
      results: out,
      errors: r.errors,
      extras: {
        noDemo: r.noDemo,
        emptyMarkup: r.emptyMarkup,
        needsNetwork: r.needsNetwork,
      },
    };
  };
  ({ results, errors, extras } = await collect(picked));
  if (!runtime) {
    // a static-only run compares only the static groups
    for (const tag of Object.keys(results)) {
      for (const g of Object.keys(results[tag])) {
        if (!STATIC_GROUPS.includes(g)) {
          delete results[tag][g];
        }
      }
    }
  }
  const baseline = readBaseline();
  const compareBase = runtime
    ? baseline
    : Object.fromEntries(
        Object.entries(baseline).map(([tag, groups]) => [
          tag,
          Object.fromEntries(
            Object.entries(groups).filter(([g]) => STATIC_GROUPS.includes(g)),
          ),
        ]),
      );
  const out = [];

  if (flag("--update-baseline")) {
    if (!runtime) {
      console.log(
        "without-hax: --update-baseline needs the runtime levels; drop --static.",
      );
      return 1;
    }
    console.log(
      "without-hax: second run, so timing-dependent findings are kept",
    );
    const second = await collect(picked.filter((t) => results[t.tag]));
    results = mergeResults(results, second.results, Math.max);
    const allow = flag("--allow-additions");
    const next = shrinkBaseline(baseline, results, { allowAdditions: allow });
    writeBaseline(next);
    console.log(
      `without-hax: baseline ${baselineSize(baseline)} -> ${baselineSize(next)} for ${Object.keys(results).length} checked tag(s)${allow ? `, ${baselineGrowth(baseline, next).length} added (--allow-additions)` : " (only removes; --allow-additions only adds)"}.`,
    );
    if (option("--report")) {
      writeReport(
        option("--report"),
        all,
        picked,
        results,
        lazyByTag,
        errors,
        extras,
      );
    }
    return 0;
  }

  let { fresh, known, fixed } = compareToBaseline(results, compareBase);
  if (fresh.length && runtime) {
    // a finding only counts when a second run shows it too
    const again = [...new Set(fresh.map((f) => f.element))];
    console.log(
      `without-hax: re-checking ${again.length} tag(s) with new findings: ${again.join(", ")}`,
    );
    const second = await collect(picked.filter((t) => again.includes(t.tag)));
    const merged = mergeResults(results, second.results, Math.min);
    for (const tag of again) {
      if (merged[tag]) {
        results[tag] = merged[tag];
      }
    }
    ({ fresh, known, fixed } = compareToBaseline(results, compareBase));
  }
  if (option("--report")) {
    writeReport(
      option("--report"),
      all,
      picked,
      results,
      lazyByTag,
      errors,
      extras,
    );
  }
  if (known.length) {
    line(
      out,
      `\nAdvisory: ${known.reduce((n, k) => n + k.count, 0)} baselined "works without HAX" failure(s) in the checked tags (work these down):`,
    );
    listItems(out, known);
  }
  const lazy = Object.entries(lazyByTag).filter(
    ([, l]) => Object.keys(l).length,
  );
  if (lazy.length) {
    line(
      out,
      `\nAdvisory: lazy import() paths to editor/HAXcms code (allowed):`,
    );
    for (const [tag, l] of lazy) {
      for (const [area, chain] of Object.entries(l)) {
        line(out, `  ${tag}  ${area}: ${chain.join(" > ")}`);
      }
    }
  }
  const network = Object.keys(extras.needsNetwork);
  if (network.length) {
    line(
      out,
      `\nAdvisory: ${network.length} tag(s) need an outside service, so their runtime checks were not judged offline:`,
    );
    for (const tag of network) {
      line(out, `  ${tag}  ${extras.needsNetwork[tag].service}`);
    }
  }
  const errNames = Object.keys(errors);
  if (errNames.length) {
    line(
      out,
      `\nAdvisory: ${errNames.length} tag(s) did not load and were not checked at runtime:`,
    );
    errNames.forEach((e) => line(out, `  ${e}: ${errors[e]}`));
  }
  if (fixed.length) {
    const names = [...new Set(fixed.map((f) => f.element))].join(",");
    line(
      out,
      `\nFixed since the baseline (run yarn test:without-hax --update-baseline --tags ${names} and commit the smaller baseline):`,
    );
    listItems(out, fixed);
  }
  if (fresh.length) {
    line(out, `\nNEW "works without HAX" failures:`);
    listItems(out, fresh);
    [...new Set(fresh.map((f) => f.group))].forEach((g) =>
      line(out, `  ${g}: ${CHECKS[g] || g}`),
    );
  }
  line(
    out,
    `\nwithout-hax: ${Object.keys(results).length} tag(s) checked${runtime ? "" : " (static only)"}, ${fresh.length} new, ${known.length} baselined, ${fixed.length} fixed.`,
  );
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `## Works with or without HAX\n\n\`\`\`\n${out.join("\n").trim()}\n\`\`\`\n`,
      );
    } catch {
      // summary is best effort
    }
  }
  return fresh.length ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
