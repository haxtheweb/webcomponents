/**
 * Reproducible measurement for haxtheweb/issues#3263 (HAXcms view -> edit
 * toggle dropping frames). Builds HAX-like pages of about 50, 300 and 1000
 * elements, including grid-plates nested inside grid-plates, then does what
 * entering edit mode does to hax-body: importContent + editMode = true.
 *
 * It logs, per size:
 *  - sanitize: sanitizeHTMLForImport on the page HTML
 *  - contentReady: importContent call -> hax-body-content-ready
 *  - editable: importContent call -> every element carries data-hax-ray
 *  - longestFrame / framesOver50ms: gaps between animation frames while
 *    that happens (what the person sees as dropped frames)
 *
 * The assertions only check the import worked; timings are printed for the
 * PR / issue rather than asserted, since CI machines vary. Run with:
 *   npx web-test-runner "elements/hax-body/test/hax-body-edit-entry-perf.test.js"
 *     --node-resolve --root-dir . --config=web-test-runner.config.mjs
 *     --playwright --browsers chromium --static-logging
 */
import { fixture, expect, html } from "@open-wc/testing";
import "../hax-body.js";
import "@haxtheweb/grid-plate/grid-plate.js";
import { sanitizeHTMLForImport } from "@haxtheweb/utils/lib/sanitize.js";
import { HAXStore } from "../lib/hax-store.js";

function block(i, depth) {
  const para =
    "<p>Paragraph " +
    i +
    ' with <a href="https://example.com/' +
    i +
    '">a link</a> and <strong>bold</strong> text.</p>';
  if (depth === 0) {
    return para;
  }
  return (
    '<grid-plate layout="1-1">' +
    '<p slot="col-1">Column one ' +
    i +
    "</p>" +
    '<div slot="col-2">' +
    block(i, depth - 1) +
    "</div>" +
    "</grid-plate>"
  );
}

/**
 * page with roughly `target` elements: headings, paragraphs and grid-plates
 * nested two deep
 */
function page(target) {
  let out = "";
  let i = 0;
  const count = () => {
    const t = document.createElement("template");
    t.innerHTML = out;
    return t.content.querySelectorAll("*").length;
  };
  while (count() < target) {
    out +=
      "<h2>Section " +
      i +
      "</h2>" +
      block(i, 2) +
      block(i, 0) +
      '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="pixel ' +
      i +
      '">';
    i++;
  }
  return out;
}

function frameMonitor() {
  let last = performance.now();
  let longest = 0;
  let over50 = 0;
  let running = true;
  const tick = () => {
    const now = performance.now();
    const gap = now - last;
    last = now;
    longest = Math.max(longest, gap);
    if (gap > 50) {
      over50++;
    }
    if (running) {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
  return () => {
    running = false;
    return { longest, over50 };
  };
}

async function untilEditable(body, timeout = 20000) {
  const start = performance.now();
  for (;;) {
    const all = body.querySelectorAll("p, h2, img, grid-plate");
    let missing = 0;
    for (let i = 0; i < all.length; i++) {
      if (!all[i].hasAttribute("data-hax-ray")) {
        missing++;
      }
    }
    if (all.length > 0 && missing === 0) {
      return;
    }
    if (performance.now() - start > timeout) {
      throw new Error(missing + " elements never became editable");
    }
    await new Promise((r) => requestAnimationFrame(r));
  }
}

function countElements(content) {
  const t = document.createElement("template");
  t.innerHTML = content;
  return t.content.querySelectorAll("*").length;
}

/**
 * one edit-mode entry into a fresh hax-body, as the site editor does it
 */
async function measure(content) {
  // sanitizer on its own, best of 3
  let sanitize = Infinity;
  for (let i = 0; i < 3; i++) {
    const s = performance.now();
    sanitizeHTMLForImport(content);
    sanitize = Math.min(sanitize, performance.now() - s);
  }
  const body = await fixture(html`<hax-body></hax-body>`);
  await body.updateComplete;
  const stop = frameMonitor();
  const t0 = performance.now();
  let contentReady = 0;
  const ready = new Promise((resolve) => {
    body.addEventListener(
      "hax-body-content-ready",
      () => {
        contentReady = performance.now() - t0;
        resolve();
      },
      { once: true },
    );
  });
  body.importContent(content);
  body.editMode = true;
  await ready;
  await untilEditable(body);
  const editable = performance.now() - t0;
  const frames = stop();
  expect(body.querySelectorAll("grid-plate").length).to.be.above(0);
  expect(body.querySelector("p").getAttribute("contenteditable")).to.equal(
    "true",
  );
  body.editMode = false;
  await body.updateComplete;
  // let the exit settle before the next run
  await new Promise((r) => setTimeout(r, 50));
  return {
    sanitize,
    contentReady,
    editable,
    longestFrame: frames.longest,
    framesOver50ms: frames.over50,
  };
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

describe("hax-body edit-mode entry timing (issues#3263)", () => {
  before(async function () {
    this.timeout(60000);
    // the app store registers grid-plate as a layout in the real editor
    if (!HAXStore.validGridTagList.includes("grid-plate")) {
      HAXStore.validGridTagList.push("grid-plate");
    }
    // warm up module loading and first grid-plate render, not measured
    await measure(page(50));
  });
  [50, 300, 1000].forEach((size) => {
    it(`enters edit mode on a ~${size} element page`, async function () {
      this.timeout(120000);
      const content = page(size);
      const runs = [];
      for (let i = 0; i < 5; i++) {
        runs.push(await measure(content));
      }
      const pick = (key) => median(runs.map((r) => r[key]));
      const result = {
        elements: countElements(content),
        runs: runs.length,
        sanitize: Number(pick("sanitize").toFixed(1)),
        contentReady: Math.round(pick("contentReady")),
        editable: Math.round(pick("editable")),
        longestFrame: Math.round(pick("longestFrame")),
        framesOver50ms: pick("framesOver50ms"),
      };
      console.log("[edit-entry-perf] " + JSON.stringify(result));
    });
  });
});
