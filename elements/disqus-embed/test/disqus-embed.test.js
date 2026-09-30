import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { DisqusEmbed, DisqusBroker, DisqusInstance } from "../disqus-embed.js";

// network stub: the broker loads the disqus embed script through the script
// src property, so the descriptor is patched to capture the real url and
// redirect the element to a local 404; no request ever reaches *.disqus.com
const disqusScriptSrcs = []
const scriptSrcDescriptor = Object.getOwnPropertyDescriptor(
  HTMLScriptElement.prototype,
  "src",
)
Object.defineProperty(HTMLScriptElement.prototype, "src", {
  ...scriptSrcDescriptor,
  set(value) {
    if (String(value).includes("disqus.com")) {
      disqusScriptSrcs.push(String(value))
      return scriptSrcDescriptor.set.call(
        this,
        "/elements/disqus-embed/test/does-not-exist.js",
      )
    }
    return scriptSrcDescriptor.set.call(this, value)
  },
})
after(() => {
  Object.defineProperty(
    HTMLScriptElement.prototype,
    "src",
    scriptSrcDescriptor,
  )
})

describe("disqus-embed", () => {
  it("instantiates", async () => {
    const el = await fixture(html`<disqus-embed></disqus-embed>`);
    expect(el).to.exist;
    if (el._timeout) clearTimeout(el._timeout);
  });

  it("exposes its tag and default properties", async () => {
    const el = await fixture(html`<disqus-embed></disqus-embed>`);
    expect(DisqusEmbed.tag).to.equal("disqus-embed");
    expect(globalThis.customElements.get("disqus-embed")).to.exist;
    expect(el.loadingText).to.equal("Loading comments...");
    expect(el.pageURL).to.equal(null);
    expect(el.pageIdentifier).to.equal(null);
    expect(el.pageTitle).to.equal(null);
    expect(el.shortName).to.equal(null);
    expect(el.lang).to.equal("en");
    if (el._timeout) clearTimeout(el._timeout);
  });

  it("renders its loading text into the slot fallback", async () => {
    const el = await fixture(
      html`<disqus-embed loading-text="Hold on..."></disqus-embed>`,
    );
    expect(el.shadowRoot.querySelector("slot")).to.exist;
    expect(el.shadowRoot.innerHTML).to.include("Hold on...");
    if (el._timeout) clearTimeout(el._timeout);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<disqus-embed></disqus-embed>`);
    await expect(el).to.be.accessible();
    if (el._timeout) clearTimeout(el._timeout);
  });

  it("hands its light dom children back to the broker on disconnect", async () => {
    const el = await fixture(
      html`<disqus-embed>some slotted content</disqus-embed>`,
    );
    const broker = globalThis.DisqusSingleton.requestAvailability();
    const before = broker.childNodes.length;
    el.remove();
    expect(broker.childNodes.length).to.be.greaterThan(before);
  });

  it("loads the embed script when a valid shortName is set", async () => {
    const el = await fixture(html`<disqus-embed></disqus-embed>`);
    const before = disqusScriptSrcs.length;
    el.shortName = "mysite";
    await aTimeout(50);
    expect(disqusScriptSrcs.length).to.be.greaterThan(before);
    expect(disqusScriptSrcs[disqusScriptSrcs.length - 1]).to.equal(
      "https://mysite.disqus.com/embed.js",
    );
    // a second shortName change reuses the already loaded embed script
    el.shortName = "mysecondsite";
    await aTimeout(50);
    expect(disqusScriptSrcs.length).to.equal(before + 1);
    if (el._timeout) clearTimeout(el._timeout);
  });

  it("refuses invalid short names", async () => {
    const el = await fixture(html`<disqus-embed></disqus-embed>`);
    const before = disqusScriptSrcs.length;
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => warnings.push(args.join(" "));
    el.shortName = "bad name!";
    await aTimeout(50);
    console.warn = originalWarn;
    expect(disqusScriptSrcs.length).to.equal(before);
    expect(warnings.length).to.be.greaterThan(0);
    if (el._timeout) clearTimeout(el._timeout);
  });

  it("rebuilds the disqus configuration when DISQUS is present", async () => {
    const resets = [];
    globalThis.DISQUS = {
      reset: (options) => resets.push(options),
    };
    const el = await fixture(
      html`<disqus-embed
        page-identifier="page1"
        page-url="https://example.com/page1"
        page-title="A page"
        >some comment content</disqus-embed
      >`,
    );
    await aTimeout(900);
    delete globalThis.DISQUS;
    expect(resets.length).to.be.greaterThan(0);
    const reset = resets[0];
    expect(reset.reload).to.be.true;
    const context = { page: {} };
    reset.config.call(context);
    expect(context.page.identifier).to.equal("page1");
    expect(context.page.url).to.equal("https://example.com/page1");
    expect(context.page.title).to.equal("A page");
    expect(context.language).to.equal("en");
    // the rebuild moved the light dom children into the broker and the
    // render target loop hands them back afterwards
    expect(el.textContent).to.include("some comment content");
  });

  it("moves brokered nodes back to the render target", async () => {
    const broker = globalThis.DisqusSingleton.requestAvailability();
    const el = await fixture(html`<disqus-embed></disqus-embed>`);
    broker.renderTarget = el;
    const node = globalThis.document.createElement("div");
    node.textContent = "brokered";
    broker.appendChild(node);
    broker.renderToTarget();
    await aTimeout(150);
    const moved = el.querySelector("div");
    expect(moved).to.exist;
    expect(moved.textContent).to.equal("brokered");
    if (el._timeout) clearTimeout(el._timeout);
  });
});

describe("disqus broker", () => {
  it("is available as a singleton in the document body", () => {
    const broker = globalThis.DisqusSingleton.requestAvailability();
    expect(broker).to.exist;
    expect(globalThis.DisqusSingleton.requestAvailability() === DisqusInstance).to.be.true;
    expect(broker.tagName.toLowerCase()).to.equal("disqus-broker");
    expect(broker.getAttribute("id")).to.equal("disqus_thread");
  });

  it("exposes its tag and renders a slot", async () => {
    const el = await fixture(html`<disqus-broker></disqus-broker>`);
    expect(DisqusBroker.tag).to.equal("disqus-broker");
    expect(el.shadowRoot.querySelector("slot")).to.exist;
    el.remove();
  });

  it("refuses to create embed scripts for invalid names", async () => {
    const el = await fixture(html`<disqus-embed></disqus-embed>`);
    const broker = globalThis.DisqusSingleton.requestAvailability();
    const before = disqusScriptSrcs.length;
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => warnings.push(args.join(" "));
    broker.createEmbedScript(el, "still bad");
    console.warn = originalWarn;
    expect(disqusScriptSrcs.length).to.equal(before);
    expect(warnings.length).to.be.greaterThan(0);
    el.remove();
  });

  it("handles the undocumented disqus api callbacks", () => {
    const broker = globalThis.DisqusSingleton.requestAvailability();
    let renderCalls = 0;
    broker.renderToTarget = () => {
      renderCalls += 1;
    };
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));
    broker.apiCallback("onReady");
    broker.apiCallback("onIdentify");
    broker.apiCallback("onNewComment");
    broker.apiCallback("anything-else");
    console.log = originalLog;
    delete broker.renderToTarget;
    expect(renderCalls).to.equal(2);
    expect(logs).to.deep.equal(["onNewComment", "anything-else"]);
  });

  it("wires the standard disqus callbacks into the broker", () => {
    expect(globalThis.disqus_config).to.be.a("function");
    const broker = globalThis.DisqusSingleton.requestAvailability();
    let renderCalls = 0;
    broker.renderToTarget = () => {
      renderCalls += 1;
    };
    const context = { callbacks: {} };
    globalThis.disqus_config.call(context);
    expect(context.language).to.equal("en");
    const keys = Object.keys(context.callbacks);
    expect(keys).to.deep.equal([
      "onReady",
      "onIdentify",
      "afterRender",
      "beforeComment",
      "onInit",
      "onNewComment",
      "onPaginate",
      "preData",
      "preReset",
    ]);
    keys.forEach((key) => {
      expect(context.callbacks[key][0]).to.be.a("function");
    });
    // every wired callback funnels into the broker api callback
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));
    keys.forEach((key) => {
      context.callbacks[key][0]();
    });
    console.log = originalLog;
    delete broker.renderToTarget;
    expect(renderCalls).to.equal(2);
    expect(logs).to.deep.equal([
      "afterRender",
      "beforeComment",
      "onInit",
      "onNewComment",
      "onPaginate",
      "preData",
      "preReset",
    ]);
  });
});
