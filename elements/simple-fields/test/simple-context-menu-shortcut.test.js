import { fixture, expect, html } from "@open-wc/testing";
import { contextMenuShortcut } from "../lib/simple-context-menu.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { KeyboardShortcutManager } from "@haxtheweb/utils/lib/keyboardShortcuts.js";

describe("contextMenuShortcut: one way to write menu shortcuts", () => {
  it("writes modifiers as Merlin does, with arrow and Enter symbols", () => {
    expect(contextMenuShortcut({ key: "ArrowUp", alt: true })).to.deep.equal({
      label: "Alt↑",
      aria: "Alt+ArrowUp",
    });
    expect(
      contextMenuShortcut({ key: "Enter", ctrl: true, shift: true }),
    ).to.deep.equal({ label: "Ctrl⇧↵", aria: "Control+Shift+Enter" });
    expect(contextMenuShortcut({ key: "d", ctrl: true })).to.deep.equal({
      label: "CtrlD",
      aria: "Control+D",
    });
    expect(contextMenuShortcut({ key: "Delete" })).to.deep.equal({
      label: "Del",
      aria: "Delete",
    });
    expect(contextMenuShortcut({ key: "F2" }).label).to.equal("F2");
  });

  it("matches Merlin's label for a registered global shortcut", () => {
    const d = { key: "3", ctrl: true, shift: true };
    expect(contextMenuShortcut(d).label).to.equal(
      KeyboardShortcutManager.generateLabel(d),
    );
  });

  it("is empty with no shortcut", () => {
    expect(contextMenuShortcut(null)).to.deep.equal({ label: "", aria: "" });
    expect(contextMenuShortcut({})).to.deep.equal({ label: "", aria: "" });
  });
});

describe("simple-toolbar-button shortcut chip", () => {
  it("draws the label as a key chip and announces it on the button", async () => {
    const el = await fixture(
      html`<simple-toolbar-button
        label="Move up"
        icon="arrow-upward"
        show-text-label
        shortcut-label="Alt↑"
        key-shortcuts="Alt+ArrowUp"
      ></simple-toolbar-button>`,
    );
    await el.updateComplete;
    const chip = el.shadowRoot.querySelector("kbd#shortcut");
    expect(chip.textContent.trim()).to.equal("Alt↑");
    expect(chip.getAttribute("aria-hidden")).to.equal("true");
    expect(
      el.shadowRoot.querySelector("#button").getAttribute("aria-keyshortcuts"),
    ).to.equal("Alt+ArrowUp");
  });

  it("draws nothing without a shortcut, or when the label is hidden", async () => {
    const plain = await fixture(
      html`<simple-toolbar-button
        label="Move up"
        show-text-label
      ></simple-toolbar-button>`,
    );
    expect(plain.shadowRoot.querySelector("kbd#shortcut")).to.equal(null);
    expect(
      plain.shadowRoot
        .querySelector("#button")
        .hasAttribute("aria-keyshortcuts"),
    ).to.equal(false);
    const iconOnly = await fixture(
      html`<simple-toolbar-button
        label="Move up"
        icon="arrow-upward"
        shortcut-label="Alt↑"
      ></simple-toolbar-button>`,
    );
    expect(iconOnly.shadowRoot.querySelector("kbd#shortcut")).to.equal(null);
  });

  it("sits at the end of a menu row", async () => {
    const menu = await fixture(
      html`<simple-context-menu title="Page">
        <simple-toolbar-button
          label="Move up"
          icon="arrow-upward"
          show-text-label
          shortcut-label="Alt↑"
        ></simple-toolbar-button>
      </simple-context-menu>`,
    );
    menu.openMenu(null);
    await menu.updateComplete;
    const item = menu.querySelector("simple-toolbar-button");
    await item.updateComplete;
    const chip = item.shadowRoot.querySelector("kbd#shortcut");
    const row = item.getBoundingClientRect();
    const r = chip.getBoundingClientRect();
    expect(row.right - r.right).to.be.below(24);
    menu.close();
  });
});
