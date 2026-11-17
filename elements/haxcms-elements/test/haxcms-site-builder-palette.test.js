import { expect } from "@open-wc/testing";
import "../lib/core/haxcms-site-builder.js";

// a theme that lists supportedPalettes is only ever given one of them
const Builder = () => globalThis.customElements.get("haxcms-site-builder");

class PaletteListTheme extends HTMLElement {
  static get supportedPalettes() {
    return ["4", "5"];
  }
}
globalThis.customElements.define("palette-list-theme", PaletteListTheme);

class AnyPaletteTheme extends HTMLElement {}
globalThis.customElements.define("any-palette-theme", AnyPaletteTheme);

function allowed(themeTag, palette, themeDefault) {
  const theme = globalThis.document.createElement(themeTag);
  return Builder().prototype._allowedThemePalette.call(
    { __themeDefaultPalette: themeDefault },
    theme,
    palette,
  );
}

describe("haxcms-site-builder theme palettes", () => {
  it("keeps a palette the theme supports", () => {
    expect(allowed("palette-list-theme", "4", 5)).to.equal("4");
  });

  it("gives an unsupported palette back to the theme's default", () => {
    expect(allowed("palette-list-theme", "2", 5)).to.equal("5");
  });

  it("uses the first supported palette when the default is not listed", () => {
    expect(allowed("palette-list-theme", "2", 9)).to.equal("4");
    expect(allowed("palette-list-theme", "2", undefined)).to.equal("4");
  });

  it("leaves no palette and themes without a list alone", () => {
    expect(allowed("palette-list-theme", "", 5)).to.equal("");
    expect(allowed("palette-list-theme", null, 5)).to.equal(null);
    expect(allowed("any-palette-theme", "2", 5)).to.equal("2");
  });
});
