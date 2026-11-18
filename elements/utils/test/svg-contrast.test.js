import { fixture, expect, html } from "@open-wc/testing";
import {
  applySvgContrast,
  contrast,
  contrastBackdropFor,
  parseColor,
  watchSvgContrast,
} from "../lib/svg-contrast.js";

const frame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

// a page area with a given background and text color
const area = (bg, color, inner) =>
  fixture(
    html`<div style="background:${bg};color:${color};padding:4px">
      ${inner}
    </div>`,
  );

const legacy = html`<svg width="120" height="40" viewBox="0 0 120 40">
  <line
    x1="0"
    y1="20"
    x2="120"
    y2="20"
    style="stroke:#231f20;stroke-width:2"
  ></line>
  <text x="4" y="14" style="fill:#231f20">catechin</text>
</svg>`;

describe("svg-contrast", () => {
  it("parses computed colors and measures WCAG contrast", () => {
    expect(parseColor("rgb(35, 31, 32)")).to.deep.equal([35, 31, 32, 1]);
    expect(parseColor("rgba(0, 0, 0, 0)")).to.deep.equal([0, 0, 0, 0]);
    expect(parseColor("none")).to.equal(null);
    expect(contrast([0, 0, 0], [255, 255, 255])).to.be.closeTo(21, 0.01);
  });

  it("leaves a drawing alone where it reads fine", async () => {
    const el = await area("#ffffff", "#262626", legacy);
    applySvgContrast(el);
    expect(el.querySelector("svg").hasAttribute("data-hax-contrast")).to.be
      .false;
  });

  it("gives hard-coded dark ink on a dark page a light backdrop", async () => {
    const el = await area("#262626", "#e4e5e7", legacy);
    applySvgContrast(el);
    expect(el.querySelector("svg").getAttribute("data-hax-contrast")).to.equal(
      "light",
    );
  });

  it("gives hard-coded light ink on a light page a dark backdrop", async () => {
    const el = await area(
      "#ffffff",
      "#262626",
      html`<svg width="120" height="40">
        <line
          x1="0"
          y1="20"
          x2="120"
          y2="20"
          style="stroke:#f4f4f4;stroke-width:2"
        ></line>
      </svg>`,
    );
    applySvgContrast(el);
    expect(el.querySelector("svg").getAttribute("data-hax-contrast")).to.equal(
      "dark",
    );
  });

  it("never boxes a currentColor drawing", async () => {
    const el = await area(
      "#262626",
      "#e4e5e7",
      html`<svg width="120" height="40" fill="none" stroke="currentColor">
        <path d="M0 20 L120 20"></path>
      </svg>`,
    );
    applySvgContrast(el);
    expect(el.querySelector("svg").hasAttribute("data-hax-contrast")).to.be
      .false;
  });

  it("ignores the default black fill of shapes with no area", async () => {
    const el = await area(
      "#262626",
      "#e4e5e7",
      html`<svg width="120" height="40" stroke="#e4e5e7">
        <path d="M0 20 L120 20"></path>
        <line x1="0" y1="30" x2="120" y2="30"></line>
      </svg>`,
    );
    expect(contrastBackdropFor(el.querySelector("svg"))).to.equal(null);
  });

  it("respects a drawing with its own background", async () => {
    const el = await area(
      "#262626",
      "#e4e5e7",
      html`<svg width="120" height="40">
        <rect width="120" height="40" fill="#ffffff"></rect>
        <line x1="0" y1="20" x2="120" y2="20" style="stroke:#231f20"></line>
      </svg>`,
    );
    expect(contrastBackdropFor(el.querySelector("svg"))).to.equal(null);
  });

  it("follows the author's data-backdrop", async () => {
    const el = await area("#262626", "#e4e5e7", legacy);
    const svg = el.querySelector("svg");
    svg.setAttribute("data-backdrop", "none");
    applySvgContrast(el);
    expect(svg.hasAttribute("data-hax-contrast")).to.be.false;
    svg.setAttribute("data-backdrop", "dark");
    applySvgContrast(el);
    expect(svg.getAttribute("data-hax-contrast")).to.equal("dark");
  });

  it("can mark another element than the svg", async () => {
    const el = await area(
      "#262626",
      "#e4e5e7",
      html`<div class="picture">${legacy}</div>`,
    );
    applySvgContrast(el, { target: (svg) => svg.closest(".picture") });
    expect(
      el.querySelector(".picture").getAttribute("data-hax-contrast"),
    ).to.equal("light");
    expect(el.querySelector("svg").hasAttribute("data-hax-contrast")).to.be
      .false;
  });

  it("re-checks when the page switches light and dark, until stopped", async () => {
    const el = await area("#ffffff", "#262626", legacy);
    const svg = el.querySelector("svg");
    globalThis.document.body.classList.remove("svg-contrast-test-dark");
    const stop = watchSvgContrast(el);
    await frame();
    expect(svg.hasAttribute("data-hax-contrast")).to.be.false;
    el.style.background = "#262626";
    // a dark mode toggle changes the body class
    globalThis.document.body.classList.add("svg-contrast-test-dark");
    await frame();
    await frame();
    expect(svg.getAttribute("data-hax-contrast")).to.equal("light");
    stop();
    el.style.background = "#ffffff";
    globalThis.document.body.classList.remove("svg-contrast-test-dark");
    await frame();
    await frame();
    // stopped: nothing re-checked
    expect(svg.getAttribute("data-hax-contrast")).to.equal("light");
  });
});
