import { fixture, expect, html } from "@open-wc/testing";
import { emulateMedia, sendKeys } from "@web/test-runner-commands";
import { LitElement } from "lit";
import "../d-d-d.js";
import { DDDAnimations } from "../lib/DDDStyles.js";
import { DesignSystemManager } from "../lib/DesignSystemManager.js";
import {
  DDDMotionIconNames,
  DDDMotionIconStyles,
  DDDMotionIconHostStyles,
  adoptDDDMotionIconHost,
} from "../lib/DDDMotion.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/simple-icon.js";

// a card-like component: includes the shared export and holds icons
class DDDMotionIconTester extends LitElement {
  static get styles() {
    return [DDDMotionIconStyles];
  }
  render() {
    return html`
      <button class="ddd-motion-trigger" id="trigger">
        <simple-icon-lite id="inside" motion="wiggle"></simple-icon-lite>
        <span id="classed" class="ddd-motion-lift" style="display:inline-block"
          >x</span
        >
      </button>
      <span id="self" class="ddd-motion-pop" style="display:inline-block"
        >y</span
      >
      <simple-icon-lite id="still"></simple-icon-lite>
      <slot></slot>
    `;
  }
}
globalThis.customElements.define("ddd-motion-icon-tester", DDDMotionIconTester);

const playing = (el) => el.getAnimations().map((a) => a.animationName);

describe("DDD icon motion library", () => {
  afterEach(async () => {
    await emulateMedia({ reducedMotion: "no-preference" });
  });

  it("names the nine motions, each a ddd-motion-* keyframe", () => {
    expect(DDDMotionIconNames).to.deep.equal([
      "pop",
      "wiggle",
      "tilt",
      "beat",
      "lift",
      "spin",
      "nudge",
      "strike",
      "glow",
    ]);
    [DDDMotionIconStyles, DDDMotionIconHostStyles].forEach((styles) => {
      const text = styles.cssText;
      DDDMotionIconNames.forEach((name) => {
        expect(text).to.contain(`@keyframes ddd-motion-${name} `);
      });
      expect(text).to.not.match(/@keyframes (?!ddd-motion-)/);
    });
  });

  it("leaves pulse as the attention ring", () => {
    expect(DDDMotionIconNames).to.not.include("pulse");
    expect(DDDMotionIconStyles.cssText).to.not.contain("pulse");
    expect(DDDAnimations.cssText).to.match(
      /@keyframes pulse\s*\{[\s\S]*box-shadow/,
    );
  });

  it("keeps every keyframe and rule inside the no-preference query", () => {
    [DDDMotionIconStyles, DDDMotionIconHostStyles].forEach((styles) => {
      const rules = Array.from(styles.styleSheet.cssRules);
      const media = rules.filter((rule) => rule.conditionText);
      expect(media.length).to.equal(1);
      expect(media[0].conditionText).to.equal(
        "(prefers-reduced-motion: no-preference)",
      );
      // outside the query: at most the token defaults, nothing that moves
      rules
        .filter((rule) => !rule.conditionText)
        .forEach((rule) => {
          expect(rule.selectorText).to.equal("html");
          expect(rule.cssText).to.not.contain("animation");
        });
    });
    expect(DDDMotionIconHostStyles.styleSheet.cssRules.length).to.equal(1);
  });

  it("is built on the DDD duration and timing tokens", () => {
    const text = DDDMotionIconStyles.cssText;
    expect(text).to.contain("var(--ddd-duration-slow, 600ms)");
    expect(text).to.contain("var(--ddd-timing-ease, ease-in-out)");
  });

  it("plays once, under a second, when the element is told to play", async () => {
    const el = await fixture(
      html`<ddd-motion-icon-tester></ddd-motion-icon-tester>`,
    );
    const self = el.shadowRoot.querySelector("#self");
    expect(playing(self)).to.deep.equal([]);
    self.classList.add("ddd-motion-play");
    const anims = self.getAnimations();
    expect(anims.map((a) => a.animationName)).to.deep.equal(["ddd-motion-pop"]);
    const timing = anims[0].effect.getComputedTiming();
    expect(timing.iterations).to.equal(1);
    expect(timing.duration).to.be.below(1000);
    expect(timing.fill).to.equal("none");
  });

  it("every motion has keyframes that play", async () => {
    const el = await fixture(
      html`<ddd-motion-icon-tester></ddd-motion-icon-tester>`,
    );
    const self = el.shadowRoot.querySelector("#self");
    DDDMotionIconNames.forEach((name) => {
      self.className = `ddd-motion-${name} ddd-motion-play`;
      const anims = self.getAnimations();
      expect(anims.length, name).to.equal(1);
      expect(anims[0].effect.getKeyframes().length, name).to.be.above(1);
    });
  });

  it("a ddd-motion-trigger with keyboard focus plays what is inside it", async () => {
    const el = await fixture(
      html`<ddd-motion-icon-tester></ddd-motion-icon-tester>`,
    );
    const inside = el.shadowRoot.querySelector("#inside");
    const classed = el.shadowRoot.querySelector("#classed");
    await inside.updateComplete;
    expect(playing(inside)).to.deep.equal([]);
    await sendKeys({ press: "Tab" });
    expect(el.shadowRoot.activeElement.id).to.equal("trigger");
    expect(playing(inside)).to.deep.equal(["ddd-motion-wiggle"]);
    expect(playing(classed)).to.deep.equal(["ddd-motion-lift"]);
    // an icon with no motion is left alone
    expect(playing(el.shadowRoot.querySelector("#still"))).to.deep.equal([]);
    el.shadowRoot.activeElement.blur();
    expect(playing(inside)).to.deep.equal([]);
  });

  it("a host with ddd-motion-trigger plays slotted icons", async () => {
    const el = await fixture(
      html`<ddd-motion-icon-tester class="ddd-motion-trigger"
        ><simple-icon-lite motion="glow"></simple-icon-lite
      ></ddd-motion-icon-tester>`,
    );
    const slotted = el.querySelector("simple-icon-lite");
    expect(playing(slotted)).to.deep.equal([]);
    el.shadowRoot.querySelector("#trigger").focus();
    expect(playing(slotted)).to.deep.equal(["ddd-motion-glow"]);
  });

  it("nothing plays under prefers-reduced-motion", async () => {
    await emulateMedia({ reducedMotion: "reduce" });
    const el = await fixture(
      html`<ddd-motion-icon-tester></ddd-motion-icon-tester>`,
    );
    const self = el.shadowRoot.querySelector("#self");
    self.classList.add("ddd-motion-play");
    expect(playing(self)).to.deep.equal([]);
    // a rule a component wrote itself has no keyframes to play either
    self.style.animation = "ddd-motion-pop 600ms 1";
    expect(playing(self)).to.deep.equal([]);
    el.shadowRoot.querySelector("#trigger").focus();
    expect(playing(el.shadowRoot.querySelector("#inside"))).to.deep.equal([]);
    const icon = await fixture(
      html`<simple-icon-lite motion="spin" motion-active></simple-icon-lite>`,
    );
    expect(playing(icon)).to.deep.equal([]);
  });

  it("puts the classes in the page with the DDD design system", async () => {
    // the first DDD element on a page registers the design system
    globalThis.document.createElement("d-d-d");
    expect(DesignSystemManager.systems.ddd.styles).to.include(
      DDDMotionIconStyles,
    );
    const el = await fixture(
      html`<button class="ddd-motion-trigger">
        <simple-icon-lite motion="nudge"></simple-icon-lite>
      </button>`,
    );
    const icon = el.querySelector("simple-icon-lite");
    await icon.updateComplete;
    el.focus();
    expect(playing(icon)).to.deep.equal(["ddd-motion-nudge"]);
  });
});

describe("DDD icon motion on simple-icon", () => {
  it("announces itself for elements that do not import DDD", () => {
    expect(globalThis.DDDMotion.adoptHost).to.equal(adoptDDDMotionIconHost);
    expect(globalThis.DDDMotion.names).to.equal(DDDMotionIconNames);
  });

  it("adopts the host sheet once", async () => {
    const el = await fixture(html`<div></div>`);
    const root = el.attachShadow({ mode: "open" });
    expect(adoptDDDMotionIconHost(root)).to.equal(true);
    expect(adoptDDDMotionIconHost(root)).to.equal(true);
    expect(root.adoptedStyleSheets.length).to.equal(1);
    expect(adoptDDDMotionIconHost(null)).to.equal(false);
  });

  ["simple-icon", "simple-icon-lite"].forEach((tag) => {
    it(`${tag} plays its motion while motion-active is set`, async () => {
      const el = globalThis.document.createElement(tag);
      el.setAttribute("motion", "beat");
      const wrap = await fixture(html`<div></div>`);
      wrap.appendChild(el);
      await el.updateComplete;
      expect(playing(el)).to.deep.equal([]);
      el.motionActive = true;
      await el.updateComplete;
      const anims = el.getAnimations();
      expect(anims.map((a) => a.animationName)).to.deep.equal([
        "ddd-motion-beat",
      ]);
      expect(anims[0].effect.getComputedTiming().iterations).to.equal(1);
      el.motionActive = false;
      await el.updateComplete;
      expect(playing(el)).to.deep.equal([]);
    });

    it(`${tag} without motion gets no extra styles and never moves`, async () => {
      const plain = globalThis.document.createElement(tag);
      const moving = globalThis.document.createElement(tag);
      moving.setAttribute("motion", "pop");
      const wrap = await fixture(html`<div></div>`);
      wrap.appendChild(plain);
      wrap.appendChild(moving);
      await plain.updateComplete;
      await moving.updateComplete;
      expect(plain.hasAttribute("motion")).to.equal(false);
      expect(plain.hasAttribute("motion-active")).to.equal(false);
      expect(moving.shadowRoot.adoptedStyleSheets.length).to.equal(
        plain.shadowRoot.adoptedStyleSheets.length + 1,
      );
      plain.setAttribute("motion-active", "");
      await plain.updateComplete;
      expect(playing(plain)).to.deep.equal([]);
      expect(globalThis.getComputedStyle(plain).animationName).to.equal("none");
    });
  });
});
