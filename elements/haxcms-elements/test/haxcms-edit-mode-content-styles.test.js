import { expect } from "@open-wc/testing";
import {
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
    ).to.equal("hax-body > :is(p, ul), body.dark-mode hax-body > p");
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
});
