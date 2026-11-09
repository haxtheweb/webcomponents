import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import {
  DDDBlockStyles,
  DDDCompletionTracker,
  celebrateDDDCompletion,
  prefersDDDReducedMotion,
  renderDDDBlockChip,
  renderDDDBlockHeader,
  renderDDDBurst,
} from "../lib/DDDBlock.js";
import {
  DDDProgressRingStyles,
  dddProgressPercent,
  dddProgressShown,
  dddProgressState,
  renderDDDProgressRing,
} from "../lib/DDDProgressRing.js";

// matchMedia that answers prefers-reduced-motion with reduce
function reduceMotion(on) {
  const real = globalThis.matchMedia;
  globalThis.matchMedia = (q) => {
    if (String(q).indexOf("prefers-reduced-motion") !== -1) {
      return {
        matches: on,
        media: q,
        addEventListener() {},
        removeEventListener() {},
      };
    }
    return real.call(globalThis, q);
  };
  return () => {
    globalThis.matchMedia = real;
  };
}

class DDDCompletionTester extends LitElement {
  static get styles() {
    return [DDDBlockStyles, ...DDDProgressRingStyles];
  }
  static get properties() {
    return {
      done: { type: Boolean },
      percent: { type: Number },
      speak: { type: Boolean },
    };
  }
  constructor() {
    super();
    this.done = false;
    this.percent = 0;
    this.speak = true;
  }
  render() {
    return html`<div class="ddd-block" role="group" aria-labelledby="hdr">
        ${renderDDDBlockHeader({
          id: "hdr",
          icon: "av:play-arrow",
          label: "Video · Interactive",
          title: "Course introduction",
          done: this.done,
          doneLabel: "Watched",
          speakDone: this.speak,
        })}
      </div>
      ${renderDDDProgressRing({
        percent: this.percent,
        icon: "editor:insert-chart",
        burst: true,
      })}`;
  }
}
globalThis.customElements.define("ddd-completion-tester", DDDCompletionTester);

describe("DDD block completion", () => {
  it("shows the type icon until done, then a check box with its label", async () => {
    const el = await fixture(
      html`<ddd-completion-tester></ddd-completion-tester>`,
    );
    let chip = el.shadowRoot.querySelector(".ddd-block-chip");
    expect(chip.hasAttribute("data-done")).to.equal(false);
    expect(
      chip.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("av:play-arrow");
    expect(chip.querySelector(".ddd-burst")).to.equal(null);
    expect(el.shadowRoot.querySelector(".ddd-block-chip-label")).to.equal(null);
    el.done = true;
    await el.updateComplete;
    chip = el.shadowRoot.querySelector(".ddd-block-chip");
    expect(chip.hasAttribute("data-done")).to.equal(true);
    expect(chip.getAttribute("aria-hidden")).to.equal("true");
    // hover text, unique icon and spoken state: never colour alone
    expect(chip.getAttribute("title")).to.equal("Watched");
    expect(
      chip.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:check-box");
    expect(chip.querySelectorAll(".ddd-burst-spark").length).to.equal(8);
    expect(
      el.shadowRoot.querySelector(".ddd-block-chip-label").textContent,
    ).to.equal(", Watched");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("does not repeat the state when the block speaks it elsewhere", async () => {
    const el = await fixture(
      html`<ddd-completion-tester></ddd-completion-tester>`,
    );
    el.speak = false;
    el.done = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".ddd-block-chip-label")).to.equal(null);
    expect(
      el.shadowRoot.querySelector(".ddd-block-chip").getAttribute("title"),
    ).to.equal("Watched");
  });

  it("renderDDDBlockChip works on its own (custom headers)", async () => {
    const host = await fixture(html`<div></div>`);
    const { render } = await import("lit");
    render(
      renderDDDBlockChip({ icon: "hax:head-question", done: false }),
      host,
    );
    expect(host.querySelector(".ddd-block-chip simple-icon-lite")).to.exist;
    render(renderDDDBurst(), host);
    expect(host.querySelectorAll(".ddd-burst-spark").length).to.equal(8);
  });

  it("celebrate marks the target for one burst, then clears it", async () => {
    const restore = reduceMotion(false);
    try {
      const el = await fixture(
        html`<ddd-completion-tester done></ddd-completion-tester>`,
      );
      const chip = el.shadowRoot.querySelector(".ddd-block-chip");
      expect(celebrateDDDCompletion(chip)).to.equal(true);
      expect(chip.hasAttribute("data-ddd-celebrate")).to.equal(true);
      const spark = chip.querySelector(".ddd-burst-spark");
      expect(getComputedStyle(spark).animationName).to.equal("ddd-burst-spark");
      await new Promise((r) => setTimeout(r, 1000));
      expect(chip.hasAttribute("data-ddd-celebrate")).to.equal(false);
      expect(celebrateDDDCompletion(null)).to.equal(false);
    } finally {
      restore();
    }
  });

  it("reduced motion: no burst, the done state is just shown", async () => {
    const restore = reduceMotion(true);
    try {
      expect(prefersDDDReducedMotion()).to.equal(true);
      const el = await fixture(
        html`<ddd-completion-tester done></ddd-completion-tester>`,
      );
      const chip = el.shadowRoot.querySelector(".ddd-block-chip");
      expect(celebrateDDDCompletion(chip)).to.equal(false);
      expect(chip.hasAttribute("data-ddd-celebrate")).to.equal(false);
      expect(chip.hasAttribute("data-done")).to.equal(true);
    } finally {
      restore();
    }
  });

  it("the tracker celebrates the first time something is finished, once", () => {
    const t = new DDDCompletionTracker();
    // already done the first time it is seen (a revisit, a reload)
    expect(t.update("a", true)).to.equal(false);
    expect(t.update("a", true)).to.equal(false);
    // seen not done, then done
    expect(t.update("b", false)).to.equal(false);
    expect(t.update("b", true)).to.equal(true);
    // never twice
    expect(t.update("b", false)).to.equal(false);
    expect(t.update("b", true)).to.equal(false);
    // forget: shown again later, first look again
    expect(t.update("c", false)).to.equal(false);
    t.forget("c");
    expect(t.update("c", true)).to.equal(false);
  });
});

describe("DDD progress ring", () => {
  it("has a state for not started, in progress, almost done and done", () => {
    expect(dddProgressState(0)).to.equal("none");
    expect(dddProgressState("x")).to.equal("none");
    expect(dddProgressState(0.4)).to.equal("progress");
    expect(dddProgressState(0.75)).to.equal("almost");
    expect(dddProgressState(0.99)).to.equal("almost");
    expect(dddProgressState(1)).to.equal("done");
    expect(dddProgressState(3)).to.equal("done");
  });

  it("words: never 100% before it is done", () => {
    expect(dddProgressPercent(0.49)).to.equal(49);
    expect(dddProgressPercent(0.996)).to.equal(99);
    expect(dddProgressPercent(1)).to.equal(100);
  });

  it("reduced motion fills in 25% steps; done is always full", () => {
    expect(dddProgressShown(0.49, false)).to.equal(0.49);
    expect(dddProgressShown(0.49, true)).to.equal(0.25);
    expect(dddProgressShown(0.8, true)).to.equal(0.75);
    expect(dddProgressShown(0.2, true)).to.equal(0);
    expect(dddProgressShown(1, true)).to.equal(1);
  });

  it("draws the ring to the percent and a filled disc with a check when done", async () => {
    const restore = reduceMotion(false);
    try {
      const el = await fixture(
        html`<ddd-completion-tester
          .percent="${0.49}"
        ></ddd-completion-tester>`,
      );
      let ring = el.shadowRoot.querySelector(".ddd-ring");
      expect(ring.getAttribute("data-state")).to.equal("progress");
      expect(ring.getAttribute("aria-hidden")).to.equal("true");
      expect(
        ring.querySelector(".ddd-ring-fill").getAttribute("stroke-dasharray"),
      ).to.equal("49 100");
      expect(
        ring
          .querySelector(".ddd-ring-glyph simple-icon-lite")
          .getAttribute("icon"),
      ).to.equal("editor:insert-chart");
      el.percent = 0;
      await el.updateComplete;
      ring = el.shadowRoot.querySelector(".ddd-ring");
      expect(ring.getAttribute("data-state")).to.equal("none");
      el.percent = 1;
      await el.updateComplete;
      ring = el.shadowRoot.querySelector(".ddd-ring");
      expect(ring.getAttribute("data-state")).to.equal("done");
      expect(
        ring
          .querySelector(".ddd-ring-glyph simple-icon-lite")
          .getAttribute("icon"),
      ).to.equal("icons:check");
      // a filled disc, not the ring (not colour alone)
      expect(getComputedStyle(ring.querySelector("svg")).display).to.equal(
        "none",
      );
    } finally {
      restore();
    }
  });

  it("reduced motion draws the stepped fill", async () => {
    const restore = reduceMotion(true);
    try {
      const el = await fixture(
        html`<ddd-completion-tester .percent="${0.6}"></ddd-completion-tester>`,
      );
      const ring = el.shadowRoot.querySelector(".ddd-ring");
      expect(ring.getAttribute("data-shown")).to.equal("50");
      expect(
        ring.querySelector(".ddd-ring-fill").getAttribute("stroke-dasharray"),
      ).to.equal("50 100");
    } finally {
      restore();
    }
  });
});
