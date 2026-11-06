import { expect, fixture, html } from "@open-wc/testing";
import { LitElement } from "lit";
import { DDDPulseEffect, DDDAnimations } from "../lib/DDDStyles.js";

class DDDPulseTestEl extends LitElement {
  static get styles() {
    return [DDDAnimations, DDDPulseEffect];
  }
  render() {
    return html`<span>pulse</span>`;
  }
}
globalThis.customElements.define("ddd-pulse-test-el", DDDPulseTestEl);

// an endless animated box-shadow repaints every frame for as long as the
// page is open; the pulse now plays twice and then rests
describe("DDD pulse effect", () => {
  it("pulses twice, not forever", async () => {
    const el = await fixture(
      html`<ddd-pulse-test-el data-pulse="1"></ddd-pulse-test-el>`,
    );
    const style = globalThis.getComputedStyle(el);
    expect(style.animationName).to.equal("pulse");
    expect(style.animationIterationCount).to.equal("2");
    expect(style.animationDuration).to.equal("2s");
    const anims = el.getAnimations();
    expect(anims.length).to.equal(1);
    expect(anims[0].effect.getComputedTiming().iterations).to.equal(2);
  });

  it("does not pulse without data-pulse", async () => {
    const el = await fixture(html`<ddd-pulse-test-el></ddd-pulse-test-el>`);
    expect(globalThis.getComputedStyle(el).animationName).to.equal("none");
  });

  it("respects prefers-reduced-motion", () => {
    const text = DDDPulseEffect.cssText;
    expect(text).to.match(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*:host\(\[data-pulse\]\)[\s\S]*animation: none/,
    );
  });
});
