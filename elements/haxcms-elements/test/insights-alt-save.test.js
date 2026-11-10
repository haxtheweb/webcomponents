import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import {
  ALT_LIST_OPERATION,
  ALT_SAVE_NOTE,
  ALT_SAVE_OPERATION,
  altSaveAvailable,
  groupAltEdits,
  imageSrcAttributes,
  matchAltBlocks,
  saveAltEdits,
} from "../lib/core/insights/insights-alt-save.js";
import "../lib/core/insights/sections/insights-accessibility.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

// Save alt text (haxtheweb/issues#3270): GET .../blocks addresses a page's
// images, one PATCH per page sets their alt. A fake backend holds each
// page's images and answers both operations like haxcms-nodejs does.
let spec;

function row(pageId, src, alt, extra) {
  return Object.assign(
    {
      pageId: pageId,
      pageTitle: `Page ${pageId}`,
      slug: `page-${pageId}`,
      tag: "img",
      src: src,
      file: src.split("/").pop(),
      alt: alt,
      inLink: false,
      hasCaption: false,
      status: "fix",
      reason: "missing",
      reasonText: "No alt",
    },
    extra || {},
  );
}

function escapeAttr(v) {
  return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * A backend with pages of images. `pages` maps page id -> [{ tag, attrs }].
 * `hooks.patch(pageId, ops, n)` may return a response to answer instead.
 */
function fakeBackend(pages, hooks) {
  const h = hooks || {};
  const calls = [];
  let patches = 0;
  const srcAttrs = imageSrcAttributes(spec);
  const html1 = (el) =>
    `<${el.tag}${Object.keys(el.attrs)
      .map((k) => ` ${k}="${escapeAttr(el.attrs[k])}"`)
      .join("")}>`;
  const blocksOf = (pageId) => {
    const seen = {};
    return pages[pageId].map((el) => {
      seen[el.tag] = (seen[el.tag] || 0) + 1;
      return {
        tag: el.tag,
        index: seen[el.tag] - 1,
        before: html1(el),
        attributes: Object.assign({}, el.attrs),
      };
    });
  };
  const call = async (name, params) => {
    calls.push({ name: name, params: JSON.parse(JSON.stringify(params)) });
    const pageId = params.idOrSlug;
    if (!pages[pageId]) {
      return {
        status: 404,
        data: null,
        body: { status: 404, data: { message: "Content not found" } },
      };
    }
    if (name === ALT_LIST_OPERATION) {
      if (h.list) {
        const r = h.list(pageId);
        if (r) {
          return r;
        }
      }
      return { status: 200, data: { blocks: blocksOf(pageId) } };
    }
    patches++;
    if (h.patch) {
      const r = h.patch(pageId, params.ops, patches);
      if (r) {
        return r;
      }
    }
    // compare-and-swap every op first, then write them all
    const blocks = blocksOf(pageId);
    for (let i = 0; i < params.ops.length; i++) {
      const op = params.ops[i];
      const found = blocks.filter((b) => b.tag === op.tag)[op.index];
      if (!found || found.before !== op.before) {
        return {
          status: 409,
          data: null,
          body: {
            status: 409,
            data: {
              message: `Block ${i} no longer matches the stored page`,
              reason: "stale",
              op: i,
            },
          },
        };
      }
    }
    params.ops.forEach((op) => {
      const el = pages[pageId].filter((e) => e.tag === op.tag)[op.index];
      Object.assign(el.attrs, op.set);
    });
    return {
      status: 200,
      data: { results: params.ops.map((op, i) => ({ op: i })) },
    };
  };
  return { call, calls, srcAttrs };
}

before(async () => {
  spec = await loadSpec();
});

describe("insights-alt-save: matching", () => {
  it("groups edited rows by page and drops edits equal to storage", () => {
    const rows = [
      row("a", "/files/1.png", null),
      row("a", "/files/2.png", "Old"),
      row("b", "/files/3.png", ""),
      row("c", "/files/4.png", "Same"),
    ];
    const pages = groupAltEdits(rows, {
      0: "  One  ",
      1: "New",
      2: "Three",
      3: " Same ",
    });
    expect(pages.map((p) => p.pageId)).to.deep.equal(["a", "b"]);
    expect(pages[0].items.map((x) => [x.i, x.value])).to.deep.equal([
      [0, "One"],
      [1, "New"],
    ]);
    expect(pages[0].rows.length).to.equal(2);
  });

  it("pairs repeated identical images in order, and only when counts agree", () => {
    const rows = [
      row("a", "/files/x.png", null),
      row("a", "/files/x.png", null),
      row("a", "/files/y.png", "Y"),
    ];
    const blocks = [
      {
        tag: "img",
        index: 0,
        before: "<img a>",
        attributes: { src: "/files/x.png" },
      },
      { tag: "p", index: 0, before: "<p>", attributes: {} },
      {
        tag: "img",
        index: 1,
        before: "<img b>",
        attributes: { src: "/files/x.png" },
      },
      {
        tag: "img",
        index: 2,
        before: "<img c>",
        attributes: { src: "/files/y.png", alt: "Y" },
      },
    ];
    const srcAttrs = imageSrcAttributes(spec);
    const page = groupAltEdits(rows, { 1: "second", 2: "why" })[0];
    const m = matchAltBlocks(page, blocks, srcAttrs);
    expect(m.ops.map((op) => [op.index, op.before, op.set.alt])).to.deep.equal([
      [1, "<img b>", "second"],
      [2, "<img c>", "why"],
    ]);
    expect(m.opRows).to.deep.equal([1, 2]);
    // a third copy on the server: which one the person saw is unclear
    const extra = blocks.concat([
      {
        tag: "img",
        index: 3,
        before: "<img d>",
        attributes: { src: "/files/x.png" },
      },
    ]);
    const m2 = matchAltBlocks(page, extra, srcAttrs);
    expect(m2.unmatched).to.deep.equal([1]);
    expect(m2.opRows).to.deep.equal([2]);
  });

  it("reads media-image sources from the attribute the rules name", () => {
    const rows = [row("a", "/files/m.jpg", "old", { tag: "media-image" })];
    const blocks = [
      {
        tag: "media-image",
        index: 0,
        before: "<media-image>",
        attributes: { source: "/files/m.jpg", alt: "old" },
      },
    ];
    const page = groupAltEdits(rows, { 0: "new" })[0];
    const m = matchAltBlocks(page, blocks, imageSrcAttributes(spec));
    expect(m.ops[0]).to.deep.equal({
      op: "setAttributes",
      tag: "media-image",
      index: 0,
      before: "<media-image>",
      set: { alt: "new" },
    });
  });
});

describe("insights-alt-save: saving", () => {
  it("saves one PATCH per page with the note, and reports progress", async () => {
    const rows = [
      row("a", "/files/1.png", null),
      row("a", "/files/2.png", "Old"),
      row("b", "/files/3.png", null),
    ];
    const pages = {
      a: [
        { tag: "img", attrs: { src: "/files/1.png" } },
        { tag: "img", attrs: { src: "/files/2.png", alt: "Old" } },
      ],
      b: [{ tag: "img", attrs: { src: "/files/3.png" } }],
    };
    const be = fakeBackend(pages);
    const progress = [];
    const out = await saveAltEdits(
      rows,
      { 0: "One", 1: "Two", 2: "" },
      { spec, call: be.call, onProgress: (p) => progress.push(p) },
    );
    expect(out.saved).to.deep.equal({ 0: "One", 1: "Two", 2: "" });
    expect(out.failed).to.deep.equal({});
    expect(out.pagesSaved).to.equal(2);
    expect(out.pagesLeft).to.equal(0);
    expect(pages.a[0].attrs.alt).to.equal("One");
    expect(pages.b[0].attrs.alt).to.equal("");
    const patches = be.calls.filter((c) => c.name === ALT_SAVE_OPERATION);
    expect(patches.length).to.equal(2);
    expect(patches[0].params.note).to.equal(ALT_SAVE_NOTE);
    expect(patches[0].params.ops.length).to.equal(2);
    expect(progress.map((p) => [p.done, p.total])).to.deep.equal([
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
  });

  it("saves at most maxPages pages per call and counts the rest", async () => {
    const rows = [];
    const pages = {};
    const edits = {};
    for (let p = 0; p < 5; p++) {
      rows.push(row(`p${p}`, `/files/${p}.png`, null));
      pages[`p${p}`] = [{ tag: "img", attrs: { src: `/files/${p}.png` } }];
      edits[p] = `Image ${p}`;
    }
    const be = fakeBackend(pages);
    const out = await saveAltEdits(rows, edits, {
      spec,
      call: be.call,
      maxPages: 3,
    });
    expect(Object.keys(out.saved)).to.deep.equal(["0", "1", "2"]);
    expect(out.pagesLeft).to.equal(2);
    expect(pages.p3[0].attrs.alt).to.equal(undefined);
  });

  it("lists again once on 409 and never overwrites an image that changed", async () => {
    const rows = [
      row("a", "/files/1.png", null),
      row("a", "/files/2.png", null),
    ];
    const pages = {
      a: [
        { tag: "img", attrs: { src: "/files/1.png" } },
        { tag: "img", attrs: { src: "/files/2.png" } },
      ],
    };
    // the first save loses a race; the retry lists the page again
    const be = fakeBackend(pages, {
      patch: (pageId, ops, n) =>
        n === 1
          ? {
              status: 409,
              data: null,
              body: {
                status: 409,
                data: {
                  message: "Block 0 no longer matches the stored page",
                  op: 0,
                },
              },
            }
          : null,
    });
    // image 1 changed on the server after the scan
    pages.a[0].attrs.alt = "Someone else";
    const out = await saveAltEdits(
      rows,
      { 0: "Mine", 1: "Two" },
      {
        spec,
        call: be.call,
      },
    );
    expect(out.saved).to.deep.equal({ 1: "Two" });
    expect(out.failed[0].kind).to.equal("stale");
    expect(pages.a[0].attrs.alt).to.equal("Someone else");
    expect(pages.a[1].attrs.alt).to.equal("Two");
  });

  it("marks a refused value and saves the others on that page", async () => {
    const rows = [
      row("a", "/files/1.png", null),
      row("a", "/files/2.png", null),
    ];
    const pages = {
      a: [
        { tag: "img", attrs: { src: "/files/1.png" } },
        { tag: "img", attrs: { src: "/files/2.png" } },
      ],
    };
    const be = fakeBackend(pages, {
      patch: (pageId, ops) =>
        ops.length === 2
          ? {
              status: 400,
              data: null,
              body: {
                status: 400,
                data: {
                  message: "Block 0 refused (invalid): no comment markers",
                  reason: "invalid",
                  detail: "no comment markers",
                  op: 0,
                },
              },
            }
          : null,
    });
    const out = await saveAltEdits(
      rows,
      { 0: "a --> b", 1: "Fine" },
      {
        spec,
        call: be.call,
      },
    );
    expect(out.saved).to.deep.equal({ 1: "Fine" });
    expect(out.failed[0]).to.deep.equal({
      kind: "refused",
      message: "no comment markers",
    });
  });

  it("reports a locked page and carries on with the next", async () => {
    const rows = [
      row("a", "/files/1.png", null),
      row("b", "/files/2.png", null),
    ];
    const pages = {
      a: [{ tag: "img", attrs: { src: "/files/1.png" } }],
      b: [{ tag: "img", attrs: { src: "/files/2.png" } }],
    };
    const be = fakeBackend(pages, {
      patch: (pageId) =>
        pageId === "a"
          ? {
              status: 423,
              data: null,
              body: {
                status: 423,
                data: { message: 'Page "a" is locked', reason: "locked" },
              },
            }
          : null,
    });
    const out = await saveAltEdits(
      rows,
      { 0: "One", 1: "Two" },
      {
        spec,
        call: be.call,
      },
    );
    expect(out.failed[0].kind).to.equal("locked");
    expect(out.saved).to.deep.equal({ 1: "Two" });
  });

  it("stops on 429 and leaves the rest edited", async () => {
    const rows = [
      row("a", "/files/1.png", null),
      row("b", "/files/2.png", null),
      row("c", "/files/3.png", null),
    ];
    const pages = {
      a: [{ tag: "img", attrs: { src: "/files/1.png" } }],
      b: [{ tag: "img", attrs: { src: "/files/2.png" } }],
      c: [{ tag: "img", attrs: { src: "/files/3.png" } }],
    };
    const be = fakeBackend(pages, {
      patch: (pageId, ops, n) =>
        n === 2
          ? {
              status: 429,
              data: null,
              body: {
                status: 429,
                data: {
                  message:
                    "Block change limit reached: 1000 changes per 60 seconds for this site. You can retry in 12 seconds.",
                  reason: "rate-limited",
                  retryAfter: 12,
                  remaining: 0,
                },
              },
            }
          : null,
    });
    const out = await saveAltEdits(
      rows,
      { 0: "One", 1: "Two", 2: "Three" },
      {
        spec,
        call: be.call,
      },
    );
    expect(out.saved).to.deep.equal({ 0: "One" });
    expect(out.failed).to.deep.equal({});
    expect(out.stopped.retryAfter).to.equal(12);
    expect(out.stopped.message).to.contain("12 seconds");
    expect(out.pagesLeft).to.equal(2);
    expect(
      be.calls.filter((c) => c.name === ALT_SAVE_OPERATION).length,
    ).to.equal(2);
  });

  it("stops asking after a sign-in failure", async () => {
    const rows = [
      row("a", "/files/1.png", null),
      row("b", "/files/2.png", null),
    ];
    const pages = {
      a: [{ tag: "img", attrs: { src: "/files/1.png" } }],
      b: [{ tag: "img", attrs: { src: "/files/2.png" } }],
    };
    const be = fakeBackend(pages, {
      list: () => ({
        status: 401,
        data: null,
        body: { status: 401, data: { message: "Sign in again" } },
      }),
    });
    const out = await saveAltEdits(
      rows,
      { 0: "One", 1: "Two" },
      {
        spec,
        call: be.call,
      },
    );
    expect(out.failed[0]).to.deep.equal({
      kind: "error",
      message: "Sign in again",
    });
    expect(out.failed[1].kind).to.equal("error");
    expect(be.calls.length).to.equal(1);
  });
});

describe("insights-alt-save: accessibility screen", () => {
  let results;
  let realHas;
  let realCall;
  let backend;

  before(async () => {
    const site = await loadFixtureSite();
    results = analyzeSite(
      site.pages,
      site.manifest,
      spec,
      Object.assign({ extras: await loadExtras() }, RESULT_OPTIONS),
    );
  });

  function pagesFrom(rows) {
    const srcAttrs = imageSrcAttributes(spec);
    const pages = {};
    rows.forEach((r) => {
      const attrs = {};
      attrs[srcAttrs[r.tag] || "src"] = r.src;
      if (r.alt !== null) {
        attrs.alt = r.alt;
      }
      (pages[r.pageId] = pages[r.pageId] || []).push({ tag: r.tag, attrs });
    });
    return pages;
  }

  beforeEach(() => {
    realHas = MicroFrontendRegistry.has;
    realCall = MicroFrontendRegistry.call;
    MicroFrontendRegistry.has = (name) =>
      name === ALT_LIST_OPERATION || name === ALT_SAVE_OPERATION
        ? true
        : realHas.call(MicroFrontendRegistry, name);
    MicroFrontendRegistry.call = (name, params) => backend.call(name, params);
  });

  afterEach(() => {
    MicroFrontendRegistry.has = realHas;
    MicroFrontendRegistry.call = realCall;
  });

  async function render(r) {
    const el = await fixture(
      html`<insights-accessibility
        .results="${r}"
        .spec="${spec}"
      ></insights-accessibility>`,
    );
    await waitUntil(() => el._canSave, "save becomes available");
    return el;
  }

  async function type(el, i, value) {
    const input = el.shadowRoot.querySelector(`tr[data-row="${i}"] .alt-input`);
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
  }

  it("is available when the backend has the operations", async () => {
    expect(await altSaveAvailable()).to.equal(true);
  });

  it("confirms, saves, and marks rows saved with their new status", async () => {
    const r = JSON.parse(JSON.stringify(results));
    backend = fakeBackend(pagesFrom(r.accessibility.altRows));
    const el = await render(r);
    const save = el.shadowRoot.querySelector(".save-alt");
    expect(save.disabled).to.equal(true);
    const i = r.accessibility.altRows.findIndex((x) => x.status === "fix");
    await type(el, i, "A diagram of the water cycle");
    expect(save.disabled).to.equal(false);
    save.click();
    await el.updateComplete;
    const panel = el.shadowRoot.querySelector(".save-panel.confirm");
    expect(panel.textContent).to.contain("Save 1 alt text change on 1 page?");
    expect(panel.textContent).to.contain("Close these pages in the editor");
    expect(el.shadowRoot.activeElement).to.equal(
      el.shadowRoot.querySelector(".save-now"),
    );
    el.shadowRoot.querySelector(".save-now").click();
    await waitUntil(() => el._saveNote, "save finishes");
    await el.updateComplete;
    const tr = el.shadowRoot.querySelector(`tr[data-row="${i}"]`);
    expect(tr.dataset.save).to.equal("saved");
    expect(tr.dataset.status).to.equal("ok");
    expect(Object.keys(el._edits)).to.deep.equal([]);
    expect(r.accessibility.altRows[i].alt).to.equal(
      "A diagram of the water cycle",
    );
    expect(el.shadowRoot.querySelector(".save-note").textContent).to.contain(
      "Saved 1 alt text change on 1 page.",
    );
    const patch = backend.calls.find((c) => c.name === ALT_SAVE_OPERATION);
    expect(patch.params.idOrSlug).to.equal(r.accessibility.altRows[i].pageId);
    expect(patch.params.ops[0].set).to.deep.equal({
      alt: "A diagram of the water cycle",
    });
  });

  it("Cancel sends nothing and returns focus to Save", async () => {
    const r = JSON.parse(JSON.stringify(results));
    backend = fakeBackend(pagesFrom(r.accessibility.altRows));
    const el = await render(r);
    await type(el, 0, "Something new");
    el.shadowRoot.querySelector(".save-alt").click();
    await el.updateComplete;
    el.shadowRoot.querySelector(".cancel-save").click();
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".save-panel")).to.equal(null);
    expect(el.shadowRoot.activeElement).to.equal(
      el.shadowRoot.querySelector(".save-alt"),
    );
    expect(backend.calls.length).to.equal(0);
    expect(Object.keys(el._edits)).to.deep.equal(["0"]);
  });

  it("keeps a failed edit with the reason on its row", async () => {
    const r = JSON.parse(JSON.stringify(results));
    const pages = pagesFrom(r.accessibility.altRows);
    backend = fakeBackend(pages);
    const el = await render(r);
    await type(el, 0, "Mine");
    // the image changes on the server after the scan
    const first = pages[r.accessibility.altRows[0].pageId].find(
      (e) =>
        e.attrs.src === r.accessibility.altRows[0].src ||
        e.attrs.source === r.accessibility.altRows[0].src,
    );
    first.attrs.alt = "Changed elsewhere";
    el.shadowRoot.querySelector(".save-alt").click();
    await el.updateComplete;
    el.shadowRoot.querySelector(".save-now").click();
    await waitUntil(() => el._saveNote, "save finishes");
    await el.updateComplete;
    const tr = el.shadowRoot.querySelector('tr[data-row="0"]');
    expect(tr.dataset.save).to.equal("failed");
    expect(tr.querySelector(".save-state").textContent).to.contain(
      "changed on the server",
    );
    expect(el._edits[0]).to.equal("Mine");
    expect(el._saveNote.tone).to.equal("warning");
  });

  it("says how many pages wait for the next click", async () => {
    const r = JSON.parse(JSON.stringify(results));
    r.accessibility.bulkAltSave = { maxPagesPerSave: 1 };
    backend = fakeBackend(pagesFrom(r.accessibility.altRows));
    const el = await render(r);
    const rows = r.accessibility.altRows;
    const second = rows.findIndex((x) => x.pageId !== rows[0].pageId);
    expect(second).to.be.above(0);
    await type(el, 0, "First page image");
    await type(el, second, "Second page image");
    el.shadowRoot.querySelector(".save-alt").click();
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".save-panel .cap").textContent,
    ).to.contain("click Save again for the other 1");
    el.shadowRoot.querySelector(".save-now").click();
    await waitUntil(() => el._saveNote, "save finishes");
    expect(el._saveNote.text).to.contain("1 more page has edits");
    expect(Object.keys(el._edits)).to.deep.equal([String(second)]);
  });

  it("without a backend, Save stays disabled and says why", async () => {
    MicroFrontendRegistry.has = realHas;
    const el = await fixture(
      html`<insights-accessibility
        .results="${results}"
        .spec="${spec}"
      ></insights-accessibility>`,
    );
    await el.updateComplete;
    await type(el, 0, "Something");
    expect(el.shadowRoot.querySelector(".save-alt").disabled).to.equal(true);
    expect(el.shadowRoot.querySelector(".note").textContent).to.contain(
      "Saving needs this site open on its HAXcms server",
    );
  });

  it("is accessible while confirming", async () => {
    const r = JSON.parse(JSON.stringify(results));
    backend = fakeBackend(pagesFrom(r.accessibility.altRows));
    const el = await render(r);
    await type(el, 0, "Something new");
    el.shadowRoot.querySelector(".save-alt").click();
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });
});
