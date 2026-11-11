import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { toJS } from "mobx";
import "../lib/core/haxcms-outline-editor-dialog.js";
import "../lib/core/haxcms-site-builder.js";
import { store, normalizeOutlineId } from "../lib/core/haxcms-site-store.js";
import { answerAdminDialogs } from "./fixtures/admin-dialog-answers.js";
import { STRING_SITE_SNAPSHOT } from "./fixtures/manifest-string-ids-snapshot.js";

// The JSON Outline Schema item id is a string and parent is an id or null.
// Both backends turn whole-number ids / parents into strings when they load
// site.json, but the editor reads site.json as a static file, so a
// hand-made site.json with numeric ids reaches the front end as numbers.
// store.loadManifest (the one path every manifest takes into the store)
// applies the same rule, so site-menu, routing, outline-designer and the
// Save Outline payload only ever see string ids.

// a hand-made site.json: ids 0..5 as numbers, one string id, parents as
// numbers, "" and null; out of order, a missing slug and a string order so
// the store's other load-time repairs run too
function manifest(id) {
  const item = (key, title, parent, order, indent, extra = {}) => ({
    id: id(key),
    title,
    slug: `slug-${key}`,
    location: `pages/${key}/index.html`,
    description: `About ${title}`,
    order,
    parent: typeof parent === "number" ? id(parent) : parent,
    indent,
    metadata: { published: true, locked: false, created: 1, updated: 2 },
    ...extra,
  });
  return {
    id: "site-numeric-ids",
    title: "Numeric ids",
    author: "",
    description: "",
    license: "by-sa",
    metadata: {
      site: { name: "numeric-ids", created: 1, updated: 2 },
      theme: { element: "clean-one", variables: {} },
      node: { fields: {} },
    },
    items: [
      item(2, "Two", 1, 1, 1),
      item(1, "One", null, 0, 0),
      item(0, "Zero", null, 1, 0),
      item(3, "Three", "", 2, 0, { slug: undefined, metadata: {} }),
      item(4, "Four", 0, 0, 1),
      item(5, "Five", 1, "0", 1),
      {
        ...item(6, "Six", 2, 0, 2),
        id: "page-6",
      },
    ],
  };
}
const numericManifest = () => manifest((k) => k);
const stringManifest = () => manifest((k) => String(k));

async function loaded(m) {
  await store.loadManifest(m);
  return JSON.parse(JSON.stringify(toJS(store.manifest)));
}

const ids = (items) => items.map((i) => i.id);
const parents = (items) => items.map((i) => i.parent);

describe("numeric outline ids in a hand-made site.json", () => {
  let saved;
  let restoreDialogs = () => {};
  beforeEach(() => {
    saved = { manifest: store.manifest, activeId: store.activeId };
  });
  afterEach(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    restoreDialogs();
    restoreDialogs = () => {};
  });

  it("normalizeOutlineId follows the backends' rule", () => {
    expect(normalizeOutlineId(7)).to.equal("7");
    expect(normalizeOutlineId(0)).to.equal("0");
    expect(normalizeOutlineId(-0)).to.equal("0");
    expect(normalizeOutlineId(7.0)).to.equal("7");
    expect(normalizeOutlineId(-3)).to.equal("-3");
    // left alone: not a safe integer, or not a number at all
    expect(normalizeOutlineId(1.5)).to.equal(1.5);
    expect(normalizeOutlineId(2 ** 53)).to.equal(2 ** 53);
    expect(Number.isNaN(normalizeOutlineId(NaN))).to.equal(true);
    expect(normalizeOutlineId(Infinity)).to.equal(Infinity);
    expect(normalizeOutlineId(null)).to.equal(null);
    expect(normalizeOutlineId(undefined)).to.equal(undefined);
    expect(normalizeOutlineId("")).to.equal("");
    expect(normalizeOutlineId("7")).to.equal("7");
    expect(normalizeOutlineId(" 7 ")).to.equal(" 7 ");
    expect(normalizeOutlineId("item-1")).to.equal("item-1");
  });

  it("loads numeric ids and parents as strings and changes nothing else", async () => {
    const fromNumbers = await loaded(numericManifest());
    expect(ids(fromNumbers.items)).to.deep.equal([
      "1",
      "5",
      "2",
      "page-6",
      "0",
      "4",
      "3",
    ]);
    expect(parents(fromNumbers.items)).to.deep.equal([
      null,
      "1",
      "1",
      "2",
      null,
      "0",
      // "" was already turned into null on load; unchanged
      null,
    ]);
    fromNumbers.items.forEach((item) => {
      expect(typeof item.id, item.title).to.equal("string");
    });
    // byte for byte what the same site with string ids loads as
    const fromStrings = await loaded(stringManifest());
    expect(fromNumbers).to.deep.equal(fromStrings);
  });

  it("loads a string-id site exactly as before", async () => {
    const result = await loaded(stringManifest());
    expect(result).to.deep.equal(STRING_SITE_SNAPSHOT);
  });

  it("store lookups work by string id on a numeric-id site", async () => {
    await store.loadManifest(numericManifest());
    expect(store.findItem("2").title).to.equal("Two");
    expect(store.findItem("0").title).to.equal("Zero");
    expect(store.getItemChildren("1").map((i) => i.title)).to.have.members([
      "Two",
      "Five",
    ]);
    expect(store.getItemChildren("0").map((i) => i.title)).to.deep.equal([
      "Four",
    ]);
  });

  it("goes through the site builder's manifest path", async () => {
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    // an element stands in for the builder: loadManifest dispatches on it
    const stub = globalThis.document.createElement("div");
    Builder.prototype._updateManifest.call(
      stub,
      JSON.parse(JSON.stringify(numericManifest())),
    );
    Builder.prototype._manifestChanged.call(stub, stub.manifest);
    await waitUntil(
      () =>
        store.manifest &&
        store.manifest.id === "site-numeric-ids" &&
        store.manifest.items.length === 7,
    );
    expect(store.manifest.items.every((i) => typeof i.id === "string")).to.be
      .true;
    expect(store.findItem("4").parent).to.equal("0");
  });

  it("outline-designer shows the site and Save Outline sends string ids with only the renamed page modified", async function () {
    restoreDialogs = answerAdminDialogs({ confirm: () => true });
    await store.loadManifest(numericManifest());
    const el = await fixture(
      html`<haxcms-outline-editor-dialog></haxcms-outline-editor-dialog>`,
    );
    const outline = el.shadowRoot.querySelector("#outline");
    await waitUntil(() => outline.items && outline.items.length === 7);
    await outline.updateComplete;
    // every page is shown, in outline order, at its depth
    const rows = [...outline.shadowRoot.querySelectorAll("li.item")];
    expect(rows.map((r) => r.getAttribute("data-item-id"))).to.deep.equal([
      "1",
      "5",
      "2",
      "page-6",
      "0",
      "4",
      "3",
    ]);
    expect(
      outline.items.map((i) => `${i.title}@${i.indent}`).join(" "),
    ).to.equal("One@0 Five@1 Two@1 Six@2 Zero@0 Four@1 Three@0");
    // rename page "4" the way the title editor commits it (the row's
    // data-item-id is a string; a numeric id never matched and the rename
    // was dropped)
    const li = outline.shadowRoot.querySelector('li.item[data-item-id="4"]');
    const labelEdit = li.querySelector(".label-edit");
    labelEdit.textContent = "Four renamed";
    outline.monitorTitle({ key: "Enter", target: labelEdit });
    await outline.updateComplete;
    // Save Outline
    let sent = null;
    const listen = (e) => {
      sent = JSON.parse(JSON.stringify(e.detail));
    };
    globalThis.addEventListener("haxcms-save-outline", listen);
    try {
      expect(await el._saveTap()).to.equal(true);
    } finally {
      globalThis.removeEventListener("haxcms-save-outline", listen);
    }
    expect(sent).to.not.equal(null);
    expect(sent.length).to.equal(7);
    sent.forEach((item) => {
      expect(typeof item.id, item.title).to.equal("string");
      expect(
        item.parent === null || typeof item.parent === "string",
        item.title,
      ).to.equal(true);
    });
    expect(sent.find((i) => i.id === "4").title).to.equal("Four renamed");
    expect(sent.find((i) => i.id === "4").parent).to.equal("0");
    expect(sent.filter((i) => i.modified).map((i) => i.id)).to.deep.equal([
      "4",
    ]);
    expect(sent.filter((i) => i.new || i.delete)).to.deep.equal([]);
  });
});
