import { html, fixture, expect, aTimeout } from "@open-wc/testing";
import { TableauEmbed } from "../tableau-embed.js";

// network stub: pre-register a tableau-viz placeholder so loadTableau never
// dynamic-imports the real https://public.tableau.com Embedding API in tests
const tableauVizStub = class TableauVizStub {}
const originalGet = globalThis.customElements.get.bind(globalThis.customElements)
globalThis.customElements.get = (name) => {
  if (name === "tableau-viz") {
    return tableauVizStub
  }
  return originalGet(name)
}
after(() => {
  globalThis.customElements.get = originalGet
})

describe("TableauEmbed test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <tableau-embed src="https://example.com/view"></tableau-embed>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("TableauEmbed loading", () => {
  it("loads the embedding api once when connected", async () => {
    const el = await fixture(html`<tableau-embed></tableau-embed>`);
    expect(el.loading).to.be.false;
    expect(el.loaded).to.be.true;
    let reloads = 0;
    el.loadTableau = () => {
      reloads += 1;
      return Promise.resolve();
    };
    el.remove();
    document.body.appendChild(el);
    expect(reloads).to.equal(0);
    expect(el.loaded).to.be.true;
    el.remove();
  });

  it("reports failure when the embedding api is unavailable", async () => {
    const current = globalThis.customElements.get;
    globalThis.customElements.get = () => {
      throw new Error("no tableau api available");
    };
    const el = document.createElement("tableau-embed");
    document.body.appendChild(el);
    await aTimeout(100);
    expect(el.loading).to.be.false;
    expect(el.loaded).to.be.false;
    const msg = el.shadowRoot.querySelector(".loading-msg");
    expect(msg).to.exist;
    expect(msg.textContent.trim()).to.equal("Unable to load Tableau.");
    // loading and failure states announce as a live region
    expect(msg.getAttribute("role")).to.equal("status");
    expect(msg.getAttribute("aria-live")).to.equal("polite");
    el.remove();
    globalThis.customElements.get = current;
  });

  it("shows the loading message while loading", async () => {
    const el = await fixture(html`<tableau-embed></tableau-embed>`);
    el.loading = true;
    el.loaded = false;
    await el.updateComplete;
    const msg = el.shadowRoot.querySelector(".loading-msg");
    expect(msg).to.exist;
    expect(msg.textContent.trim()).to.equal("Loading Tableau...");
  });
});

describe("TableauEmbed rendering", () => {
  it("defaults width, height, toolbar, hideTabs and device", async () => {
    const el = await fixture(html`<tableau-embed></tableau-embed>`);
    expect(el.width).to.equal("100%");
    expect(el.height).to.equal("800px");
    expect(el.toolbar).to.equal("hidden");
    expect(el.hideTabs).to.be.true;
    expect(el.device).to.equal("desktop");
  });

  it("renders a tableau-viz with the configured presentation", async () => {
    const el = await fixture(
      html`<tableau-embed
        src="https://example.com/views/sheet"
        width="50%"
        height="400px"
        toolbar="bottom"
        hide-tabs
        device="phone"
      ></tableau-embed>`,
    );
    await el.updateComplete;
    const viz = el.shadowRoot.querySelector("tableau-viz");
    expect(viz).to.exist;
    expect(viz.getAttribute("aria-label")).to.equal("Tableau visualization");
    expect(viz.getAttribute("src")).to.equal("https://example.com/views/sheet");
    expect(viz.getAttribute("width")).to.equal("50%");
    expect(viz.getAttribute("height")).to.equal("400px");
    expect(viz.getAttribute("toolbar")).to.equal("bottom");
    expect(viz.getAttribute("device")).to.equal("phone");
    expect(viz.hasAttribute("hide-tabs")).to.be.true;
  });
});

describe("TableauEmbed HAX integration", () => {
  it("exposes haxProperties from its lib schema file", () => {
    expect(TableauEmbed.haxProperties).to.be.a("string");
    expect(TableauEmbed.haxProperties).to.include(
      "lib/tableau-embed.haxProperties.json",
    );
  });

  it("registers edit mode and active element hooks", async () => {
    const el = await fixture(html`<tableau-embed></tableau-embed>`);
    expect(el.haxHooks()).to.deep.equal({
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    });
  });

  it("tracks hax edit mode changes", async () => {
    const el = await fixture(html`<tableau-embed></tableau-embed>`);
    el.haxeditModeChanged(true);
    expect(el._haxstate).to.be.true;
    el.haxeditModeChanged(false);
    expect(el._haxstate).to.be.false;
  });

  it("tracks the active element while active in hax", async () => {
    const el = await fixture(html`<tableau-embed></tableau-embed>`);
    el.haxactiveElementChanged(el, true);
    expect(el._haxstate).to.be.true;
    // a false value does not unset the flag while still active
    el.haxactiveElementChanged(el, false);
    expect(el._haxstate).to.be.true;
  });
});
