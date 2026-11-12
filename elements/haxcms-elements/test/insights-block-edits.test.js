import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import {
  analyzeSite,
  titleStatus,
} from "../lib/core/insights/insights-analyzer.js";
import {
  BLOCK_LIST_OPERATION,
  BLOCK_SAVE_OPERATION,
  groupBlockEdits,
  matchBlocks,
  saveBlockEdits,
} from "../lib/core/insights/insights-block-save.js";
import { urlReplaceProposals } from "../lib/core/insights/insights-url-replace.js";
import "../lib/core/insights/sections/insights-links.js";
import "../lib/core/insights/sections/insights-media.js";
import "../lib/core/insights/sections/insights-accessibility.js";
import { loadSpec, RESULT_OPTIONS } from "./insights-fixture-helpers.js";

// Block operations phase 3 (haxtheweb/issues#3321): Replace URLs, video and
// embed titles, gif titles and long descriptions. Rows are one attribute on
// one element; the save goes through the same GET .../blocks + PATCH as
// alt text. A fake backend holds each page's elements and answers both.
let spec;

const PAGES = {
  a: `<p>Intro <a href="https://media.old.edu/files/a.pdf">notes</a></p>
<img src="https://media.old.edu/img/one.png" alt="One" longdesc="https://media.old.edu/desc/one.html">
<video-player source="https://www.youtube.com/watch?v=abc" media-title="Video"></video-player>
<iframe src="https://example.org/embed/1"></iframe>`,
  b: `<a href="https://media.old.edu/files/b.pdf">b</a>
<a href="https://keep.example.com/x">keep</a>
<a11y-gif-player src="files/spin.gif" alt="Spinning"></a11y-gif-player>
<iframe src="https://example.org/embed/2" title="Map of campus"></iframe>`,
};

function siteOf(pages) {
  const items = Object.keys(pages).map((id, i) => ({
    id,
    slug: `page-${id}`,
    title: `Page ${id}`,
    order: i,
    location: `pages/${id}/index.html`,
    metadata: {},
  }));
  return {
    manifest: { title: "Test", items, metadata: {} },
    pages: items.map((item) => ({ item, html: pages[item.id] })),
  };
}

function analyze(pages) {
  const site = siteOf(pages);
  return analyzeSite(site.pages, site.manifest, spec, RESULT_OPTIONS);
}

function escapeAttr(v) {
  return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/** elements parsed back out of PAGES, as the backend's block list sees them */
function elementsOf(pages) {
  const out = {};
  const allow = spec.blockAttributes.tags;
  Object.keys(pages).forEach((id) => {
    const doc = new DOMParser().parseFromString(pages[id], "text/html");
    out[id] = [];
    doc.body.querySelectorAll("*").forEach((node) => {
      const tag = node.localName;
      if (!allow[tag]) {
        return;
      }
      const attrs = {};
      Array.from(node.attributes).forEach((a) => {
        attrs[a.name] = a.value;
      });
      out[id].push({ tag, attrs });
    });
  });
  return out;
}

function fakeBackend(pages, hooks) {
  const h = hooks || {};
  const calls = [];
  const allow = spec.blockAttributes.tags;
  const html1 = (el) =>
    `<${el.tag}${Object.keys(el.attrs)
      .map((k) => ` ${k}="${escapeAttr(el.attrs[k])}"`)
      .join("")}>`;
  const blocksOf = (pageId) => {
    const seen = {};
    return pages[pageId].map((el) => {
      seen[el.tag] = (seen[el.tag] || 0) + 1;
      const attributes = {};
      Object.keys(el.attrs).forEach((name) => {
        if (allow[el.tag][name]) {
          attributes[name] = el.attrs[name];
        }
      });
      return {
        tag: el.tag,
        index: seen[el.tag] - 1,
        before: html1(el),
        attributes,
      };
    });
  };
  const call = async (name, params) => {
    calls.push({ name, params: JSON.parse(JSON.stringify(params)) });
    if (name === BLOCK_LIST_OPERATION) {
      return { status: 200, data: { blocks: blocksOf(params.idOrSlug) } };
    }
    if (h.patch) {
      const r = h.patch(params.idOrSlug, params.ops);
      if (r) {
        return r;
      }
    }
    const blocks = blocksOf(params.idOrSlug);
    for (let i = 0; i < params.ops.length; i++) {
      const op = params.ops[i];
      const found = blocks.filter((b) => b.tag === op.tag)[op.index];
      if (!found || found.before !== op.before) {
        return {
          status: 409,
          data: null,
          body: { status: 409, data: { reason: "stale", op: i } },
        };
      }
    }
    params.ops.forEach((op) => {
      const el = pages[params.idOrSlug].filter((e) => e.tag === op.tag)[
        op.index
      ];
      Object.assign(el.attrs, op.set);
    });
    return {
      status: 200,
      data: { results: params.ops.map((op, i) => ({ op: i })) },
    };
  };
  return { call, calls };
}

before(async () => {
  spec = await loadSpec();
});

describe("insights-block-edits: analyzer rows", () => {
  it("lists every URL the block API can change, with its attribute", () => {
    const r = analyze(PAGES);
    const urls = r.links.blockUrls.map((row) => [
      row.pageId,
      row.tag,
      row.attribute,
      row.value,
    ]);
    expect(urls).to.deep.include.members([
      ["a", "a", "href", "https://media.old.edu/files/a.pdf"],
      ["a", "img", "src", "https://media.old.edu/img/one.png"],
      ["a", "img", "longdesc", "https://media.old.edu/desc/one.html"],
      ["a", "video-player", "source", "https://www.youtube.com/watch?v=abc"],
      ["a", "iframe", "src", "https://example.org/embed/1"],
      ["b", "a11y-gif-player", "src", "files/spin.gif"],
    ]);
    expect(r.links.urlSave.note).to.equal(spec.bulkAltSave.replaceUrlsNote);
  });

  it("rates video and embed titles: missing, generic or ok", () => {
    const r = analyze(PAGES);
    const rows = r.media.titleRows.map((row) => [
      row.pageId,
      row.tag,
      row.attribute,
      row.value,
      row.status,
    ]);
    expect(rows).to.deep.equal([
      ["a", "video-player", "media-title", "Video", "generic"],
      ["a", "iframe", "title", null, "missing"],
      ["b", "iframe", "title", "Map of campus", "ok"],
    ]);
    expect(r.media.titleSave.srcAttributes["video-player"]).to.deep.equal([
      "source",
      "src",
    ]);
    expect(titleStatus("  ", spec)).to.equal("missing");
    expect(titleStatus("YouTube video", spec)).to.equal("generic");
    expect(titleStatus("Titration demo", spec)).to.equal("ok");
  });

  it("lists gif titles and descriptions when missing, img longdesc when set", () => {
    const r = analyze(PAGES);
    const rows = r.accessibility.descRows.map((row) => [
      row.pageId,
      row.tag,
      row.attribute,
      row.status,
    ]);
    expect(rows).to.deep.equal([
      ["a", "img", "longdesc", "ok"],
      ["b", "a11y-gif-player", "media-title", "missing"],
      ["b", "a11y-gif-player", "longdesc", "missing"],
    ]);
  });
});

describe("insights-block-edits: proposals and matching", () => {
  it("proposes a prefix swap for matching URLs only", () => {
    const r = analyze(PAGES);
    const p = urlReplaceProposals(
      r.links.blockUrls,
      "https://media.old.edu/",
      "https://cdn.new.edu/",
    );
    // page order, then the element's attributes in allowlist order
    expect(p.rows.map((row) => row.value)).to.deep.equal([
      "https://media.old.edu/files/a.pdf",
      "https://media.old.edu/desc/one.html",
      "https://media.old.edu/img/one.png",
      "https://media.old.edu/files/b.pdf",
    ]);
    expect(p.proposals).to.deep.equal({
      0: "https://cdn.new.edu/files/a.pdf",
      1: "https://cdn.new.edu/desc/one.html",
      2: "https://cdn.new.edu/img/one.png",
      3: "https://cdn.new.edu/files/b.pdf",
    });
    expect(urlReplaceProposals(r.links.blockUrls, "", "x").rows).to.have.length(
      0,
    );
    expect(
      urlReplaceProposals(r.links.blockUrls, "https://keep", "https://keep")
        .rows,
    ).to.have.length(0);
  });

  it("puts two edited attributes of one element in one op", () => {
    const rows = [
      { pageId: "a", tag: "img", attribute: "src", value: "/x.png", src: "" },
      {
        pageId: "a",
        tag: "img",
        attribute: "longdesc",
        value: "/d.html",
        src: "",
      },
    ];
    const blocks = [
      {
        tag: "img",
        index: 0,
        before: "<img>",
        attributes: { src: "/x.png", longdesc: "/d.html" },
      },
    ];
    const page = groupBlockEdits(rows, { 0: "/y.png", 1: "/e.html" })[0];
    const m = matchBlocks(page, blocks, {});
    expect(m.ops).to.deep.equal([
      {
        op: "setAttributes",
        tag: "img",
        index: 0,
        before: "<img>",
        set: { src: "/y.png", longdesc: "/e.html" },
      },
    ]);
    expect(m.opRows).to.deep.equal([[0, 1]]);
  });

  it("tells same-titled embeds apart by their source", () => {
    const rows = [
      {
        pageId: "a",
        tag: "iframe",
        attribute: "title",
        value: null,
        src: "/1",
      },
      {
        pageId: "a",
        tag: "iframe",
        attribute: "title",
        value: null,
        src: "/2",
      },
    ];
    const blocks = [
      { tag: "iframe", index: 0, before: "<i1>", attributes: { src: "/1" } },
      { tag: "iframe", index: 1, before: "<i2>", attributes: { src: "/2" } },
    ];
    const opts = { srcAttributes: { iframe: ["src"] } };
    const page = groupBlockEdits(rows, { 1: "Second map" }, opts)[0];
    const m = matchBlocks(page, blocks, opts);
    expect(m.ops.map((op) => [op.index, op.set.title])).to.deep.equal([
      [1, "Second map"],
    ]);
  });

  it("skips empty edits unless empty is allowed", () => {
    const rows = [
      { pageId: "a", tag: "iframe", attribute: "title", value: "Old", src: "" },
    ];
    expect(groupBlockEdits(rows, { 0: "  " })).to.have.length(0);
    expect(
      groupBlockEdits(rows, { 0: "" }, { allowEmpty: true }),
    ).to.have.length(1);
  });

  it("saves URL swaps and sends the note", async () => {
    const r = analyze(PAGES);
    const pages = elementsOf(PAGES);
    const be = fakeBackend(pages);
    const p = urlReplaceProposals(
      r.links.blockUrls,
      "https://media.old.edu/",
      "https://cdn.new.edu/",
    );
    const out = await saveBlockEdits(p.rows, p.proposals, {
      note: "URLs replaced from Reports",
      srcAttributes: {},
      call: be.call,
    });
    expect(Object.keys(out.saved)).to.have.length(4);
    expect(out.pagesSaved).to.equal(2);
    expect(pages.a[0].attrs.href).to.equal("https://cdn.new.edu/files/a.pdf");
    expect(pages.a[1].attrs.src).to.equal("https://cdn.new.edu/img/one.png");
    expect(pages.a[1].attrs.longdesc).to.equal(
      "https://cdn.new.edu/desc/one.html",
    );
    expect(pages.b[1].attrs.href).to.equal("https://keep.example.com/x");
    const patches = be.calls.filter((c) => c.name === BLOCK_SAVE_OPERATION);
    expect(patches).to.have.length(2);
    patches.forEach((c) => {
      expect(c.params.note).to.equal("URLs replaced from Reports");
    });
  });
});

describe("insights-block-edits: screens", () => {
  let realHas;
  let realCall;
  let backend;

  beforeEach(() => {
    realHas = MicroFrontendRegistry.has;
    realCall = MicroFrontendRegistry.call;
    MicroFrontendRegistry.has = (name) =>
      name === BLOCK_LIST_OPERATION || name === BLOCK_SAVE_OPERATION
        ? true
        : realHas.call(MicroFrontendRegistry, name);
    MicroFrontendRegistry.call = (name, params) => backend.call(name, params);
  });

  afterEach(() => {
    MicroFrontendRegistry.has = realHas;
    MicroFrontendRegistry.call = realCall;
  });

  function editorIn(screen, selector) {
    return screen.shadowRoot.querySelector(selector);
  }

  async function ready(editor) {
    await waitUntil(() => editor._canSave, "save should become available");
    await editor.updateComplete;
  }

  async function confirmSave(editor) {
    editor.shadowRoot.querySelector(".save-rows").click();
    await editor.updateComplete;
    editor.shadowRoot.querySelector(".save-now").click();
    await waitUntil(() => editor._saveNote, "save should finish");
    await editor.updateComplete;
  }

  it("Links: finds URLs, saves the checked ones", async () => {
    const pages = elementsOf(PAGES);
    backend = fakeBackend(pages);
    const r = analyze(PAGES);
    const screen = await fixture(
      html`<insights-links .results="${r}"></insights-links>`,
    );
    const replace = screen.shadowRoot.querySelector("insights-url-replace");
    await replace.updateComplete;
    const find = replace.shadowRoot.querySelector("input.find");
    find.value = "https://media.old.edu/";
    find.dispatchEvent(new Event("input"));
    const to = replace.shadowRoot.querySelector("input.replace");
    to.value = "https://cdn.new.edu/";
    to.dispatchEvent(new Event("input"));
    await replace.updateComplete;
    replace.shadowRoot.querySelector(".find-urls").click();
    await replace.updateComplete;
    const editor = replace.shadowRoot.querySelector("insights-block-editor");
    await ready(editor);
    const boxes = editor.shadowRoot.querySelectorAll("input.include");
    expect(boxes).to.have.length(4);
    // keep b.pdf as it is
    boxes[3].click();
    await editor.updateComplete;
    await expect(replace).shadowDom.to.be.accessible();
    await confirmSave(editor);
    expect(pages.a[0].attrs.href).to.equal("https://cdn.new.edu/files/a.pdf");
    expect(pages.b[0].attrs.href).to.equal("https://media.old.edu/files/b.pdf");
    expect(
      editor.shadowRoot.querySelectorAll('tr[data-save="saved"]'),
    ).to.have.length(3);
  });

  it("Media: edits a missing iframe title and saves it", async () => {
    const pages = elementsOf(PAGES);
    backend = fakeBackend(pages);
    const r = analyze(PAGES);
    const screen = await fixture(
      html`<insights-media .results="${r}"></insights-media>`,
    );
    const editor = editorIn(screen, "insights-block-editor.titles");
    await ready(editor);
    const row = editor.shadowRoot.querySelector('tr[data-status="missing"]');
    const input = row.querySelector("input.value-input");
    input.value = "Lab safety walkthrough";
    input.dispatchEvent(new Event("input"));
    await editor.updateComplete;
    expect(row.getAttribute("data-status")).to.equal("ok");
    await expect(editor).shadowDom.to.be.accessible();
    await confirmSave(editor);
    expect(pages.a[3].attrs.title).to.equal("Lab safety walkthrough");
    expect(r.media.titleRows[1].value).to.equal("Lab safety walkthrough");
  });

  it("Accessibility: saves a gif title, marks a stale row Not saved", async () => {
    const pages = elementsOf(PAGES);
    backend = fakeBackend(pages);
    const r = analyze(PAGES);
    const screen = await fixture(
      html`<insights-accessibility .results="${r}"></insights-accessibility>`,
    );
    const editor = editorIn(screen, "insights-block-editor.descriptions");
    await ready(editor);
    // someone gave the gif a description on the server after the scan
    const gif = pages.b[2];
    expect(gif.tag).to.equal("a11y-gif-player");
    gif.attrs.longdesc = "Added elsewhere";
    const inputs = editor.shadowRoot.querySelectorAll("input.value-input");
    // rows: img longdesc, gif media-title, gif longdesc
    inputs[1].value = "Spinning molecule";
    inputs[1].dispatchEvent(new Event("input"));
    inputs[2].value = "A molecule turns once a second";
    inputs[2].dispatchEvent(new Event("input"));
    await editor.updateComplete;
    await confirmSave(editor);
    // the title still holds what was scanned, so it saves; the description
    // changed on the server, so that row is left alone
    expect(gif.attrs["media-title"]).to.equal("Spinning molecule");
    expect(gif.attrs.longdesc).to.equal("Added elsewhere");
    expect(
      editor.shadowRoot.querySelectorAll('tr[data-save="saved"]'),
    ).to.have.length(1);
    expect(
      editor.shadowRoot.querySelectorAll('tr[data-save="failed"]'),
    ).to.have.length(1);
  });
});
