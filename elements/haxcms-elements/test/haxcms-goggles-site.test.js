import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import {
  siteLens,
  toggleGoggles,
  GOGGLES_COMMAND,
} from "../lib/core/ui/haxcms-goggles-site.js";
import { HaxcmsGogglesPanel } from "../lib/core/ui/haxcms-goggles-panel.js";

class TestLensPanel extends HaxcmsGogglesPanel {
  get panelTitle() {
    return "Test lens";
  }
  renderBody() {
    return html`<p class="said">body</p>`;
  }
}
globalThis.customElements.define("test-lens-panel", TestLensPanel);

let loads = 0;
siteLens({
  id: "testlens",
  text: "Test lens",
  icon: "icons:update",
  about: "About the test lens",
  load: async () => {
    loads++;
    return {
      sayText: "Test lens on",
      pick: () => null,
      choose: () => {},
      panel: "test-lens-panel",
    };
  },
});

describe("haxcms-goggles-site", function () {
  this.timeout(15000);

  it("adds the goggles to Merlin's developer list, once per Merlin", () => {
    const options = [];
    const merlin = { defineOption: (o) => options.push(o) };
    globalThis.dispatchEvent(
      new CustomEvent("hax-network-merlin", { detail: { merlin } }),
    );
    globalThis.dispatchEvent(
      new CustomEvent("hax-network-merlin", { detail: { merlin } }),
    );
    expect(options.length).to.equal(1);
    expect(options[0].path).to.equal(GOGGLES_COMMAND);
    expect(options[0].context).to.deep.equal([">"]);
    expect(options[0].tags).to.include("testlens");
  });

  it("loads the lens the first time the goggles go on, with its panel slotted in", async () => {
    expect(loads).to.equal(0);
    await toggleGoggles("testlens");
    await aTimeout(300);
    expect(loads).to.equal(1);
    const g = globalThis.document.querySelector("haxcms-goggles");
    expect(g).to.exist;
    expect(g.lens).to.equal("testlens");
    const panel = g.querySelector("test-lens-panel");
    expect(panel).to.exist;
    expect(panel.getAttribute("slot")).to.equal("lens-panel");
    await panel.updateComplete;
    expect(panel.shadowRoot.querySelector(".body .said")).to.exist;
    // off again
    await toggleGoggles();
    await aTimeout(300);
    expect(loads).to.equal(1);
  });

  it("moves the panel with the arrow keys and puts it back with Home", async () => {
    const el = await fixture(html`<test-lens-panel></test-lens-panel>`);
    el.style.position = "fixed";
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector("button.move");
    const before = el.getBoundingClientRect().left;
    btn.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowLeft", shiftKey: true }),
    );
    expect(el.hasAttribute("placed")).to.be.true;
    expect(Math.round(el.getBoundingClientRect().left)).to.be.below(
      Math.round(before),
    );
    expect(globalThis.localStorage.getItem("test-lens-panel-place")).to.exist;
    btn.dispatchEvent(new KeyboardEvent("keydown", { key: "Home" }));
    expect(el.hasAttribute("placed")).to.be.false;
    expect(globalThis.localStorage.getItem("test-lens-panel-place")).to.equal(
      null,
    );
  });
});
