#!/usr/bin/env node
/**
 * Regenerate the outline-designer -> saveOutline contract fixture in both
 * HAXcms backends, so their contract tests always check what the designer in
 * this monorepo actually sends.
 *
 * The backends each hold the same fixture and a test that replays it through
 * their real saveOutline:
 *   haxcms-nodejs  test/unit/fixtures/outline-designer-sessions.json
 *                  test/unit/save-outline-designer-contract.test.cjs
 *   haxcms-php     system/backend/php/tests/Unit/fixtures/outline-designer-sessions.json
 *                  system/backend/php/tests/Unit/OperationsSaveOutlineDesignerContractTest.php
 *
 * This script runs elements/outline-designer from source in headless
 * Chromium, drives a set of real editing sessions through its own keyboard
 * handlers, menu actions and a real mouse drag, and records for each one:
 *   - sent:  the items getData() hands to saveOutline
 *   - shown: the outline the designer showed, as "title<parent title" in the
 *            order the rows appeared (deleted pages left out)
 * The backend tests require that what was shown is what saveOutline stores.
 *
 * This is a maintainer-side step called from scripts/ubiquity-push.sh (and
 * ubiquity-testing.sh). A fixture is only rewritten when the sessions change,
 * so a publish with no designer change leaves both backends untouched.
 * Nothing is committed or pushed here; the caller owns version control.
 *
 * Usage:
 *   node scripts/outline-designer-contract-fixture.mjs [--nodejs <dir>] [--php <dir>]
 *                                                      [--dry-run] [--check]
 *                                                      [--chromium <path>]
 *
 *   --nodejs    haxcms-nodejs checkout (default: $HAXTHEWEB_ROOT/haxcms-nodejs)
 *   --php       haxcms-php checkout    (default: $HAXTHEWEB_ROOT/haxcms-php)
 *               A checkout that does not exist is skipped with a warning.
 *   --dry-run   capture and report what would change, write nothing
 *   --check     like --dry-run, but exit 1 when a backend's fixture is stale
 *   --chromium  Chromium/Chrome executable, when Playwright's own browser is
 *               not installed (`npx playwright install chromium`)
 *
 * $HAXTHEWEB_ROOT defaults to ~/haxtheweb, matching ubiquity-push.sh.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const elementsDir = path.join(repoRoot, "elements");

const FIXTURE_PATHS = {
  nodejs: path.join(
    "test",
    "unit",
    "fixtures",
    "outline-designer-sessions.json",
  ),
  php: path.join(
    "system",
    "backend",
    "php",
    "tests",
    "Unit",
    "fixtures",
    "outline-designer-sessions.json",
  ),
};

function parseArgs(argv) {
  const root =
    process.env.HAXTHEWEB_ROOT || path.join(os.homedir(), "haxtheweb");
  const args = {
    nodejs: path.join(root, "haxcms-nodejs"),
    php: path.join(root, "haxcms-php"),
    dryRun: false,
    check: false,
    chromium: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--check") args.check = true;
    else if (a === "--nodejs") args.nodejs = argv[++i];
    else if (a === "--php") args.php = argv[++i];
    else if (a === "--chromium") args.chromium = argv[++i];
    else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  return args;
}

// the outline the designer is opened on: a small course, three levels deep
const INITIAL = [
  ["item-welcome", "Welcome", null, 0],
  ["item-start", "Getting started", null, 1],
  ["item-install", "Install", "item-start", 0],
  ["item-configure", "Configure", "item-start", 1],
  ["item-advanced", "Advanced configuration", "item-configure", 0],
  ["item-lessons", "Lessons", null, 2],
  ["item-lesson-1", "Lesson 1", "item-lessons", 0],
  ["item-lesson-2", "Lesson 2", "item-lessons", 1],
  ["item-lesson-3", "Lesson 3", "item-lessons", 2],
  ["item-glossary", "Glossary", null, 3],
];

function initialItems() {
  const byId = {};
  return INITIAL.map(([id, title, parent, order]) => {
    const item = {
      id: id,
      title: title,
      slug: id.replace("item-", ""),
      location: "pages/" + id + "/index.html",
      order: order,
      parent: parent,
      indent: parent ? byId[parent].indent + 1 : 0,
      metadata: { locked: false },
    };
    byId[id] = item;
    return item;
  });
}

// bundle outline-designer from source: @haxtheweb/* resolves to elements/*,
// everything else to this monorepo's node_modules
async function bundleDesigner(outfile) {
  const esbuild = require("esbuild");
  const haxAlias = {
    name: "hax-alias",
    setup(build) {
      build.onResolve({ filter: /^@haxtheweb\// }, (args) => {
        const m = args.path.match(/^@haxtheweb\/([^/]+)(\/.*)?$/);
        const base = path.join(elementsDir, m[1]);
        const target = m[2]
          ? path.join(base, m[2])
          : path.join(base, m[1] + ".js");
        const candidates = [
          target,
          target + ".js",
          path.join(target, "index.js"),
        ];
        for (const c of candidates) {
          if (fs.existsSync(c) && fs.statSync(c).isFile()) {
            return { path: c };
          }
        }
        return { errors: [{ text: "cannot resolve " + args.path }] };
      });
    },
  };
  await esbuild.build({
    entryPoints: [
      path.join(elementsDir, "outline-designer", "outline-designer.js"),
    ],
    bundle: true,
    format: "esm",
    outfile: outfile,
    plugins: [haxAlias],
    logLevel: "error",
    loader: { ".json": "json" },
  });
}

function serve(bundleFile) {
  const server = http.createServer((req, res) => {
    if (req.url.indexOf("/designer.js") === 0) {
      res.setHeader("content-type", "text/javascript");
      res.end(fs.readFileSync(bundleFile));
    } else if (req.url === "/" || req.url.indexOf("/?") === 0) {
      res.setHeader("content-type", "text/html");
      res.end(
        '<!doctype html><body style="margin:0"><script type="module" src="/designer.js"></script></body>',
      );
    } else {
      res.statusCode = 404;
      res.end("");
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

// browser-side helpers, installed once per page
function installHelpers(initial) {
  globalThis.settle = async (el, ms) => {
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, ms || 150));
    await el.updateComplete;
  };
  globalThis.fresh = async () => {
    document.querySelectorAll("outline-designer").forEach((e) => e.remove());
    const el = document.createElement("outline-designer");
    el.setAttribute("reduced-motion", "reduce");
    el.setAttribute("edit-mode", "");
    document.body.appendChild(el);
    el.items = JSON.parse(JSON.stringify(initial));
    await globalThis.settle(el);
    globalThis.el = el;
    return true;
  };
  globalThis.li = (id) =>
    globalThis.el.shadowRoot.querySelector(`li[data-item-id="${id}"]`);
  globalThis.key = (target, k, opts) =>
    target.dispatchEvent(
      new KeyboardEvent(
        "keydown",
        Object.assign({ key: k, bubbles: true, cancelable: true }, opts || {}),
      ),
    );
  globalThis.idx = (id) => globalThis.el.items.findIndex((i) => i.id === id);
  globalThis.capture = async () => {
    const el = globalThis.el;
    await globalThis.settle(el);
    const data = await el.getData();
    const sent = JSON.parse(JSON.stringify(data.items));
    const byId = {};
    sent.forEach((i) => {
      byId[i.id] = i;
    });
    const rows = Array.from(
      el.shadowRoot.querySelectorAll("li[data-item-id]"),
    ).map((r) => r.getAttribute("data-item-id"));
    const shown = rows
      .filter((id) => byId[id] && !byId[id].delete)
      .map(
        (id) =>
          byId[id].title +
          "<" +
          (byId[id].parent && byId[byId[id].parent]
            ? byId[byId[id].parent].title
            : "root"),
      );
    return { sent: sent, shown: shown };
  };
}

// type a page name into the label the designer just opened for editing
async function nameNewPage(page, name) {
  await page.keyboard.press("Control+A");
  await page.keyboard.type(name);
  await page.keyboard.press("Enter");
}

async function dragLabel(page, fromId, toId) {
  const pts = await page.evaluate(
    ([from, to]) => {
      const r = (id) => {
        const box = globalThis
          .li(id)
          .querySelector(".label.shown")
          .getBoundingClientRect();
        return { x: box.x, y: box.y, w: box.width, h: box.height };
      };
      return { s: r(from), d: r(to) };
    },
    [fromId, toId],
  );
  const sx = pts.s.x + 40;
  const sy = pts.s.y + pts.s.h / 2;
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + 4, sy - 8, { steps: 4 });
  await page.mouse.move(pts.d.x + 40, pts.d.y + 3, { steps: 16 });
  await page.waitForTimeout(200);
  await page.mouse.up();
  await page.waitForTimeout(500);
}

// each session: a name, what a person does, and how to do it in the designer
const SESSIONS = [
  {
    name: "no-changes",
    description: "Open the outline and save without changing anything",
    run: async () => {},
  },
  {
    name: "keyboard-move-down",
    description:
      'Alt+Down on "Getting started": it moves below "Lessons" with its sub-pages',
    run: (page) =>
      page.evaluate(async () => {
        globalThis.key(globalThis.li("item-start"), "ArrowDown", {
          altKey: true,
        });
        await globalThis.settle(globalThis.el);
      }),
  },
  {
    name: "keyboard-indent-outdent",
    description:
      'Alt+Right on "Glossary" (nests under "Lessons"), Alt+Left on "Install" (moves out of "Getting started")',
    run: (page) =>
      page.evaluate(async () => {
        globalThis.key(globalThis.li("item-glossary"), "ArrowRight", {
          altKey: true,
        });
        await globalThis.settle(globalThis.el);
        globalThis.key(globalThis.li("item-install"), "ArrowLeft", {
          altKey: true,
        });
        await globalThis.settle(globalThis.el);
      }),
  },
  {
    name: "delete-parent-with-children",
    description: 'Delete "Getting started"; its sub-pages are deleted with it',
    run: (page) =>
      page.evaluate(async () => {
        await globalThis.el._toggleDelete(globalThis.idx("item-start"));
        await globalThis.settle(globalThis.el, 400);
      }),
  },
  {
    name: "delete-then-undo",
    description: 'Delete "Lessons", then undo: nothing changes',
    run: (page) =>
      page.evaluate(async () => {
        await globalThis.el._toggleDelete(globalThis.idx("item-lessons"));
        await globalThis.settle(globalThis.el, 300);
        globalThis.el.undo();
        await globalThis.settle(globalThis.el, 900);
      }),
  },
  {
    name: "add-page-mid-list",
    description: 'Add a page after "Lesson 1" and name it "Lesson 1b"',
    run: async (page) => {
      await page.evaluate(async () => {
        await globalThis.el._addAfterAndEdit(globalThis.idx("item-lesson-1"));
        await globalThis.settle(globalThis.el, 300);
      });
      await nameNewPage(page, "Lesson 1b");
      await page.evaluate(() => globalThis.settle(globalThis.el, 300));
    },
  },
  {
    name: "add-page-at-top",
    description: "Add a page at the top of the outline",
    run: (page) =>
      page.evaluate(async () => {
        await globalThis.el._addTop();
        await globalThis.settle(globalThis.el, 400);
      }),
  },
  {
    name: "duplicate-page",
    description: 'Duplicate "Lesson 2"',
    run: (page) =>
      page.evaluate(async () => {
        globalThis.el.itemOp(globalThis.idx("item-lesson-2"), "duplicate");
        await globalThis.settle(globalThis.el, 300);
      }),
  },
  {
    name: "lock-page",
    description: 'Lock "Glossary"',
    run: (page) =>
      page.evaluate(async () => {
        globalThis.el.itemOp(globalThis.idx("item-glossary"), "lock");
        await globalThis.settle(globalThis.el);
      }),
  },
  {
    name: "selection-delete",
    description:
      'Select "Install" and "Lesson 3" and delete them from the toolbar',
    run: (page) =>
      page.evaluate(async () => {
        globalThis.el.selectedPages = ["item-install", "item-lesson-3"];
        await globalThis.settle(globalThis.el);
        globalThis.el.deleteSelected();
        await globalThis.settle(globalThis.el, 400);
      }),
  },
  {
    name: "mouse-drag",
    description:
      'Drag "Glossary" with the mouse onto "Lessons": it lands as the last sub-page of "Lessons"',
    run: (page) => dragLabel(page, "item-glossary", "item-lessons"),
  },
  {
    name: "combined-edit",
    description:
      'Add "Lesson 4" after "Lesson 3", move "Welcome" down with Alt+Down, delete "Advanced configuration"',
    run: async (page) => {
      await page.evaluate(async () => {
        await globalThis.el._addAfterAndEdit(globalThis.idx("item-lesson-3"));
        await globalThis.settle(globalThis.el, 300);
      });
      await nameNewPage(page, "Lesson 4");
      await page.evaluate(async () => {
        await globalThis.settle(globalThis.el, 300);
        globalThis.key(globalThis.li("item-welcome"), "ArrowDown", {
          altKey: true,
        });
        await globalThis.settle(globalThis.el);
        await globalThis.el._toggleDelete(globalThis.idx("item-advanced"));
        await globalThis.settle(globalThis.el, 400);
      });
    },
  },
];

// pages added in a session get a random client id from the designer; give
// them stable ones (item-new-1, item-new-2, ...) in the order they were sent
// so an unchanged designer always produces the same fixture. The backends
// replace client ids for new pages with their own, so nothing depends on them.
function stableNewIds(sent, initial) {
  const known = new Set(initial.map((i) => i.id));
  const renamed = {};
  let count = 0;
  sent.forEach((item) => {
    if (!known.has(item.id) && !renamed[item.id]) {
      count++;
      renamed[item.id] = "item-new-" + count;
    }
  });
  const swap = (id) => (renamed[id] ? renamed[id] : id);
  return sent.map((item) => {
    const copy = Object.assign({}, item, { id: swap(item.id) });
    if (copy.parent) copy.parent = swap(copy.parent);
    if (copy.duplicate) copy.duplicate = swap(copy.duplicate);
    return copy;
  });
}

async function captureSessions(args, initial) {
  let chromium;
  try {
    chromium = require("playwright").chromium;
  } catch (e) {
    throw new Error(
      "playwright is not installed in this monorepo (yarn install), " +
        e.message,
    );
  }
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "outline-contract-"));
  const bundleFile = path.join(scratch, "designer.js");
  let browser = null;
  let server = null;
  try {
    await bundleDesigner(bundleFile);
    server = await serve(bundleFile);
    const launch = args.chromium ? { executablePath: args.chromium } : {};
    try {
      browser = await chromium.launch(launch);
    } catch (e) {
      throw new Error(
        "could not start Chromium; run `npx playwright install chromium` or pass --chromium <path>. " +
          e.message,
      );
    }
    const page = await browser.newPage({
      viewport: { width: 1100, height: 1000 },
    });
    await page.goto("http://127.0.0.1:" + server.address().port + "/");
    await page.waitForFunction(
      () => customElements.get("outline-designer"),
      null,
      {
        timeout: 20000,
      },
    );
    await page.evaluate(installHelpers, initial);
    const scenarios = [];
    for (const session of SESSIONS) {
      await page.evaluate(() => globalThis.fresh());
      await session.run(page);
      const out = await page.evaluate(() => globalThis.capture());
      scenarios.push({
        name: session.name,
        description: session.description,
        sent: stableNewIds(out.sent, initial),
        shown: out.shown,
      });
    }
    return scenarios;
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

// the last commit that touched the designer, so a fixture says what it came from
function designerRevision() {
  try {
    return execFileSync(
      "git",
      [
        "log",
        "-1",
        "--format=%H",
        "--",
        "elements/outline-designer/outline-designer.js",
      ],
      { cwd: repoRoot, encoding: "utf8" },
    ).trim();
  } catch (e) {
    return "";
  }
}

// compare what matters: the sessions, not where they were captured from
function sameSessions(a, b) {
  return (
    JSON.stringify({ initial: a.initial, scenarios: a.scenarios }) ===
    JSON.stringify({ initial: b.initial, scenarios: b.scenarios })
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const initial = initialItems();
  const scenarios = await captureSessions(args, initial);
  const revision = designerRevision();
  const fixture = {
    description:
      "outline-designer getData() output for real editing sessions, captured from haxtheweb/webcomponents",
    capturedFrom:
      "https://github.com/haxtheweb/webcomponents/blob/" +
      (revision || "master") +
      "/elements/outline-designer/outline-designer.js",
    initial: initial,
    scenarios: scenarios,
  };
  console.log(
    "outline-designer contract: captured " + scenarios.length + " sessions",
  );
  let stale = 0;
  for (const backend of ["nodejs", "php"]) {
    const checkout = args[backend];
    if (!checkout || !fs.existsSync(checkout)) {
      console.warn(
        "  " + backend + ": no checkout at " + checkout + ", skipped",
      );
      continue;
    }
    const file = path.join(checkout, FIXTURE_PATHS[backend]);
    let current = null;
    if (fs.existsSync(file)) {
      try {
        current = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch (e) {
        current = null;
      }
    }
    if (current && sameSessions(current, fixture)) {
      console.log("  " + backend + ": up to date");
      continue;
    }
    stale++;
    if (args.dryRun || args.check) {
      console.log("  " + backend + ": would update " + file);
      continue;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(fixture, null, 2) + "\n");
    console.log("  " + backend + ": updated " + file);
  }
  if (args.check && stale > 0) {
    console.error(
      "outline-designer contract fixture is stale in " +
        stale +
        " backend(s); run node scripts/outline-designer-contract-fixture.mjs",
    );
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("outline-designer contract fixture failed: " + e.message);
  process.exit(1);
});
