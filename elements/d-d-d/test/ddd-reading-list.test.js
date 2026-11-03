import { fixture, expect, html } from "@open-wc/testing";
import { DDDReset, DDDVariables } from "../lib/DDDStyles.js";

// Reading list treatments are global DDD styles on plain ul / ol markup.
function adopt() {
  const sheets = [DDDVariables, DDDReset].map((item) => item.styleSheet);
  const existing = globalThis.document.adoptedStyleSheets;
  if (!existing.includes(sheets[1])) {
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
