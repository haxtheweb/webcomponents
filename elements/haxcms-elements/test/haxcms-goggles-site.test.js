import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import {
  siteLens,
  toggleGoggles,
  GOGGLES_COMMAND,
} from "../lib/core/ui/haxcms-goggles-site.js";
import { HaxcmsGogglesPanel } from "../lib/core/ui/haxcms-goggles-panel.js";
import { GogglesState } from "../lib/core/ui/haxcms-goggles.js";

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

  it("leaves the developer list alone when the editor already lists the goggles", () => {
    const options = [{ path: GOGGLES_COMMAND }];
    const merlin = {
      allItems: options,
      defineOption: (o) => options.push(o),
    };
    globalThis.dispatchEvent(
      new CustomEvent("hax-network-merlin", { detail: { merlin } }),
    );
    expect(options.length).to.equal(1);
  });

  it("loads the lens the first time the goggles go on, with its panel slotted in", async () => {
    expect(loads).to.equal(0);
    await toggleGoggles("testlens");
    await waitUntil(() => {
      const g = globalThis.document.querySelector("haxcms-goggles");
      return g && g.on && g.querySelector("test-lens-panel");
    }, "the lens panel never arrived");
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
    await waitUntil(() => !GogglesState.on, "the goggles never went off");
    expect(loads).to.equal(1);
  });

  it("answers the network bar's goggles here instead of leaving the site", async () => {
    const asked = new CustomEvent("hax-network-goggles", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    globalThis.dispatchEvent(asked);
    expect(asked.defaultPrevented).to.be.true;
    await waitUntil(() => {
      const g = globalThis.document.querySelector("haxcms-goggles");
      return g && g.on;
    }, "the goggles never came on");
    const g = globalThis.document.querySelector("haxcms-goggles");
    expect(g.on).to.be.true;
    // and off again
    await toggleGoggles();
    await waitUntil(() => !GogglesState.on, "the goggles never went off");
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
