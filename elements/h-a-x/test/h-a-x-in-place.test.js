import { fixture, expect, html, waitUntil } from "@open-wc/testing";

import "../h-a-x.js";
import "../lib/h-a-x-dependencies.js";
import "@haxtheweb/hax-body/lib/hax-store.js";

// a stand-in for DDD's page sheet: tokens on ":root, :host" and base type on
// hax-body, flagged so h-a-x adopts it like the design system sheet
function pageSheet() {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`
    :root, :host { --in-place-measure: 100px; }
    hax-body { line-height: 1; font-size: 10px; }
  `);
  sheet.hax = true;
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  return sheet;
}

describe("h-a-x in-place", () => {
  let sheet;
  beforeEach(() => {
    sheet = pageSheet();
  });
  afterEach(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (s) => s !== sheet,
    );
  });

  it("keeps the page's tokens instead of setting them again on h-a-x", async () => {
    const wrap = await fixture(
      html`<div style="--in-place-measure: 40px">
        <h-a-x in-place><p>text</p></h-a-x>
      </div>`,
    );
    const el = wrap.querySelector("h-a-x");
    el.applyHAXStyles();
    const body = el.shadowRoot.querySelector("hax-body");
    expect(
      getComputedStyle(body).getPropertyValue("--in-place-measure").trim(),
    ).to.equal("40px");
  });

  it("inherits the page's type in place, and takes the base type otherwise", async () => {
    const wrap = await fixture(
      html`<div style="line-height: 33px; font-size: 22px">
        <h-a-x in-place><p>text</p></h-a-x>
        <h-a-x><p>text</p></h-a-x>
      </div>`,
    );
    const [inPlace, standalone] = wrap.querySelectorAll("h-a-x");
    inPlace.applyHAXStyles();
    standalone.applyHAXStyles();
    const a = getComputedStyle(inPlace.shadowRoot.querySelector("hax-body"));
    const b = getComputedStyle(standalone.shadowRoot.querySelector("hax-body"));
    expect(a.fontSize).to.equal("22px");
    expect(a.lineHeight).to.equal("33px");
    expect(b.fontSize).to.equal("10px");
  });

  it("drops a .hax sheet the document no longer has", async () => {
    const el = await fixture(html`<h-a-x in-place><p>text</p></h-a-x>`);
    el.applyHAXStyles();
    const count = el.shadowRoot.adoptedStyleSheets.length;
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (s) => s !== sheet,
    );
    el.applyHAXStyles();
    expect(el.shadowRoot.adoptedStyleSheets.length).to.equal(count - 1);
  });

  it("carries body's classes for page rules keyed to them", async () => {
    const el = await fixture(html`<h-a-x in-place><p>text</p></h-a-x>`);
    document.body.classList.add("h-a-x-probe-class");
    await waitUntil(() =>
      (el.getAttribute("data-page-classes") || "").includes(
        "h-a-x-probe-class",
      ),
    );
    document.body.classList.remove("h-a-x-probe-class");
    await waitUntil(
      () =>
        !(el.getAttribute("data-page-classes") || "").includes(
          "h-a-x-probe-class",
        ),
    );
  });
});
