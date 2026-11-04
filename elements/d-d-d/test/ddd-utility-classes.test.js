import { fixture, expect, html } from "@open-wc/testing";
import "../d-d-d.js";
import { DDDAllStyles, DDDReset, DDDBreadcrumb } from "../lib/DDDStyles.js";
import * as DDDStylesModule from "../lib/DDDStyles.js";
import {
  DDDUtilityClasses,
  DDDLetterSpacing,
  DDDBoxShadow,
  DDDBorderRadius,
  DDDBackground,
  DDDFontWeight,
  DDDFontClasses,
  DDDHeaderBorderClasses,
} from "../lib/DDDUtilityClasses.js";

// Utility classes are opt-in: they are not stamped on the page by the
// design system sheet and are not in every DDDSuper shadow root.
describe("DDDUtilityClasses", () => {
  const all = () => DDDAllStyles.map((s) => s.cssText).join("");

  it("exports every utility family in one array", () => {
    expect(DDDUtilityClasses).to.deep.equal([
      DDDLetterSpacing,
      DDDBoxShadow,
      DDDBorderRadius,
      DDDBackground,
      DDDFontWeight,
      DDDFontClasses,
      DDDHeaderBorderClasses,
    ]);
    DDDUtilityClasses.forEach((sheet) => {
      expect(sheet.cssText).to.be.a("string").and.not.equal("");
    });
  });

  it("is not loaded by DDDStyles.js", () => {
    [
      "DDDLetterSpacing",
      "DDDBoxShadow",
      "DDDBorderRadius",
      "DDDBackground",
      "DDDFontWeight",
      "DDDFontClasses",
    ].forEach((name) => {
      expect(DDDStylesModule[name]).to.be.undefined;
    });
  });

  it("is not part of the page-level sheet (DDDAllStyles)", () => {
    DDDUtilityClasses.forEach((sheet) => {
      expect(DDDAllStyles).to.not.include(sheet);
    });
    expect(DDDAllStyles).to.not.include(DDDBreadcrumb);
    [".ls-16-sm", ".bs-lg", ".r-circle", ".bg-gradient-hero", ".fw-3"].forEach(
      (selector) => {
        expect(all()).to.not.include(`${selector} {`);
      },
    );
    expect(all()).to.not.include(".ddd-font-navigation {");
    expect(all()).to.not.include(".breadcrumb {");
  });

  it("moves the header border modifiers out of DDDReset", () => {
    expect(DDDReset.cssText).to.not.include(
      ".ddd-theme-header-border-thickness-0",
    );
    expect(DDDHeaderBorderClasses.cssText).to.include(
      ".ddd-theme-header-border-thickness-0",
    );
    expect(DDDHeaderBorderClasses.cssText).to.include(
      ".ddd-theme-header-border-treatment-full",
    );
    // the reset still reads the variables the modifiers set
    expect(DDDReset.cssText).to.include("--ddd-theme-header-border-thickness");
  });

  it("does not style light DOM content by default", async () => {
    const el = await fixture(html`<span class="fw-3">text</span>`);
    expect(getComputedStyle(el).fontWeight).to.not.equal("900");
  });

  it("applies when an element opts in", async () => {
    // set the token on the host so the test only depends on the class
    const host = await fixture(
      html`<div style="--ddd-font-weight-black: 900"></div>`,
    );
    const shadow = host.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = DDDUtilityClasses.map((s) => s.styleSheet);
    shadow.innerHTML = `<span class="fw-3">text</span>`;
    const el = shadow.querySelector("span");
    expect(getComputedStyle(el).fontWeight).to.equal("900");
  });
});

describe("d-d-d.js entry point", () => {
  it("does not define d-d-d-sample (lib/d-d-d-sample.js does)", () => {
    expect(globalThis.customElements.get("d-d-d-sample")).to.be.undefined;
  });

  it("defines d-d-d-sample once lib/d-d-d-sample.js is imported", async () => {
    await import("../lib/d-d-d-sample.js");
    expect(globalThis.customElements.get("d-d-d-sample")).to.exist;
  });
});
