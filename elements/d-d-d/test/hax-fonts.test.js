import { expect } from "@open-wc/testing";
import {
  haxFontURL,
  fontStylesheetURL,
  resolveFontURLs,
  loadFontFamily,
} from "../lib/fonts.js";
import { HAXFontRegistry } from "../lib/fonts/registry.js";

// Fonts HAX serves itself (lib/fonts): every family in the registry loads
// from HAX, anything else from Google Fonts as named.
describe("HAX fonts", () => {
  it("serves every registered family from lib/fonts, each under an allowed license", async () => {
    const families = Object.keys(HAXFontRegistry);
    expect(families.length).to.be.greaterThan(0);
    for (const family of families) {
      const href = haxFontURL(family);
      expect(href, family).to.contain("/lib/fonts/");
      expect(["OFL-1.1", "Apache-2.0"]).to.include(
        HAXFontRegistry[family].license,
      );
    }
    // the stylesheet exists and declares the family under its Google name
    const css = await (await fetch(haxFontURL("Roboto Slab"))).text();
    expect(css).to.contain('font-family: "Roboto Slab"');
    expect(css).to.contain("unicode-range");
    expect(css).to.not.contain("fonts.gstatic.com");
  });

  it("names a family's stylesheet: HAX's copy, or Google's", () => {
    expect(fontStylesheetURL("VT323")).to.equal(haxFontURL("VT323"));
    expect(haxFontURL("Not A HAX Font")).to.equal(null);
    expect(fontStylesheetURL("Not A HAX Font", "wght@700")).to.equal(
      "https://fonts.googleapis.com/css2?family=Not+A+HAX+Font:wght@700&display=swap",
    );
    // a name that is only a registry key's prototype never resolves
    expect(haxFontURL("constructor")).to.equal(null);
  });

  it("resolves Google Fonts URLs (css2 and the old css API) to local stylesheets", () => {
    const out = resolveFontURLs([
      "https://example.com/brand.css",
      "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;1,400&family=Roboto+Mono:wght@400&display=swap",
      "https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:300,400",
      "https://fonts.googleapis.com/css2?family=Caveat&family=Not+A+HAX+Font:wght@400&display=swap",
    ]);
    expect(out).to.deep.equal([
      "https://example.com/brand.css",
      haxFontURL("Roboto"),
      haxFontURL("Roboto Mono"),
      haxFontURL("Caveat"),
      "https://fonts.googleapis.com/css2?family=Not+A+HAX+Font:wght@400&display=swap",
    ]);
    expect(resolveFontURLs(undefined)).to.deep.equal([]);
  });

  it("loads a family once per document, and the face is usable", async () => {
    const a = loadFontFamily("Press Start 2P");
    const b = loadFontFamily("Press Start 2P");
    expect(a).to.equal(b);
    expect(a.href).to.equal(haxFontURL("Press Start 2P"));
    await new Promise((resolve) => {
      if (a.sheet) resolve();
      else a.addEventListener("load", resolve, { once: true });
    });
    const faces = await document.fonts.load('16px "Press Start 2P"', "A");
    expect(faces.length).to.be.greaterThan(0);
  });
});
