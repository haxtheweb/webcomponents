import { fixture, expect, html, aTimeout, waitUntil } from "@open-wc/testing";
import "../lib/core/haxcms-outline-editor-dialog.js";
import { store } from "../lib/core/haxcms-site-store.js";

// haxtheweb/issues#3253: Undo right after a save brought back the outline
// from before the save. Its snapshot still had the client id of a page the
// save had just created (the server gave it a new id), so the next save sent
// that id as a new page and the site stored the page twice. Once the
// outline is replaced by what the server stored, an undo must not reach
// back past it.

function page(id, title, parent, order, indent) {
  return {
    id,
    title,
    slug: `slug-${id}`,
    location: `pages/${id}/index.html`,
    order,
    parent,
    indent,
    metadata: { locked: false, published: true, created: 1, updated: 2 },
  };
}

const stored = () => [
  page("a", "A", null, 0, 0),
  page("b", "B", null, 1, 0),
  page("c", "C", null, 2, 0),
];

async function settle(el) {
  await aTimeout(0);
  await el.updateComplete;
}

describe("outline undo after a save (haxtheweb/issues#3253)", () => {
  let originalManifest;
  beforeEach(() => {
    originalManifest = store.manifest;
    store.manifest = { items: stored() };
  });
  afterEach(() => {
    store.manifest = originalManifest;
  });

  async function dialog() {
    const el = await fixture(
      html`<haxcms-outline-editor-dialog></haxcms-outline-editor-dialog>`,
    );
    await settle(el);
    const outline = el.shadowRoot.querySelector("#outline");
    await outline.updateComplete;
    return { el, outline };
  }

  it("outline-designer clearUndo() drops the pending undo and its timer", async () => {
    const { outline } = await dialog();
    await outline._toggleDelete(outline.items.findIndex((i) => i.id === "b"));
    await settle(outline);
    expect(outline._undo).to.not.equal(null);
    outline.clearUndo();
    expect(outline._undo).to.equal(null);
    expect(outline._undoTimer).to.equal(null);
    // nothing to undo: the outline stays as it is
    const before = JSON.stringify(outline.items);
    outline.undo();
    expect(JSON.stringify(outline.items)).to.equal(before);
  });

  it("a reload with saved data clears the undo, so the next save sends no stale ids", async () => {
    const { el, outline } = await dialog();
    // add a page (client id), then delete a selection: undo now holds a
    // snapshot with the client id
    await outline._addAfterAndEdit(
      outline.items.findIndex((i) => i.id === "c"),
    );
    await settle(outline);
    const added = outline.items.find(
      (i) => ["a", "b", "c"].indexOf(i.id) === -1,
    );
    expect(added, "a page was added").to.exist;
    await outline._toggleDelete(outline.items.findIndex((i) => i.id === "b"));
    await settle(outline);
    expect(outline._undo).to.not.equal(null);
    // the save lands: the server stored the new page under its own id and
    // removed B; the store reloads the manifest
    const server = [
      page("a", "A", null, 0, 0),
      page("c", "C", null, 1, 0),
      page("server-1", added.title, null, 2, 0),
    ];
    store.manifest = { items: server };
    await settle(el);
    await settle(el);
    await outline.updateComplete;
    expect(outline.items.map((i) => i.id)).to.deep.equal([
      "a",
      "c",
      "server-1",
    ]);
    expect(outline._undo, "no undo past a save").to.equal(null);
    // Ctrl/Cmd+Z right after the save leaves the saved outline alone
    outline.undo();
    await settle(outline);
    const ids = outline.items.map((i) => i.id);
    expect(ids).to.deep.equal(["a", "c", "server-1"]);
    expect(ids).to.not.include(added.id);
    expect(outline.items.some((i) => i.delete)).to.equal(false);
  });

  it("an undo offered after the reload still works", async () => {
    const { el, outline } = await dialog();
    store.manifest = { items: stored() };
    await settle(el);
    await outline.updateComplete;
    const before = JSON.stringify(outline.items.map((i) => [i.id, !!i.delete]));
    await outline._toggleDelete(outline.items.findIndex((i) => i.id === "a"));
    await settle(outline);
    expect(outline._undo).to.not.equal(null);
    outline.undo();
    // undo animates; the items are put back inside the motion
    const now = () =>
      JSON.stringify(outline.items.map((i) => [i.id, !!i.delete]));
    await waitUntil(() => now() === before, "undo restores the outline", {
      timeout: 2000,
    });
    expect(now()).to.equal(before);
  });

  it("discard() also clears a pending undo", async () => {
    const { el, outline } = await dialog();
    await outline._toggleDelete(outline.items.findIndex((i) => i.id === "b"));
    await settle(outline);
    expect(outline._undo).to.not.equal(null);
    el.discard();
    await settle(el);
    expect(outline._undo).to.equal(null);
  });
});
