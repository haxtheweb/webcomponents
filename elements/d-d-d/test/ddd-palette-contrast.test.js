import { expect } from "@open-wc/testing";
import { DDDAllStyles } from "../lib/DDDStyles.js";
import { DDDPaletteSwatches } from "../lib/DDDPaletteRegistry.js";

// the palettes added with literal values (16-19) promise that every
// text-color-N meets WCAG AA (4.5:1) on color-N; hold them to it
const LITERAL_PALETTES = [
  "tidepool-teal",
  "desert-dune",
  "berry-bramble",
  "clear-sight",
];

function channels(value) {
  const m = String(value).match(/rgba?\(([^)]+)\)/);
  return m
    ? m[1]
        .split(",")
        .slice(0, 3)
        .map((v) => parseFloat(v) / 255)
    : null;
}
function luminance(rgb) {
  const f = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
}
function ratio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

describe("DDD literal palettes contrast", () => {
  let host;
  // a plain container: open-wc fixtures are removed after each test
  before(() => {
    host = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(host);
    const root = host.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = DDDAllStyles.map((s) => s.styleSheet);
    root.innerHTML = LITERAL_PALETTES.map(
      (key) =>
        `<div data-palette="${key}">${DDDPaletteSwatches.map(
          (n) =>
            `<span data-n="${n}" style="background-color: var(--ddd-palette-color-${n}); color: var(--ddd-palette-text-color-${n})">Aa</span>`,
        ).join("")}</div>`,
    ).join("");
  });
  after(() => {
    host.remove();
  });

  LITERAL_PALETTES.forEach((key, i) => {
    it(`${key} answers to its key and to data-palette ${16 + i}`, () => {
      const span = host.shadowRoot.querySelector(
        `[data-palette="${key}"] span`,
      );
      const bg = globalThis.getComputedStyle(span).backgroundColor;
      expect(channels(bg)).to.not.equal(null);
      expect(bg).to.not.equal("rgba(0, 0, 0, 0)");
    });
    it(`${key}: every text color meets 4.5:1 on its fill`, () => {
      const spans = host.shadowRoot.querySelectorAll(
        `[data-palette="${key}"] span`,
      );
      expect(spans.length).to.equal(7);
      spans.forEach((span) => {
        const cs = globalThis.getComputedStyle(span);
        const bg = channels(cs.backgroundColor);
        const fg = channels(cs.color);
        expect(bg, `fill ${span.dataset.n}`).to.not.equal(null);
        expect(ratio(bg, fg), `${key} ${span.dataset.n}`).to.be.at.least(4.5);
      });
    });
  });
});
