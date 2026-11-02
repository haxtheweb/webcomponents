import { fixture, expect, html } from "@open-wc/testing";
import "../lib/core/haxcms-outline-editor-dialog.js";
import { store } from "../lib/core/haxcms-site-store.js";

// Structure inside the site admin dialog (haxtheweb/issues#3180): the same
// Save Outline flow, with the leave checks routed through the shell.
function withOutlineItems(dialog, items) {
  const outline = dialog.shadowRoot.querySelector("#outline");
  outline.items = items;
  return outline;
}

describe("haxcms-outline-editor-dialog in the site admin dialog", () => {
  let confirmCalls;
  let confirmAnswer;
  let originalConfirm;
  beforeEach(() => {
    confirmCalls = [];
    confirmAnswer = false;
    originalConfirm = globalThis.confirm;
    globalThis.confirm = (msg) => {
      confirmCalls.push(msg);
      return confirmAnswer;
    };
  });
  afterEach(() => {
    globalThis.confirm = originalConfirm;
  });

  it("reflects in-shell and leaves Save and Delete selected to the shell's action bar", async () => {
    const el = document.createElement("haxcms-outline-editor-dialog");
    el.inShell = true;
    const host = await fixture(html`<div></div>`);
    host.appendChild(el);
    await el.updateComplete;
    expect(el.hasAttribute("in-shell")).to.be.true;
    expect(el.shadowRoot.querySelector("button.hax-modal-btn")).to.not.exist;
    expect(el.shadowRoot.querySelector("#outline").hasAttribute("host-actions"))
      .to.be.true;
    // on its own it keeps its Save Outline button and toolbar delete
    const own = await fixture(
      html`<haxcms-outline-editor-dialog></haxcms-outline-editor-dialog>`,
    );
    await own.updateComplete;
    const save = own.shadowRoot.querySelector("button.hax-modal-btn");
    expect(save.textContent.trim()).to.equal("Save Outline");
    expect(
      own.shadowRoot.querySelector("#outline").hasAttribute("host-actions"),
    ).to.be.false;
  });

  it("reports unsaved changes and asks before leaving", async () => {
    const el = await fixture(
      html`<haxcms-outline-editor-dialog
        in-shell
      ></haxcms-outline-editor-dialog>`,
    );
    await el.updateComplete;
    withOutlineItems(el, [{ id: "a", title: "A" }]);
    expect(el.hasUnsavedChanges).to.be.false;
    expect(el.confirmLeave()).to.be.true;
    expect(confirmCalls.length).to.equal(0);
    withOutlineItems(el, [
      { id: "a", title: "A", modified: true },
      { id: "b", title: "B", new: true },
    ]);
    expect(el.hasUnsavedChanges).to.be.true;
    expect(el.confirmLeave()).to.be.false;
    expect(confirmCalls.length).to.equal(1);
    expect(confirmCalls[0]).to.contain("1 new page will be created");
    expect(confirmCalls[0]).to.contain("1 page will be updated");
    confirmAnswer = true;
    expect(el.confirmLeave()).to.be.true;
  });

  it("leaves the modal close to the shell as the shell's child", async () => {
    const modal = await fixture(html`<simple-modal></simple-modal>`);
    const shell = document.createElement("div");
    modal.appendChild(shell);
    const el = document.createElement("haxcms-outline-editor-dialog");
    el.inShell = true;
    shell.appendChild(el);
    await el.updateComplete;
    withOutlineItems(el, [{ id: "x", title: "X", delete: true }]);
    const evt = new CustomEvent("simple-modal-will-close", {
      cancelable: true,
    });
    Object.defineProperty(evt, "target", { value: modal });
    el._handleSimpleModalWillClose(evt);
    // the shell's leave prompt asks (the section state says it is
    // unsaved), so the outline does not ask as well
    expect(confirmCalls.length).to.equal(0);
    expect(evt.defaultPrevented).to.be.false;
    // the breadcrumb goes through the shell's leave check instead
    const crumb = new CustomEvent("simple-modal-breadcrumb-click", {
      cancelable: true,
      detail: { breadcrumb: { action: "site-settings-dashboard" } },
    });
    Object.defineProperty(crumb, "target", { value: modal });
    el._handleSimpleModalBreadcrumbClick(crumb);
    expect(confirmCalls.length).to.equal(0);
    expect(crumb.defaultPrevented).to.be.false;
  });

  it("still guards the modal close on its own", async () => {
    const modal = await fixture(html`<simple-modal></simple-modal>`);
    const el = document.createElement("haxcms-outline-editor-dialog");
    modal.appendChild(el);
    await el.updateComplete;
    withOutlineItems(el, [{ id: "x", title: "X", delete: true }]);
    const evt = new CustomEvent("simple-modal-will-close", {
      cancelable: true,
    });
    Object.defineProperty(evt, "target", { value: modal });
    el._handleSimpleModalWillClose(evt);
    expect(confirmCalls.length).to.equal(1);
    expect(evt.defaultPrevented).to.be.true;
  });

  it("still owns its modal on its own", async () => {
    const modal = await fixture(html`<simple-modal></simple-modal>`);
    const el = document.createElement("haxcms-outline-editor-dialog");
    modal.appendChild(el);
    await el.updateComplete;
    const evt = new CustomEvent("simple-modal-will-close");
    Object.defineProperty(evt, "target", { value: modal });
    expect(el._ownsSimpleModalEvent(evt)).to.be.true;
    const other = document.createElement("div");
    modal.appendChild(other);
    other.appendChild(el);
    // a non-shell parent inside the modal is not ownership
    expect(el._ownsSimpleModalEvent(evt)).to.be.false;
  });
});

// the section contract: a form section (unsaved outline changes, Save,
// Discard) that also reports its checked pages and Delete selected
describe("haxcms-outline-editor-dialog as a site admin section", () => {
  let confirmCalls;
  let originalConfirm;
  let originalManifest;
  const items = () => [
    { id: "a", title: "A", parent: null, indent: 0, order: 0, metadata: {} },
    { id: "b", title: "B", parent: null, indent: 0, order: 1, metadata: {} },
    { id: "b1", title: "B1", parent: "b", indent: 1, order: 0, metadata: {} },
    { id: "c", title: "C", parent: null, indent: 0, order: 2, metadata: {} },
  ];
  const settle = async (el) => {
    await el.updateComplete;
    const outline = el.shadowRoot.querySelector("#outline");
    await outline.updateComplete;
    await new Promise((r) => setTimeout(r, 60));
    await outline.updateComplete;
  };
  async function section() {
    const el = document.createElement("haxcms-outline-editor-dialog");
    el.inShell = true;
    const states = [];
    el.addEventListener("haxcms-admin-section-state", (e) =>
      states.push(e.detail),
    );
    const host = await fixture(html`<div></div>`);
    host.appendChild(el);
    await settle(el);
    return { el, states, outline: el.shadowRoot.querySelector("#outline") };
  }
  beforeEach(() => {
    confirmCalls = [];
    originalConfirm = globalThis.confirm;
    globalThis.confirm = (msg) => {
      confirmCalls.push(msg);
      return true;
    };
    originalManifest = store.manifest;
    store.manifest = { items: items() };
  });
  afterEach(() => {
    globalThis.confirm = originalConfirm;
    store.manifest = originalManifest;
  });

  it("reports its checked pages and Delete selected", async () => {
    const { states, outline } = await section();
    const last = () => states[states.length - 1];
    expect(last().selected).to.equal(0);
    expect(last().dirty).to.equal(false);
    expect(last().actions).to.deep.equal([
      {
        id: "delete-selected",
        label: "Delete selected",
        icon: "hax:admin-delete",
        danger: true,
      },
    ]);
    outline.togglePageSelection("a");
    outline.togglePageSelection("c");
    await outline.updateComplete;
    expect(last().selected).to.equal(2);
  });

  it("reports unsaved changes as a form section", async () => {
    const { states, outline } = await section();
    const last = () => states[states.length - 1];
    outline.items[0].modified = true;
    outline.items.push({
      id: "n",
      title: "New",
      parent: null,
      indent: 0,
      order: 3,
      new: true,
      metadata: {},
    });
    outline.requestUpdate();
    await outline.updateComplete;
    expect(last().dirty).to.equal(true);
    expect(last().canSave).to.equal(true);
    expect(last().changes).to.deep.equal(["1 new", "1 changed"]);
    expect(last().count).to.equal(2);
  });

  it("runAction delete-selected matches the toolbar delete", async () => {
    const one = await section();
    const two = await section();
    [one, two].forEach(({ outline }) => {
      outline.togglePageSelection("b");
      outline.togglePageSelection("c");
    });
    one.el.runAction("delete-selected");
    await two.outline._deleteSelectedShown();
    await settle(one.el);
    await settle(two.el);
    const a = await one.outline.getData();
    const b = await two.outline.getData();
    expect(JSON.stringify(a.items)).to.equal(JSON.stringify(b.items));
    expect(a.items.filter((i) => i.delete).map((i) => i.id)).to.deep.equal([
      "b",
      "b1",
      "c",
    ]);
  });

  it("save() sends what Save Outline sent, with the same confirm", async () => {
    const one = await section();
    const two = await section();
    [one, two].forEach(({ outline }) => {
      outline.items[0].title = "A renamed";
      outline.items[0].modified = true;
      outline.items[3].delete = true;
    });
    const sent = [];
    const listen = (e) => sent.push(JSON.stringify(e.detail));
    globalThis.addEventListener("haxcms-save-outline", listen);
    try {
      expect(one.el.save()).to.equal(false);
      await new Promise((r) => setTimeout(r, 30));
      await two.el._saveTap();
      await new Promise((r) => setTimeout(r, 30));
    } finally {
      globalThis.removeEventListener("haxcms-save-outline", listen);
    }
    expect(sent.length).to.equal(2);
    expect(sent[0]).to.equal(sent[1]);
    expect(confirmCalls.length).to.equal(2);
    expect(confirmCalls[0]).to.equal(confirmCalls[1]);
    expect(confirmCalls[0]).to.contain("1 page will be updated");
    // once sent, the shell lets the modal close without its prompt
    const last = one.states[one.states.length - 1];
    expect(last.dirty).to.equal(false);
  });

  it("a cancelled confirm sends nothing and keeps the bar as it was", async () => {
    globalThis.confirm = (msg) => {
      confirmCalls.push(msg);
      return false;
    };
    const { el, states, outline } = await section();
    outline.items[1].modified = true;
    outline.requestUpdate();
    await outline.updateComplete;
    let sent = 0;
    const listen = () => sent++;
    globalThis.addEventListener("haxcms-save-outline", listen);
    try {
      el.save();
      await new Promise((r) => setTimeout(r, 30));
    } finally {
      globalThis.removeEventListener("haxcms-save-outline", listen);
    }
    expect(sent).to.equal(0);
    expect(states[states.length - 1].dirty).to.equal(true);
  });

  it("discard() puts the outline back as loaded and sends nothing", async () => {
    const { el, states, outline } = await section();
    outline.items[0].title = "Changed";
    outline.items[0].modified = true;
    outline.items[2].delete = true;
    outline.togglePageSelection("c");
    outline.requestUpdate();
    await outline.updateComplete;
    let sent = 0;
    const listen = () => sent++;
    globalThis.addEventListener("haxcms-save-outline", listen);
    try {
      el.discard();
      await settle(el);
    } finally {
      globalThis.removeEventListener("haxcms-save-outline", listen);
    }
    expect(sent).to.equal(0);
    expect(outline.items.map((i) => i.title)).to.deep.equal([
      "A",
      "B",
      "B1",
      "C",
    ]);
    expect(outline.items.some((i) => i.modified || i.delete)).to.equal(false);
    expect(outline.selectedPages).to.deep.equal([]);
    const last = states[states.length - 1];
    expect(last.dirty).to.equal(false);
    expect(last.selected).to.equal(0);
  });

  it("clearSelection unchecks every page", async () => {
    const { el, states, outline } = await section();
    outline.togglePageSelection("a");
    await outline.updateComplete;
    el.clearSelection();
    await outline.updateComplete;
    expect(outline.selectedPages).to.deep.equal([]);
    expect(states[states.length - 1].selected).to.equal(0);
  });
});
