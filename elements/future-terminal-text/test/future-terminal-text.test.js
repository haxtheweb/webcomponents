import { fixture, expect, html } from "@open-wc/testing";
import { css } from "lit";
import "../future-terminal-text.js";
import { FutureTerminalTextLite } from "../lib/future-terminal-text-lite.js";
import { FutureTerminalTextLiteSuper } from "../lib/FutureTerminalTextSuper.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<future-terminal-text></future-terminal-text>`,
    );
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("future-terminal-text behavior", () => {
  it("has sensible defaults", async () => {
    const el = await fixture(html`<future-terminal-text></future-terminal-text>`);
    expect(el.red).to.be.false;
    expect(el.fadein).to.be.false;
    expect(el.glitch).to.be.false;
    expect(el.glitchMax).to.equal(5);
    expect(el.glitchDuration).to.equal(50);
    // SimpleColors inheritance: green accent is this element's default
    expect(el.accentColor).to.equal("green");
    expect(el.dark).to.be.false;
    expect(el.getAttribute("accent-color")).to.equal("green");
  });

  it("exposes the full simple-colors palette through inheritance", async () => {
    const el = await fixture(html`<future-terminal-text></future-terminal-text>`);
    expect(Object.keys(el.colors)).to.deep.equal([
      "grey",
      "red",
      "pink",
      "purple",
      "deep-purple",
      "indigo",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "blue-grey",
    ]);
  });

  it("reflects boolean and numeric properties to attributes", async () => {
    const el = await fixture(
      html`<future-terminal-text>some text</future-terminal-text>`,
    );
    el.red = true;
    el.fadein = true;
    await el.updateComplete;
    expect(el.hasAttribute("red")).to.be.true;
    expect(el.hasAttribute("fadein")).to.be.true;
    // attribute -> property round trip
    el.glitchMax = 9;
    el.glitchDuration = 11;
    await el.updateComplete;
    expect(el.glitchMax).to.equal(9);
    expect(el.glitchDuration).to.equal(11);
    // accent color and dark mode reflect too
    el.accentColor = "cyan";
    el.dark = true;
    await el.updateComplete;
    expect(el.getAttribute("accent-color")).to.equal("cyan");
    expect(el.hasAttribute("dark")).to.be.true;
  });

  it("parses attributes on upgrade", async () => {
    const el = await fixture(
      html`<future-terminal-text
        red
        fadein
        glitch-max="3"
        glitch-duration="10"
        accent-color="red"
      ></future-terminal-text>`,
    );
    expect(el.red).to.be.true;
    expect(el.fadein).to.be.true;
    expect(el.glitchMax).to.equal(3);
    expect(el.glitchDuration).to.equal(10);
    expect(el.accentColor).to.equal("red");
  });

  it("renders a span with a slot in shadow DOM", async () => {
    const el = await fixture(
      html`<future-terminal-text>terminal words</future-terminal-text>`,
    );
    const span = el.shadowRoot.querySelector("span");
    expect(span).to.exist;
    expect(span.querySelector("slot")).to.exist;
    expect(el.textContent).to.equal("terminal words");
  });
});

describe("future-terminal-text-lite (lib) behavior", () => {
  it("registers and renders its own tag with part name", async () => {
    const el = await fixture(
      html`<future-terminal-text-lite>lite text</future-terminal-text-lite>`,
    );
    expect(globalThis.customElements.get("future-terminal-text-lite")).to.equal(
      FutureTerminalTextLite,
    );
    const span = el.shadowRoot.querySelector('span[part="text"]');
    expect(span).to.exist;
    expect(span.querySelector("slot")).to.exist;
    expect(el.textContent).to.equal("lite text");
  });

  it("has the same defaults as the full element", async () => {
    const el = await fixture(
      html`<future-terminal-text-lite></future-terminal-text-lite>`,
    );
    expect(el.red).to.be.false;
    expect(el.fadein).to.be.false;
    expect(el.glitch).to.be.false;
    expect(el.glitchMax).to.equal(5);
    expect(el.glitchDuration).to.equal(50);
  });

  it("passes the a11y audit with readable default colors", async () => {
    const el = await fixture(
      html`<future-terminal-text-lite>terminal words</future-terminal-text-lite>`,
    );
    // the default fallback colors meet contrast so the audit passes
    await expect(el).shadowDom.to.be.accessible();
  });

  it("scrambles exactly one character per call", async () => {
    const el = await fixture(
      html`<future-terminal-text-lite>dddd</future-terminal-text-lite>`,
    );
    const scrambled = el._scramble("dddd");
    // replacement chars come from String.fromCharCode(0-99) so 'd' (100)
    // can never be re-inserted; exactly one character is swapped
    expect(scrambled.length).to.equal(4);
    expect(scrambled).to.not.equal("dddd");
    let changed = 0;
    for (let i = 0; i < 4; i++) {
      if (scrambled[i] !== "d") {
        changed += 1;
      }
    }
    expect(changed).to.equal(1);
  });

  it("waits for the requested milliseconds", async () => {
    const el = await fixture(
      html`<future-terminal-text-lite></future-terminal-text-lite>`,
    );
    const start = Date.now();
    await el._wait(25);
    expect(Date.now() - start).to.be.at.least(20);
  });

  it("does not glitch when the user prefers reduced motion", async () => {
    const el = await fixture(
      html`<future-terminal-text-lite>dddd</future-terminal-text-lite>`,
    );
    const originalMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = () => ({ matches: true });
    try {
      await el._doGlitch();
      expect(el.innerHTML).to.equal("dddd");
    } finally {
      globalThis.matchMedia = originalMatchMedia;
    }
  });

  it("glitches and then restores the original text", async () => {
    const el = await fixture(
      html`<future-terminal-text-lite>dddd</future-terminal-text-lite>`,
    );
    const originalMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = () => ({ matches: false });
    try {
      el.glitchMax = 1;
      el.glitchDuration = 1;
      await el._doGlitch();
      expect(el.innerHTML).to.equal("dddd");
    } finally {
      globalThis.matchMedia = originalMatchMedia;
    }
  });

  it("merges superclass styles when the base class defines them", () => {
    const base = Object.getPrototypeOf(FutureTerminalTextLite);
    const hadStyles = "styles" in base;
    try {
      // stub a styles definition on the anonymous mixin base class so the
      // super.styles branch in FutureTerminalTextLite.styles runs
      base.styles = css`span { color: red }`;
      const styles = FutureTerminalTextLite.styles;
      expect(styles.length).to.equal(2);
      expect(styles[0]).to.equal(base.styles);
    } finally {
      if (!hadStyles) {
        delete base.styles;
      }
    }
  });

  it("starts a glitch from the glitch property change", async () => {
    const el = await fixture(
      html`<future-terminal-text-lite>dddd</future-terminal-text-lite>`,
    );
    const originalMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = () => ({ matches: false });
    try {
      el.glitchMax = 1;
      el.glitchDuration = 1;
      el.glitch = true;
      expect(el.hasAttribute("glitch")).to.be.false;
      // let the async glitch loop finish
      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(el.innerHTML).to.equal("dddd");
    } finally {
      globalThis.matchMedia = originalMatchMedia;
    }
  });
});

describe("FutureTerminalTextLiteSuper mixin", () => {
  it("applies to any superclass and sets defaults", () => {
    const Mixed = FutureTerminalTextLiteSuper(globalThis.HTMLElement);
    // HTMLElement subclasses must be registered before they can be constructed
    globalThis.customElements.define("ftt-super-mixin-el", Mixed);
    const el = globalThis.document.createElement("ftt-super-mixin-el");
    expect(el).to.be.instanceOf(Mixed);
    expect(el.red).to.be.false;
    expect(el.fadein).to.be.false;
    expect(el.glitch).to.be.false;
    expect(el.glitchMax).to.equal(5);
    expect(el.glitchDuration).to.equal(50);
    expect(el._scramble).to.be.a("function");
    expect(el._wait).to.be.a("function");
    expect(el._doGlitch).to.be.a("function");
  });
});

describe("inherited simple-colors helpers (via future-terminal-text)", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<future-terminal-text></future-terminal-text>`);
  });

  it("builds a CSS variable name from the caller arguments", () => {
    expect(el.makeVariable("red", 3, "fixed")).to.equal(
      "--simple-colors-fixed-theme-red-3",
    );
    expect(el.makeVariable()).to.equal("--simple-colors-default-theme-grey-1");
  });

  it("lists AA-compliant contrasting shades for grey text", () => {
    // grey shade 1 (near-white) can carry grey 7-12 text at normal size
    expect(el.getContrastingShades(false, "grey", "1", "grey")).to.deep.equal([
      7, 8, 9, 10, 11, 12,
    ]);
    // large text on red shade 8 can use grey 1-5
    expect(el.getContrastingShades(true, "red", "8", "grey")).to.deep.equal([
      1, 2, 3, 4, 5,
    ]);
    // color-on-color path (neither side grey)
    expect(el.getContrastingShades(false, "red", "3", "blue")).to.deep.equal([
      9, 10, 11, 12,
    ]);
  });

  it("lists AA-compliant shades for every color", () => {
    const result = el.getContrastingColors("red", "8", false);
    expect(Object.keys(result)).to.deep.equal(Object.keys(el.colors));
    expect(result.grey).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
  });

  it("parses its own CSS variable names", () => {
    // round-trips makeVariable output
    expect(el.getColorInfo("--simple-colors-fixed-theme-red-3")).to.deep.equal({
      theme: "fixed",
      color: "red",
      shade: "3",
    });
  });

  it("handles the darkest shade 12 (contrast table indexes by shade)", () => {
    expect(el.getContrastingShades(false, "grey", "12", "grey")).to.deep.equal(
      [1, 2, 3, 4, 5, 6],
    );
  });

  it("invertShade inverts a shade across the scale", () => {
    expect(el.invertShade(3)).to.equal(10);
    expect(el.invertShade("12")).to.equal(1);
  });

  it("isContrastCompliant answers with a boolean", () => {
    expect(el.isContrastCompliant(false, "grey", "1", "grey", 12)).to.equal(
      true,
    );
    expect(el.isContrastCompliant(false, "grey", "1", "grey", 1)).to.equal(
      false,
    );
  });
});
