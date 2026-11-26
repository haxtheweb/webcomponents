import { expect } from "@open-wc/testing";
import {
  splitSelectorList,
  rewriteSheetSelectors,
  withoutHost,
  shadowSafeSheet,
} from "../lib/shadow-sheets.js";

describe("shadow-sheets", () => {
  it("splits a selector list on top level commas only", () => {
    expect(
      splitSelectorList(':is(h1, h2) > p, a[title="x, y"], :host'),
    ).to.deep.equal([":is(h1, h2) > p", 'a[title="x, y"]', ":host"]);
  });

  it("rewrites selectors inside grouping rules and deletes emptied rules", () => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host { color: red; }
      :root, :host, p { color: blue; }
      @media (min-width: 1px) { :host, h2 { color: green; } }
    `);
    rewriteSheetSelectors(sheet, withoutHost);
    expect(sheet.cssRules.length).to.equal(2);
    expect(sheet.cssRules[0].selectorText).to.equal(":root, p");
    expect(sheet.cssRules[1].cssRules[0].selectorText).to.equal("h2");
  });

  it("adopts a copy without :host, keeps the source and reuses the copy", () => {
    const source = new CSSStyleSheet();
    source.replaceSync(":root, :host { --x: 1px; } p { margin: 0; }");
    const copy = shadowSafeSheet(source);
    expect(copy).to.not.equal(source);
    expect(copy.cssRules[0].selectorText).to.equal(":root");
    expect(source.cssRules[0].selectorText).to.include(":host");
    expect(shadowSafeSheet(source)).to.equal(copy);
  });

  it("returns a sheet that has no :host as is", () => {
    const source = new CSSStyleSheet();
    source.replaceSync("p { margin: 0; }");
    expect(shadowSafeSheet(source)).to.equal(source);
  });

  it("keeps the page tokens on the content inside an adopting shadow root", async () => {
    const tokens = new CSSStyleSheet();
    tokens.replaceSync(":root, :host { --measure: 100px; }");
    const host = document.createElement("div");
    host.style.setProperty("--measure", "40px");
    document.body.appendChild(host);
    const root = host.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [shadowSafeSheet(tokens)];
    const p = document.createElement("p");
    root.appendChild(p);
    expect(getComputedStyle(p).getPropertyValue("--measure").trim()).to.equal(
      "40px",
    );
    host.remove();
  });
});
