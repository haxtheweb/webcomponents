import { expect } from "@open-wc/testing";
import {
  mirrorShadowSelector,
  themeHostCondition,
  syncThemeAttributes,
  editModeSelector,
  editModeSelectorPart,
  getEditModeContentSheet,
  syncEditModeContentStyles,
} from "../lib/core/utils/HAXCMSEditModeContentStyles.js";
import { css } from "lit";

describe("HAXCMSEditModeContentStyles", () => {
  it("swaps the theme tag for hax-body where it is a type selector", () => {
    expect(editModeSelector("clean-one > p", "clean-one")).to.equal(
      "hax-body > p",
    );
    expect(
      editModeSelector(
        "clean-one > :is(p, ul), body.dark-mode clean-one > p",
        "clean-one",
      ),
    ).to.equal(
      'hax-body > :is(p, ul), :host([data-page-classes~="dark-mode"]) hax-body > p',
    );
    expect(editModeSelector(":is(clean-one) h2", "clean-one")).to.equal(
      ":is(hax-body) h2",
    );
  });

  it("leaves longer names and classes that contain the tag alone", () => {
    expect(editModeSelector("clean-one-card > p", "clean-one")).to.equal(
      "clean-one-card > p",
    );
    expect(editModeSelector(".x-clean-one p", "clean-one")).to.equal(
      ".x-clean-one p",
    );
  });

  it("drops :host selectors and refuses unsafe tags", () => {
    expect(editModeSelector(":host, html, body", "clean-one")).to.equal(
      "html, body",
    );
    expect(editModeSelectorPart("p", "not a tag")).to.equal("");
  });

  it("keeps one flagged sheet among the document's adopted sheets", () => {
    const sheet = getEditModeContentSheet();
    expect(sheet.hax).to.equal(true);
    expect(document.adoptedStyleSheets).to.include(sheet);
    expect(getEditModeContentSheet()).to.equal(sheet);
  });

  it("fills the sheet from a theme's global content styles", () => {
    const sheet = syncEditModeContentStyles(
      [
        css`
          clean-one > p {
            max-width: 640px;
          }
          :host {
            color: red;
          }
          clean-one > h2 {
            background: url("/clean-one/bg.png");
          }
        `,
      ],
      "clean-one",
    );
    const selectors = Array.from(sheet.cssRules).map((r) => r.selectorText);
    expect(selectors).to.deep.equal(["hax-body > p", "hax-body > h2"]);
    // urls are not selectors and stay as written
    expect(sheet.cssRules[1].cssText).to.include("/clean-one/bg.png");
    // the next theme replaces what the last one drew
    syncEditModeContentStyles([css``], "clean-two");
    expect(sheet.cssRules.length).to.equal(0);
  });

  it("keys theme state rules to the data-theme copies of its attributes", () => {
    expect(
      mirrorShadowSelector(':host([responsive-size="xs"]) #slot').selector,
    ).to.equal(':host([in-place][data-theme-responsive-size="xs"]) hax-body');
    expect(
      mirrorShadowSelector(":host([menu-open]) #slot ::slotted(p)").selector,
    ).to.equal(":host([data-theme-menu-open]) hax-body > :is(p)");
    expect(themeHostCondition(":not([edit-mode])")).to.equal(
      ":not([data-theme-edit-mode])",
    );
    // a condition on anything but attributes can't be carried over
    expect(mirrorShadowSelector(":host(.wide) #slot")).to.equal(null);
    expect(mirrorShadowSelector(":host(:hover) ::slotted(p)")).to.equal(null);
  });

  it("copies the theme's attributes onto the editor, never edit-mode", () => {
    const theme = document.createElement("div");
    const editor = document.createElement("div");
    theme.setAttribute("menu-open", "");
    theme.setAttribute("responsive-size", "xs");
    theme.setAttribute("edit-mode", "");
    editor.setAttribute("data-theme-gone", "");
    syncThemeAttributes(theme, editor);
    expect(editor.getAttribute("data-theme-responsive-size")).to.equal("xs");
    expect(editor.hasAttribute("data-theme-menu-open")).to.equal(true);
    expect(editor.hasAttribute("data-theme-edit-mode")).to.equal(false);
    expect(editor.hasAttribute("data-theme-gone")).to.equal(false);
    theme.removeAttribute("menu-open");
    syncThemeAttributes(theme, editor);
    expect(editor.hasAttribute("data-theme-menu-open")).to.equal(false);
  });

  it("keys conditions on the theme element's attributes to their copies", () => {
    expect(
      editModeSelector(
        'clean-one:not([data-palette="5"]) a:any-link',
        "clean-one",
      ),
    ).to.equal(
      ':host(:not([data-theme-data-palette="5"])) hax-body a:any-link',
    );
    expect(
      editModeSelector("body.dark-mode clean-one[menu-open] > p", "clean-one"),
    ).to.equal(
      ':host([data-page-classes~="dark-mode"][data-theme-menu-open]) hax-body > p',
    );
    expect(editModeSelector("body clean-one > p", "clean-one")).to.equal(
      "hax-body > p",
    );
  });
});
