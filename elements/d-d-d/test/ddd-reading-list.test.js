import { fixture, expect, html } from "@open-wc/testing";
import {
  DDDAllStyles,
  DDDReadingList,
  DDDReadingListStyles,
  DDDReset,
} from "../lib/DDDStyles.js";
import { DDDSuper } from "../d-d-d.js";
import { LitElement } from "lit";

// Reading list treatments style authored ul / ol in the page (light DOM).
// They ship in the page-level sheet (DDDAllStyles, which the
// DesignSystemManager adopts on the document), not in per-element DDDReset.
function adopt() {
  const sheets = DDDAllStyles.map((item) => item.styleSheet);
  const existing = globalThis.document.adoptedStyleSheets;
  if (!existing.includes(sheets[sheets.length - 1])) {
    globalThis.document.adoptedStyleSheets = [...existing, ...sheets];
  }
}

function before(el) {
  return globalThis.getComputedStyle(el, "::before");
}

describe("DDD reading list treatments", () => {
  beforeEach(() => adopt());

  it("required ol is framed with filled numbered circles", async () => {
    const el = await fixture(html`
      <ol data-design-treatment="reading-required">
        <li><a href="a.pdf">A</a></li>
        <li><a href="b">B</a></li>
      </ol>
    `);
    const style = globalThis.getComputedStyle(el);
    expect(style.listStyleType).to.equal("none");
    expect(style.borderTopStyle).to.equal("solid");
    const marker = before(el.querySelector("li"));
    expect(marker.content).to.not.equal("none");
    expect(marker.backgroundColor).to.not.equal("rgba(0, 0, 0, 0)");
    const pdf = globalThis.getComputedStyle(el.querySelector("a"), "::after");
    expect(pdf.content).to.equal('"PDF"');
    const page = globalThis.getComputedStyle(
      el.querySelectorAll("a")[1],
      "::after",
    );
    expect(page.content).to.equal("none");
  });

  it("optional differs from required by line and marker style, not colour", async () => {
    const el = await fixture(html`
      <ul data-design-treatment="reading-optional">
        <li>A</li>
      </ul>
    `);
    const style = globalThis.getComputedStyle(el);
    expect(style.listStyleType).to.equal("none");
    expect(style.borderTopStyle).to.equal("dashed");
    const marker = before(el.querySelector("li"));
    expect(marker.backgroundColor).to.equal("rgba(0, 0, 0, 0)");
    expect(marker.borderTopStyle).to.equal("solid");
    expect(parseFloat(marker.borderTopWidth)).to.be.greaterThan(1);
  });

  it("the heading-driven reading list keeps working", async () => {
    const el = await fixture(html`
      <div>
        <h3 data-instructional-action="read">Read</h3>
        <ol>
          <li>A</li>
        </ol>
      </div>
    `);
    const ol = el.querySelector("ol");
    const style = globalThis.getComputedStyle(ol);
    expect(style.listStyleType).to.equal("none");
    expect(style.borderTopStyle).to.equal("solid");
    expect(before(ol.querySelector("li")).content).to.not.equal("none");
  });

  it("a heading with Read followed by an optional list uses the optional look", async () => {
    const el = await fixture(html`
      <div>
        <h3 data-instructional-action="read">Optional reading</h3>
        <ol data-design-treatment="reading-optional">
          <li>A</li>
        </ol>
      </div>
    `);
    const ol = el.querySelector("ol");
    expect(globalThis.getComputedStyle(ol).borderTopStyle).to.equal("dashed");
    expect(before(ol.querySelector("li")).backgroundColor).to.equal(
      "rgba(0, 0, 0, 0)",
    );
  });

  it("existing list-style treatments are unaffected", async () => {
    const el = await fixture(html`
      <ol data-design-treatment="list-lower-alpha">
        <li>A</li>
      </ol>
    `);
    const style = globalThis.getComputedStyle(el);
    expect(style.listStyleType).to.equal("lower-alpha");
    expect(style.borderTopStyle).to.equal("none");
  });
});

const READING_SELECTORS = [
  '[data-instructional-action="read"] + ol',
  'ol[data-design-treatment="reading-required"]',
  'ul[data-design-treatment="reading-optional"]',
  'ol[data-design-treatment^="reading-"]',
];

describe("DDD reading list placement", () => {
  it("DDDReset (every DDDSuper shadow root) no longer carries the reading list rules", () => {
    READING_SELECTORS.forEach((sel) => {
      expect(DDDReset.cssText).to.not.include(sel);
      expect(DDDReadingList.cssText).to.include(sel);
    });
    expect(DDDReset.cssText).to.not.include("ddd-reading");
    // the rest of the reset is still there
    expect(DDDReset.cssText).to.include(".sr-only");
    expect(DDDReset.cssText).to.include("embedded media never pushes");
  });

  it("the page-level sheet carries them, in their original place in the reset", () => {
    expect(DDDAllStyles).to.include(DDDReadingList);
    const all = DDDAllStyles.map((s) => s.cssText).join("");
    READING_SELECTORS.forEach((sel) => {
      expect(all).to.include(sel);
    });
    const reading = all.indexOf("Reading list: a framed list");
    expect(reading).to.be.greaterThan(all.indexOf(".link-list li::after"));
    expect(reading).to.be.lessThan(all.indexOf("embedded media never pushes"));
  });

  it("a DDDSuper shadow root does not get the reading list rules", async () => {
    class DDDReadingProbe extends DDDSuper(LitElement) {
      render() {
        return html`<ol data-design-treatment="reading-required">
          <li>A</li>
        </ol>`;
      }
    }
    globalThis.customElements.define("ddd-reading-probe", DDDReadingProbe);
    const el = await fixture(html`<ddd-reading-probe></ddd-reading-probe>`);
    const text = el.shadowRoot.adoptedStyleSheets
      .map((sheet) =>
        Array.from(sheet.cssRules)
          .map((r) => r.cssText)
          .join(""),
      )
      .join("");
    expect(text).to.include(".sr-only");
    expect(text).to.not.include("reading-required");
    const ol = el.shadowRoot.querySelector("ol");
    expect(globalThis.getComputedStyle(ol).borderTopStyle).to.equal("none");
  });

  it("DDDReadingListStyles opts a shadow root back in with the page cascade order", async () => {
    class DDDReadingOptIn extends DDDSuper(LitElement) {
      static get styles() {
        return [super.styles, DDDReadingListStyles];
      }
      render() {
        return html`<h3 data-instructional-action="read">Read</h3>
          <ol type="1">
            <li>A</li>
          </ol>
          <ol data-design-treatment="reading-required">
            <li>B</li>
          </ol>`;
      }
    }
    globalThis.customElements.define("ddd-reading-opt-in", DDDReadingOptIn);
    const el = await fixture(html`<ddd-reading-opt-in></ddd-reading-opt-in>`);
    const [afterHeading, required] = el.shadowRoot.querySelectorAll("ol");
    expect(globalThis.getComputedStyle(required).borderTopStyle).to.equal(
      "solid",
    );
    expect(before(required.querySelector("li")).content).to.not.equal("none");
    // same as the page: the later reset rule for ol[type="1"] still wins
    // over the reading list list-style, exactly as it did inside DDDReset
    const page = await fixture(
      html`<div>
        <h3 data-instructional-action="read">Read</h3>
        <ol type="1">
          <li>A</li>
        </ol>
      </div>`,
    );
    expect(globalThis.getComputedStyle(afterHeading).listStyleType).to.equal(
      globalThis.getComputedStyle(page.querySelector("ol")).listStyleType,
    );
    expect(globalThis.getComputedStyle(afterHeading).borderTopStyle).to.equal(
      "solid",
    );
  });
});
