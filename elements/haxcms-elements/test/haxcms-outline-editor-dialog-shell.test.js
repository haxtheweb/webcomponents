import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../lib/core/haxcms-outline-editor-dialog.js";
import { store } from "../lib/core/haxcms-site-store.js";
import { answerAdminDialogs } from "./fixtures/admin-dialog-answers.js";

let restoreDialogs = () => {};

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
    // the outline asks with the HAX UI confirm now; route its answers to
    // the stub each test sets on globalThis.confirm
    restoreDialogs = answerAdminDialogs({
      confirm: (msg) => globalThis.confirm(msg),
    });
    globalThis.confirm = (msg) => {
      confirmCalls.push(msg);
      return confirmAnswer;
    };
  });
  afterEach(() => {
    globalThis.confirm = originalConfirm;
    restoreDialogs();
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
    // no import on Structure; Add page is in the shell's action bar
    const outline = el.shadowRoot.querySelector("#outline");
    await outline.updateComplete;
    const labels = (root) =>
      [...root.querySelectorAll("simple-toolbar-button")].map((b) => b.label);
    expect(labels(el.shadowRoot)).to.not.include("Import from file");
    expect(labels(outline.shadowRoot)).to.not.include("Add page");
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
    const ownOutline = own.shadowRoot.querySelector("#outline");
    await ownOutline.updateComplete;
    expect(labels(own.shadowRoot)).to.not.include("Import from file");
    expect(labels(ownOutline.shadowRoot)).to.include("Add page");
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
    expect(await el.confirmLeave()).to.be.true;
    expect(confirmCalls.length).to.equal(0);
    withOutlineItems(el, [
      { id: "a", title: "A", modified: true },
      { id: "b", title: "B", new: true },
    ]);
    expect(el.hasUnsavedChanges).to.be.true;
    // it answers with a promise: the HAX UI confirm, not the browser's
    const asking = el.confirmLeave();
    expect(typeof asking.then).to.equal("function");
    expect(await asking).to.be.false;
    expect(confirmCalls.length).to.equal(1);
    expect(confirmCalls[0]).to.contain("1 new page will be created");
    expect(confirmCalls[0]).to.contain("1 page will be updated");
    confirmAnswer = true;
    expect(await el.confirmLeave()).to.be.true;
  });

  it("asks once even when leaving is requested twice", async () => {
    const el = await fixture(
      html`<haxcms-outline-editor-dialog
        in-shell
      ></haxcms-outline-editor-dialog>`,
    );
    await el.updateComplete;
    withOutlineItems(el, [{ id: "a", title: "A", modified: true }]);
    confirmAnswer = true;
    const first = el.confirmLeave();
    const second = el.confirmLeave();
    expect(await second).to.be.false;
    expect(await first).to.be.true;
    expect(confirmCalls.length).to.equal(1);
    expect(document.querySelectorAll("haxcms-admin-confirm").length).to.equal(
      0,
    );
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
    let closes = 0;
    modal.close = () => closes++;
    // the close is held while the HAX UI confirm asks
    el._handleSimpleModalWillClose(evt);
    expect(evt.defaultPrevented).to.be.true;
    await waitUntil(() => confirmCalls.length === 1);
    await new Promise((r) => setTimeout(r, 20));
    // Keep editing: the modal stays
    expect(closes).to.equal(0);
    expect(el.__allowNextModalClose).to.not.equal(true);
    // Discard changes: the modal closes, and that close is let through
    // (the outline re-reads its items after a render, so mark them again)
    withOutlineItems(el, [{ id: "x", title: "X", delete: true }]);
    confirmAnswer = true;
    const again = new CustomEvent("simple-modal-will-close", {
      cancelable: true,
    });
    Object.defineProperty(again, "target", { value: modal });
    el._handleSimpleModalWillClose(again);
    await waitUntil(() => closes === 1);
    expect(el.__allowNextModalClose).to.equal(true);
    const replay = new CustomEvent("simple-modal-will-close", {
      cancelable: true,
    });
    Object.defineProperty(replay, "target", { value: modal });
    el._handleSimpleModalWillClose(replay);
    expect(replay.defaultPrevented).to.be.false;
    expect(confirmCalls.length).to.equal(2);
  });

  it("lets a modal close through on its own when nothing changed", async () => {
    const modal = await fixture(html`<simple-modal></simple-modal>`);
    const el = document.createElement("haxcms-outline-editor-dialog");
    modal.appendChild(el);
    await el.updateComplete;
    withOutlineItems(el, [{ id: "x", title: "X" }]);
    const evt = new CustomEvent("simple-modal-will-close", {
      cancelable: true,
    });
    Object.defineProperty(evt, "target", { value: modal });
    el._handleSimpleModalWillClose(evt);
    expect(evt.defaultPrevented).to.be.false;
    expect(confirmCalls.length).to.equal(0);
  });

  it("holds the dashboard breadcrumb on its own and sends it again on a yes", async () => {
    const modal = await fixture(html`<simple-modal></simple-modal>`);
    const el = document.createElement("haxcms-outline-editor-dialog");
    modal.appendChild(el);
    await el.updateComplete;
    withOutlineItems(el, [{ id: "x", title: "X", delete: true }]);
    const seen = [];
    const listen = (e) => seen.push(e.defaultPrevented);
    modal.addEventListener("simple-modal-breadcrumb-click", listen);
    try {
      confirmAnswer = true;
      const crumb = new CustomEvent("simple-modal-breadcrumb-click", {
        cancelable: true,
        detail: { breadcrumb: { action: "site-settings-dashboard" } },
      });
      Object.defineProperty(crumb, "target", { value: modal });
      el._handleSimpleModalBreadcrumbClick(crumb);
      expect(crumb.defaultPrevented).to.be.true;
      // the replayed click reaches the modal's listeners untouched
      await waitUntil(() => seen.length === 1);
      expect(seen).to.deep.equal([false]);
      expect(confirmCalls.length).to.equal(1);
    } finally {
      modal.removeEventListener("simple-modal-breadcrumb-click", listen);
    }
  });

  it("holds a page link from the outline and follows it on a yes", async () => {
    const el = await fixture(
      html`<haxcms-outline-editor-dialog></haxcms-outline-editor-dialog>`,
    );
    await el.updateComplete;
    const outline = withOutlineItems(el, [
      { id: "x", title: "X", slug: "x", modified: true, metadata: {} },
    ]);
    const ops = [];
    outline.itemOp = (index, action) => ops.push([index, action]);
    const ask = new CustomEvent("outline-designer-request-navigate", {
      cancelable: true,
      detail: { href: "x", item: outline.items[0] },
    });
    Object.defineProperty(ask, "target", { value: outline });
    el._outlineNavigateRequested(ask);
    expect(ask.defaultPrevented).to.be.true;
    await waitUntil(() => confirmCalls.length === 1);
    await new Promise((r) => setTimeout(r, 20));
    // Keep editing: no jump
    expect(ops).to.deep.equal([]);
    confirmAnswer = true;
    const again = new CustomEvent("outline-designer-request-navigate", {
      cancelable: true,
      detail: { href: "x", item: outline.items[0] },
    });
    Object.defineProperty(again, "target", { value: outline });
    el._outlineNavigateRequested(again);
    await waitUntil(() => ops.length === 1);
    // outline-designer's own goto runs again, and is let through this time
    expect(ops).to.deep.equal([[0, "goto"]]);
    expect(el.__allowNextNavigate).to.equal(true);
    expect(el.__allowNextModalClose).to.equal(true);
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
    // the outline asks with the HAX UI confirm now; route its answers to
    // the stub each test sets on globalThis.confirm
    restoreDialogs = answerAdminDialogs({
      confirm: (msg) => globalThis.confirm(msg),
    });
    globalThis.confirm = (msg) => {
      confirmCalls.push(msg);
      return true;
    };
    originalManifest = store.manifest;
    store.manifest = { items: items() };
  });
  afterEach(() => {
    globalThis.confirm = originalConfirm;
    restoreDialogs();
    store.manifest = originalManifest;
  });

  it("reports its checked pages, Add page and Delete selected", async () => {
    const { states, outline } = await section();
    const last = () => states[states.length - 1];
    expect(last().selected).to.equal(0);
    expect(last().dirty).to.equal(false);
    expect("addArea" in last()).to.equal(false);
    expect(last().actions).to.deep.equal([
      {
        id: "add-page",
        label: "Add page",
        icon: "hax:admin-add",
        needsSelection: false,
      },
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

  it("runAction add-page matches the toolbar Add page", async () => {
    const one = await section();
    const two = await section();
    one.el.runAction("add-page");
    two.outline._addTop();
    await settle(one.el);
    await settle(two.el);
    const a = await one.outline.getData();
    const b = await two.outline.getData();
    const shape = (data) =>
      data.items.map((i) => ({
        title: i.title,
        parent: i.parent,
        indent: i.indent,
        order: i.order,
        new: !!i.new,
      }));
    expect(shape(a)).to.deep.equal(shape(b));
    expect(a.items.filter((i) => i.new).length).to.equal(1);
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
    // the comparison is the standalone Save Outline button
    two.el.inShell = false;
    [one, two].forEach(({ outline }) => {
      outline.items[0].title = "A renamed";
      outline.items[0].modified = true;
      outline.items[3].delete = true;
    });
    const sent = [];
    const listen = (e) => sent.push(JSON.stringify(e.detail));
    let hides = 0;
    const onHide = () => hides++;
    globalThis.addEventListener("haxcms-save-outline", listen);
    one.el.addEventListener("simple-modal-hide", onHide);
    try {
      const result = one.el.save();
      expect(typeof result.then).to.equal("function");
      expect(await result).to.equal(true);
      await new Promise((r) => setTimeout(r, 30));
      await two.el._saveTap();
      await new Promise((r) => setTimeout(r, 30));
    } finally {
      globalThis.removeEventListener("haxcms-save-outline", listen);
      one.el.removeEventListener("simple-modal-hide", onHide);
    }
    expect(sent.length).to.equal(2);
    expect(sent[0]).to.equal(sent[1]);
    expect(confirmCalls.length).to.equal(2);
    expect(confirmCalls[0]).to.equal(confirmCalls[1]);
    expect(confirmCalls[0]).to.contain("1 page will be updated");
    // in the shell the panel stays open for Saving and Saved, like the
    // others; the standalone editor still lets go of its modal
    expect(hides).to.equal(0);
    expect(!!one.el.__shellReleased).to.equal(false);
    expect(two.el.__allowNextModalClose).to.equal(true);
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
      expect(await el.save()).to.equal(false);
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

describe("Structure in the site admin dialog saves like the other panels", () => {
  let originalConfirm, originalManifest;
  beforeEach(() => {
    originalConfirm = globalThis.confirm;
    // the outline asks with the HAX UI confirm now; route its answers to
    // the stub each test sets on globalThis.confirm
    restoreDialogs = answerAdminDialogs({
      confirm: (msg) => globalThis.confirm(msg),
    });
    globalThis.confirm = () => true;
    originalManifest = store.manifest;
    store.manifest = {
      items: [
        {
          id: "a",
          title: "A",
          parent: null,
          indent: 0,
          order: 0,
          metadata: {},
        },
        {
          id: "b",
          title: "B",
          parent: null,
          indent: 0,
          order: 1,
          metadata: {},
        },
      ],
    };
  });
  afterEach(() => {
    globalThis.confirm = originalConfirm;
    restoreDialogs();
    store.manifest = originalManifest;
  });

  it("stays open, shows Saving, then Saved", async () => {
    await import("../lib/core/admin/haxcms-site-admin.js");
    const shell = await fixture(
      html`<haxcms-site-admin
        style="--simple-modal-height: 720px"
      ></haxcms-site-admin>`,
    );
    shell.allowRoute = () => true;
    shell.route = "structure";
    await waitUntil(() => shell._sectionEl, "outline dialog created");
    const dialog = shell._sectionEl;
    await dialog.updateComplete;
    await waitUntil(
      () => dialog.shadowRoot.querySelector("#outline"),
      "outline rendered",
    );
    const outline = dialog.shadowRoot.querySelector("#outline");
    await outline.updateComplete;
    outline.items[0].title = "A renamed";
    outline.items[0].modified = true;
    outline.requestUpdate();
    await waitUntil(() => shell._canSave, "Save enabled");
    let hides = 0;
    const onHide = () => hides++;
    globalThis.addEventListener("simple-modal-hide", onHide, true);
    // the editor answers the save the way _requestAdminSave does
    // a real request takes a moment; the bar shows Saving meanwhile
    const onSave = () =>
      setTimeout(
        () =>
          globalThis.dispatchEvent(
            new CustomEvent("haxcms-admin-save-result", {
              detail: { operation: "@site/updateSiteOutline", ok: true },
            }),
          ),
        300,
      );
    globalThis.addEventListener("haxcms-save-outline", onSave);
    try {
      shell.shadowRoot.querySelector(".ftr .save").click();
      await waitUntil(() => shell._status === "saving", "Saving shown");
      await waitUntil(() => shell._status === "saved", "Saved shown");
      await shell.updateComplete;
      expect(shell.shadowRoot.querySelector(".ftr .st").textContent).to.contain(
        "saved",
      );
      await new Promise((r) => setTimeout(r, 30));
      expect(hides).to.equal(0);
      expect(shell._sectionEl).to.equal(dialog);
    } finally {
      globalThis.removeEventListener("simple-modal-hide", onHide, true);
      globalThis.removeEventListener("haxcms-save-outline", onSave);
    }
  });

  // a save that changes the active page's slug makes the editor re-sync the
  // route (replaceState + popstate) before the manifest refresh lands; the
  // leave check that runs then must not ask to discard what was just saved
  async function openStructure() {
    await import("../lib/core/admin/haxcms-site-admin.js");
    const shell = await fixture(
      html`<haxcms-site-admin
        style="--simple-modal-height: 720px"
      ></haxcms-site-admin>`,
    );
    shell.allowRoute = () => true;
    shell.route = "structure";
    await waitUntil(() => shell._sectionEl, "outline dialog created");
    const dialog = shell._sectionEl;
    await dialog.updateComplete;
    await waitUntil(
      () => dialog.shadowRoot.querySelector("#outline"),
      "outline rendered",
    );
    const outline = dialog.shadowRoot.querySelector("#outline");
    await outline.updateComplete;
    return { shell, dialog, outline };
  }

  async function saveWith(shell, ok) {
    const onSave = () =>
      setTimeout(
        () =>
          globalThis.dispatchEvent(
            new CustomEvent("haxcms-admin-save-result", {
              detail: { operation: "@site/updateSiteOutline", ok: ok },
            }),
          ),
        50,
      );
    globalThis.addEventListener("haxcms-save-outline", onSave);
    try {
      shell.shadowRoot.querySelector(".ftr .save").click();
      await waitUntil(
        () => shell._status === (ok ? "saved" : "error"),
        ok ? "Saved shown" : "save failure shown",
      );
    } finally {
      globalThis.removeEventListener("haxcms-save-outline", onSave);
    }
  }

  it("does not ask to discard a saved outline before the manifest refreshes", async () => {
    const { shell, dialog, outline } = await openStructure();
    outline.items[0].title = "A renamed";
    outline.items[0].modified = true;
    outline.requestUpdate();
    await waitUntil(() => shell._canSave, "Save enabled");
    await saveWith(shell, true);
    // the items still carry their change flags: no manifest refresh yet
    expect(outline.items[0].modified).to.be.true;
    let asked = 0;
    globalThis.confirm = () => {
      asked++;
      return false;
    };
    expect(dialog.hasUnsavedChanges).to.be.false;
    expect(await dialog.confirmLeave()).to.be.true;
    let left = false;
    shell.requestLeave(() => {
      left = true;
    });
    await new Promise((r) => setTimeout(r, 30));
    expect(left).to.be.true;
    expect(shell._leave).to.equal(null);
    expect(asked).to.equal(0);
    await outline.updateComplete;
    await new Promise((r) => setTimeout(r, 30));
    expect(shell._status).to.equal("saved");
  });

  it("still treats an edit made after a successful save as unsaved", async () => {
    const { shell, dialog, outline } = await openStructure();
    outline.items[0].title = "A renamed";
    outline.items[0].modified = true;
    outline.requestUpdate();
    await waitUntil(() => shell._canSave, "Save enabled");
    await saveWith(shell, true);
    outline.items[1].title = "B renamed";
    outline.items[1].modified = true;
    outline.requestUpdate();
    await waitUntil(() => shell._status === "dirty", "new edit shown");
    expect(dialog.hasUnsavedChanges).to.be.true;
    let asked = 0;
    globalThis.confirm = () => {
      asked++;
      return false;
    };
    expect(await dialog.confirmLeave()).to.be.false;
    expect(asked).to.equal(1);
  });

  it("keeps the changes unsaved and the error shown when the save fails", async () => {
    const { shell, dialog, outline } = await openStructure();
    outline.items[0].title = "A renamed";
    outline.items[0].modified = true;
    outline.requestUpdate();
    await waitUntil(() => shell._canSave, "Save enabled");
    await saveWith(shell, false);
    await outline.updateComplete;
    await new Promise((r) => setTimeout(r, 30));
    expect(shell._status).to.equal("error");
    expect(dialog.hasUnsavedChanges).to.be.true;
    let left = false;
    shell.requestLeave(() => {
      left = true;
    });
    await new Promise((r) => setTimeout(r, 30));
    expect(left).to.be.false;
    expect(shell._leave).to.not.equal(null);
  });

  it("hands back to the manifest once its refresh lands", async () => {
    const { shell, dialog, outline } = await openStructure();
    outline.items[0].title = "A renamed";
    outline.items[0].modified = true;
    outline.requestUpdate();
    await waitUntil(() => shell._canSave, "Save enabled");
    await saveWith(shell, true);
    expect(dialog.__savedItemsKey).to.not.equal(null);
    store.manifest = {
      items: [
        {
          id: "a",
          title: "A renamed",
          parent: null,
          indent: 0,
          order: 0,
          metadata: {},
        },
        store.manifest.items[1],
      ],
    };
    await waitUntil(
      () => dialog.__savedItemsKey === null,
      "saved state dropped after the manifest refresh",
    );
    await waitUntil(
      () => outline.items.length && !outline.items[0].modified,
      "outline reloaded from the manifest",
    );
    expect(dialog.hasUnsavedChanges).to.be.false;
  });
});
