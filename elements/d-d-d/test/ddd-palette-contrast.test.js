import { expect } from "@open-wc/testing";
// the older palettes are built from simple-colors tokens, defined globally
import "@haxtheweb/simple-colors-shared-styles/simple-colors-shared-styles.js";
import { DDDAllStyles } from "../lib/DDDStyles.js";
import {
  DDDPaletteRegistry,
  DDDPaletteSwatches,
} from "../lib/DDDPaletteRegistry.js";

// the palettes added with literal values (16-19) answer to their key and to
// their number without any other stylesheet
const LITERAL_PALETTES = [
  "tidepool-teal",
  "desert-dune",
  "berry-bramble",
  "clear-sight",
];
// every palette promises that text-color-N meets WCAG AA (4.5:1) on
// color-N: themes put text-color-N on color-N fills (header, footer, menu,
// buttons) for whichever palette a site picks, so hold every one to it
const ALL_PALETTES = DDDPaletteRegistry.map((p) => p.key);

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

describe("DDD palettes contrast", () => {
  let host;
  // a plain container: open-wc fixtures are removed after each test
  before(() => {
    host = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(host);
    const root = host.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = DDDAllStyles.map((s) => s.styleSheet);
    root.innerHTML = ALL_PALETTES.map(
      (key) =>
        `<div data-palette="${key}">${DDDPaletteSwatches.map(
          (n) =>
            `<span data-n="${n}" style="background-color: var(--ddd-palette-color-${n}); color: var(--ddd-palette-text-color-${n})">Aa</span>`,
        ).join("")}${["accent", "chip"]
          .map(
            (role) =>
              `<i data-role="${role}" style="background-color: var(--ddd-palette-${role}); color: var(--ddd-palette-${role}-ink)">Aa</i>`,
          )
          .join("")}</div>`,
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
  });

  ALL_PALETTES.forEach((key) => {
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
        expect(
          cs.backgroundColor,
          `${key} fill ${span.dataset.n}`,
        ).to.not.equal("rgba(0, 0, 0, 0)");
        expect(ratio(bg, fg), `${key} ${span.dataset.n}`).to.be.at.least(4.5);
      });
    });
  });

  // an accent or chip fill is one of the palette's colors; its ink is that
  // color's paired text color, so it reads the same in DDD and under a
  // design system bridge (which keeps every text pair at 4.5:1)
  ALL_PALETTES.forEach((key) => {
    it(`${key}: accent and chip ink are their fill's paired text color`, () => {
      const row = host.shadowRoot.querySelector(`[data-palette="${key}"]`);
      const pairs = Array.from(row.querySelectorAll("span")).map((span) => {
        const cs = globalThis.getComputedStyle(span);
        return `${cs.color} on ${cs.backgroundColor}`;
      });
      row.querySelectorAll("i").forEach((el) => {
        const cs = globalThis.getComputedStyle(el);
        const role = el.dataset.role;
        expect(pairs, `${key} ${role}`).to.include(
          `${cs.color} on ${cs.backgroundColor}`,
        );
        expect(
          ratio(channels(cs.backgroundColor), channels(cs.color)),
          `${key} ${role}`,
        ).to.be.at.least(4.5);
      });
    });
  });
});

// the link role (--ddd-palette-link) is palette text on the page surface:
// links, step titles, breadcrumbs. It reads at 4.5:1 on the light page
// surfaces in light mode and the dark ones in dark mode in every palette,
// whatever order a palette's colors run in, and so do its halves on their
// own surfaces in either scheme. It computes to a relative color, so it is
// read back through a canvas, which converts any CSS color to sRGB.
describe("DDD palette link role", () => {
  const SURFACES = {
    light: [
      "--ddd-theme-default-white",
      "--ddd-theme-default-limestoneMaxLight",
    ],
    dark: [
      "--ddd-theme-default-coalyGray",
      "--ddd-theme-default-potentialMidnight",
    ],
  };
  const ROLES = [
    ["--ddd-palette-link", "light", "light"],
    ["--ddd-palette-link", "dark", "dark"],
    ["--ddd-palette-link-on-light", "light", "light"],
    ["--ddd-palette-link-on-light", "dark", "light"],
    ["--ddd-palette-link-on-dark", "light", "dark"],
    ["--ddd-palette-link-on-dark", "dark", "dark"],
  ];
  let host;
  let ctx;
  const srgb = (value) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0] / 255, d[1] / 255, d[2] / 255];
  };
  before(() => {
    const canvas = globalThis.document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    host = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(host);
    const root = host.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = DDDAllStyles.map((s) => s.styleSheet);
    root.innerHTML = ["light", "dark"]
      .map(
        (scheme) =>
          `<div style="color-scheme: ${scheme}">${ALL_PALETTES.map(
            (key) =>
              `<div data-scheme="${scheme}" data-palette="${key}">${ROLES.map(
                ([token, , surface]) =>
                  SURFACES[surface]
                    .map(
                      (bg) =>
                        `<b data-token="${token}" data-bg="${bg}" style="background-color: var(${bg}); color: var(${token})">Aa</b>`,
                    )
                    .join(""),
              ).join("")}</div>`,
          ).join("")}</div>`,
      )
      .join("");
  });
  after(() => {
    host.remove();
  });

  ALL_PALETTES.forEach((key) => {
    ["light", "dark"].forEach((scheme) => {
      it(`${key} (${scheme}): the link role and its halves meet 4.5:1 on their surfaces`, () => {
        const row = host.shadowRoot.querySelector(
          `[data-scheme="${scheme}"][data-palette="${key}"]`,
        );
        const probes = Array.from(row.querySelectorAll("b")).filter((b) =>
          ROLES.some(
            ([token, s, surface]) =>
              s === scheme &&
              b.dataset.token === token &&
              SURFACES[surface].includes(b.dataset.bg),
          ),
        );
        expect(probes.length).to.be.at.least(4);
        probes.forEach((b) => {
          const cs = globalThis.getComputedStyle(b);
          const r = ratio(srgb(cs.backgroundColor), srgb(cs.color));
          expect(
            r,
            `${key} ${scheme} ${b.dataset.token} on ${b.dataset.bg}`,
          ).to.be.at.least(4.5);
        });
      });
    });
  });
});
