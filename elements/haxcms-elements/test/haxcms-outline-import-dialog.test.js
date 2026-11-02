// Structure's import step inside the admin dialog: a form section that is
// unsaved from the start, and Save sends the same haxcms-create-node event
// the old stand-alone import dialog sent.
import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import "../lib/core/haxcms-outline-import-dialog.js";

const ITEMS = [
  { id: "imp-1", title: "Chapter 1", parent: null, order: 0, indent: 0 },
  { id: "imp-2", title: "Section 1.1", parent: "imp-1", order: 0, indent: 1 },
];

async function importStep(items = ITEMS) {
  const host = await fixture(html`<div style="height: 600px"></div>`);
  const states = [];
  host.addEventListener("haxcms-admin-section-state", (e) =>
    states.push(e.detail),
  );
  const el = globalThis.document.createElement("haxcms-outline-import-dialog");
  el.inShell = true;
  el.items = JSON.parse(JSON.stringify(items));
  host.appendChild(el);
  await el.updateComplete;
  return { el, states };
}

describe("haxcms-outline-import-dialog", () => {
  it("shows the imported pages and reports them as unsaved", async () => {
    const { el, states } = await importStep();
    const od = el.shadowRoot.querySelector("outline-designer");
    expect(od).to.exist;
    expect(od.storeTools).to.equal(true);
    expect(od.hideDelete).to.equal(true);
    expect(od.items.length).to.equal(2);
    const last = states[states.length - 1];
    expect(last.dirty).to.equal(true);
    expect(last.canSave).to.equal(true);
    expect(last.changes).to.deep.equal(["2 pages ready to import"]);
  });

  it("says so when there is nothing to import, and cannot save", async () => {
    const { el, states } = await importStep([]);
    expect(el.shadowRoot.querySelector("outline-designer")).to.equal(null);
    expect(el.shadowRoot.querySelector(".empty")).to.exist;
    expect(states[states.length - 1].canSave).to.equal(false);
    expect(el.save()).to.equal(false);
  });

  it("saves through haxcms-create-node with outline-designer data", async () => {
    const { el } = await importStep();
    const od = el.shadowRoot.querySelector("outline-designer");
    await waitUntil(() => od.shadowRoot, "outline-designer rendered");
    const payload = { items: ["arranged"] };
    od.getData = () => Promise.resolve(payload);
    const results = [];
    const onResult = (e) => results.push(e.detail);
    globalThis.addEventListener("haxcms-admin-save-result", onResult);
    const created = oneEvent(globalThis, "haxcms-create-node");
    expect(el.save()).to.equal(true);
    const e = await created;
    globalThis.removeEventListener("haxcms-admin-save-result", onResult);
    expect(e.detail.values).to.equal(payload);
    expect(e.detail.originalTarget).to.equal(el);
    expect(results).to.deep.equal([{ operation: "importOutline", ok: true }]);
  });

  it("is accessible", async () => {
    const { el } = await importStep();
    await expect(el).shadowDom.to.be.accessible();
  });
});
