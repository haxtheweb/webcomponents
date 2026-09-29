import { fixture, expect, html } from "@open-wc/testing";
import "../lib/confetti-container.js";

const frame = () => new Promise((r) => globalThis.requestAnimationFrame(() => r()));

describe("confetti-container", () => {
  it("creates a canvas overlay when connected", async () => {
    const el = await fixture(html`<confetti-container></confetti-container>`);
    expect(el.canvas).to.exist;
    expect(el.canvas.id).to.equal("confetti-container-canvas-\u{1F389}");
    expect(el.querySelector("canvas")).to.exist;
    expect(el.confetti.length).to.equal(0);
    expect(el.sequins.length).to.equal(0);
    expect(el.options.confettiCount).to.equal(55);
    expect(el.options.sequinCount).to.equal(30);
  });

  it("pops the full confetti and sequin load when popped is added", async () => {
    const el = await fixture(html`<confetti-container></confetti-container>`);
    el.setAttribute("popped", "");
    expect(el.confetti.length).to.equal(el.options.confettiCount);
    expect(el.sequins.length).to.equal(el.options.sequinCount);
    // drain both arrays so the animation loop finishes promptly
    el.confetti = [];
    el.sequins = [];
    await frame();
    await frame();
    expect(el.hasAttribute("popped")).to.equal(false);
  });

  it("confetti and sequins move under their physics", async () => {
    const el = await fixture(html`<confetti-container></confetti-container>`);
    el.setAttribute("popped", "");
    const confetto = el.confetti[0];
    const startY = confetto.position.y;
    const startScaleY = confetto.scale.y;
    const sequin = el.sequins[0];
    const sequinY = sequin.position.y;
    await frame();
    await frame();
    // the update loops ran at least once and moved the pieces
    expect(confetto.position.y).to.not.equal(startY);
    expect(confetto.scale.y).to.not.equal(startScaleY);
    expect(sequin.position.y).to.not.equal(sequinY);
    // cleanup so the loop drains quickly for the next test
    el.confetti = [];
    el.sequins = [];
    await frame();
    await frame();
  });

  it("respects reduced motion by dropping the popped attribute", async () => {
    const original = globalThis.matchMedia;
    globalThis.matchMedia = () => ({ matches: true });
    const el = await fixture(html`<confetti-container></confetti-container>`);
    el.setAttribute("popped", "");
    expect(el.hasAttribute("popped")).to.equal(false);
    expect(el.confetti.length).to.equal(0);
    globalThis.matchMedia = original;
  });
});
