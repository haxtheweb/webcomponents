import { fixture, expect, html } from "@open-wc/testing";
import "../lib/core/haxcms-outline-editor-dialog.js";

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

  it("reflects in-shell and keeps its Save Outline button", async () => {
    const el = document.createElement("haxcms-outline-editor-dialog");
    el.inShell = true;
    const host = await fixture(html`<div></div>`);
    host.appendChild(el);
    await el.updateComplete;
    expect(el.hasAttribute("in-shell")).to.be.true;
    const save = el.shadowRoot.querySelector("button.hax-modal-btn");
    expect(save.textContent.trim()).to.equal("Save Outline");
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

  it("guards the modal close as the shell's child", async () => {
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
    expect(confirmCalls.length).to.equal(1);
    expect(evt.defaultPrevented).to.be.true;
    // the breadcrumb goes through the shell's leave check instead
    const crumb = new CustomEvent("simple-modal-breadcrumb-click", {
      cancelable: true,
      detail: { breadcrumb: { action: "site-settings-dashboard" } },
    });
    Object.defineProperty(crumb, "target", { value: modal });
    el._handleSimpleModalBreadcrumbClick(crumb);
    expect(confirmCalls.length).to.equal(1);
    expect(crumb.defaultPrevented).to.be.false;
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
