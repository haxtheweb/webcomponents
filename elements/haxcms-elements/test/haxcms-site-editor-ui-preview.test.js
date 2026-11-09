// Preview in the editor bar (haxtheweb/issues#2951): the button, Ctrl⇧8,
// the flag state, the device choice and the preview-only dark mode.
import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";
import { store } from "../lib/core/haxcms-site-store.js";
import { HAXCMSKeyboardShortcutsInstance } from "../lib/core/utils/HAXCMSKeyboardShortcuts.js";

describe("haxcms-site-editor-ui preview", () => {
  let element;
  let saved;

  beforeEach(async () => {
    saved = {
      jwt: store.jwt,
      appSettings: store.appSettings,
      darkMode: store.darkMode,
      previewMode: store.previewMode,
    };
    store.jwt = "preview-test-jwt";
    store.appSettings = {};
    store.darkMode = false;
    element = await fixture(
      html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`,
    );
    await aTimeout(0);
    await element.updateComplete;
  });

  afterEach(async () => {
    if (element && element.previewMode) {
      element.exitPreview();
    }
    store.previewMode = saved.previewMode;
    store.jwt = saved.jwt;
    store.appSettings = saved.appSettings;
    store.darkMode = saved.darkMode;
    const modal =
      globalThis.SimpleModal && globalThis.SimpleModal.requestAvailability
        ? globalThis.SimpleModal.requestAvailability()
        : null;
    if (modal) {
      modal.opened = false;
    }
  });

  const button = () => element.shadowRoot.querySelector("#previewbutton");

  it("shows Preview with its shortcut just before the HAX mark", () => {
    const btn = button();
    expect(btn).to.exist;
    expect(btn.getAttribute("label")).to.equal("Preview • Ctrl⇧8");
    expect(btn.getAttribute("icon")).to.equal("icons:visibility");
    const group = element.shadowRoot.querySelector(".topbar-right-group");
    const controls = group.querySelector(".preview-toolbar-buttons");
    const mark = group.querySelector(".home-btn");
    expect(controls.nextElementSibling).to.equal(mark);
  });

  it("registers Ctrl⇧8", () => {
    const shortcuts = HAXCMSKeyboardShortcutsInstance.getShortcuts();
    const list = Array.isArray(shortcuts)
      ? shortcuts
      : Object.values(shortcuts || {});
    const found = list.find(
      (s) => s && String(s.key) === "8" && s.ctrl && s.shift,
    );
    expect(found).to.exist;
  });

  it("enterPreview turns preview on without logging out", async () => {
    expect(await element.enterPreview()).to.equal(true);
    await element.updateComplete;
    expect(store.previewMode).to.equal(true);
    expect(store.isLoggedIn).to.equal(true);
    expect(element.hasAttribute("preview-mode")).to.equal(true);
    expect(button().getAttribute("label")).to.equal("Exit preview • Ctrl⇧8");
    expect(button().hasAttribute("active")).to.equal(true);
    expect(element.shadowRoot.querySelector("#previewdevicebutton")).to.exist;
  });

  it("exitPreview turns it off again", async () => {
    await element.enterPreview();
    expect(element.exitPreview()).to.equal(true);
    await element.updateComplete;
    expect(store.previewMode).to.equal(false);
    expect(element.hasAttribute("preview-mode")).to.equal(false);
    expect(element.shadowRoot.querySelector("#previewdevicebutton")).to.equal(
      null,
    );
  });

  it("Esc and Ctrl⇧8 exit preview", async () => {
    await element.enterPreview();
    globalThis.document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "8",
        code: "Digit8",
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      }),
    );
    expect(store.previewMode).to.equal(false);
    // the shortcut manager is back on and did not reopen preview
    await aTimeout(10);
    expect(store.previewMode).to.equal(false);
    await element.enterPreview();
    globalThis.document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(store.previewMode).to.equal(false);
  });

  it("_isPreviewShortcut only matches Ctrl or Cmd, Shift and 8", () => {
    expect(
      element._isPreviewShortcut({
        ctrlKey: true,
        shiftKey: true,
        code: "Digit8",
      }),
    ).to.equal(true);
    expect(
      element._isPreviewShortcut({
        metaKey: true,
        shiftKey: true,
        code: "Numpad8",
      }),
    ).to.equal(true);
    expect(
      element._isPreviewShortcut({ ctrlKey: true, code: "Digit8" }),
    ).to.equal(false);
    expect(
      element._isPreviewShortcut({
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        code: "Digit8",
      }),
    ).to.equal(false);
  });

  it("waits while a dialog is open", async () => {
    const modal = globalThis.SimpleModal.requestAvailability();
    modal.opened = true;
    expect(await element.enterPreview()).to.equal(false);
    expect(store.previewMode).to.equal(false);
  });

  it("uses a frame for devices, not for this window", async () => {
    await element.enterPreview();
    expect(element._previewFramed()).to.equal(false);
    element.previewDevice = "phone";
    expect(element._previewFramed()).to.equal(true);
  });

  it("a framed preview leaves the page's own store alone", async () => {
    const pick = (id) =>
      element._previewDeviceTap({
        currentTarget: { getAttribute: () => id },
      });
    await element.enterPreview();
    expect(store.previewMode).to.equal(true);
    pick("phone");
    expect(element.previewMode).to.equal(true);
    expect(store.previewMode).to.equal(false);
    expect(store.previewKeepId).to.equal(null);
    pick("window");
    expect(store.previewMode).to.equal(true);
  });

  it("a device view has a close button that goes back to this window", async () => {
    await element.enterPreview();
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("#previewstageclose")).to.equal(
      null,
    );
    element._setPreviewDevice("phone");
    await element.updateComplete;
    const close = element.shadowRoot.querySelector("#previewstageclose");
    expect(close).to.exist;
    expect(close.getAttribute("aria-label")).to.equal("Close Phone view");
    close.click();
    await element.updateComplete;
    expect(element.previewDevice).to.equal("window");
    expect(element.previewMode).to.equal(true);
    expect(store.previewMode).to.equal(true);
  });

  it("Esc steps back: menu, then device, then preview", async () => {
    const esc = () =>
      globalThis.document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    await element.enterPreview();
    element._setPreviewDevice("tablet");
    element.previewMenuOpen = true;
    esc();
    expect(element.previewMenuOpen).to.equal(false);
    expect(element.previewDevice).to.equal("tablet");
    esc();
    expect(element.previewDevice).to.equal("window");
    expect(element.previewMode).to.equal(true);
    esc();
    expect(element.previewMode).to.equal(false);
  });

  it("can't be entered twice at once", async () => {
    const results = await Promise.all([
      element.enterPreview(),
      element.enterPreview(),
    ]);
    expect(results.filter((r) => r === true).length).to.equal(1);
  });

  it("removing the bar never leaves the site in preview", async () => {
    await element.enterPreview();
    expect(store.previewMode).to.equal(true);
    element.remove();
    expect(store.previewMode).to.equal(false);
    expect(store.previewKeepId).to.equal(null);
    element = null;
  });

  it("sideways only applies to tablet and phone", async () => {
    await element.enterPreview();
    element.previewDevice = "desktop";
    element._setPreviewSideways(true);
    expect(element.previewSideways).to.equal(false);
    element.previewDevice = "tablet";
    element._setPreviewSideways(true);
    expect(element.previewSideways).to.equal(true);
  });

  it("dark mode is for the preview only and comes back on exit", async () => {
    store.darkMode = false;
    await element.enterPreview();
    element._togglePreviewDark();
    expect(element.previewDark).to.equal(true);
    expect(store.darkMode).to.equal(true);
    element.exitPreview();
    expect(store.darkMode).to.equal(false);
  });

  it("other editor shortcuts are off while previewing", async () => {
    await element.enterPreview();
    expect(HAXCMSKeyboardShortcutsInstance.enabled).to.equal(false);
    element.exitPreview();
    await aTimeout(10);
    expect(HAXCMSKeyboardShortcutsInstance.enabled).to.equal(true);
  });
});
