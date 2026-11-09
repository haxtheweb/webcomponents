import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { KeyboardShortcutManagerInstance } from "@haxtheweb/utils/utils.js";
import "../lib/core/micros/haxcms-page-operations.js";

// the pencil menu shows the global shortcut Merlin lists for an action
describe("haxcms-page-operations shortcuts", () => {
  let realAllows;
  before(() => {
    realAllows = store.platformAllows;
    store.platformAllows = () => true;
    if (!KeyboardShortcutManagerInstance.getById("cms-add-page")) {
      KeyboardShortcutManagerInstance.register({
        id: "cms-add-page",
        key: "3",
        ctrl: true,
        shift: true,
        callback: () => {},
        description: "Add page",
      });
    }
  });
  after(() => {
    store.platformAllows = realAllows;
  });

  it("shows Merlin's label for Add page", async () => {
    const el = await fixture(
      html`<haxcms-page-operations></haxcms-page-operations>`,
    );
    await el.updateComplete;
    const addPage = el.shadowRoot.querySelector("haxcms-button-add");
    const descriptor = KeyboardShortcutManagerInstance.getById("cms-add-page");
    expect(addPage.getAttribute("shortcut-label")).to.equal(
      KeyboardShortcutManagerInstance.getLabel(descriptor),
    );
    expect(addPage.getAttribute("key-shortcuts")).to.equal("Control+Shift+3");
  });

  it("Site outline has no shortcut: it lives under Site settings", async () => {
    const el = await fixture(
      html`<haxcms-page-operations></haxcms-page-operations>`,
    );
    await el.updateComplete;
    const outline = [
      ...el.shadowRoot.querySelectorAll("simple-toolbar-button"),
    ].find((b) => b.label === el.t.siteOutline);
    expect(!!outline.getAttribute("shortcut-label")).to.equal(false);
  });

  it("shows nothing for an action with no registered shortcut", async () => {
    const el = await fixture(
      html`<haxcms-page-operations></haxcms-page-operations>`,
    );
    await el.updateComplete;
    expect(el._shortcut("not-a-shortcut")).to.deep.equal({
      label: "",
      aria: "",
    });
    const moveUp = [
      ...el.shadowRoot.querySelectorAll("simple-toolbar-button"),
    ].find((b) => b.label === el.t.moveUp);
    expect(!!moveUp.getAttribute("shortcut-label")).to.equal(false);
  });
});
