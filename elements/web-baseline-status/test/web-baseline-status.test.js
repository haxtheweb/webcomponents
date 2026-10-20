import { html, fixture, expect, aTimeout } from "@open-wc/testing";
import { WebBaselineStatus } from "../web-baseline-status.js";

const FEATURE = {
  feature_id: "anchor-positioning",
  name: "Anchor positioning",
  baseline: { status: "newly", low_date: "2026-01-13" },
  browser_implementations: {
    chrome: { status: "available" },
    chrome_android: { status: "available" },
    edge: { status: "available" },
    firefox: { status: "available" },
    firefox_android: { status: "available" },
    safari: { status: "available" },
    safari_ios: { status: "available" },
  },
};

describe("WebBaselineStatus test", () => {
  let element;
  let originalFetch;
  let requested;

  // the upstream widget calls api.webstatus.dev; stub fetch so tests never
  // leave the machine
  before(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (url) => {
      requested.push(String(url));
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(FEATURE),
      });
    };
  });
  after(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(async () => {
    requested = [];
    element = await fixture(html`
      <web-baseline-status
        feature-id="anchor-positioning"
      ></web-baseline-status>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
    expect(element).to.be.instanceOf(WebBaselineStatus);
  });

  it("has the expected tag and is registered", () => {
    expect(WebBaselineStatus.tag).to.equal("web-baseline-status");
    expect(globalThis.customElements.get("web-baseline-status")).to.equal(
      WebBaselineStatus,
    );
  });

  it("registers the upstream baseline-status element", () => {
    expect(globalThis.customElements.get("baseline-status")).to.exist;
  });

  it("has haxProperties pointing at its schema file", () => {
    expect(WebBaselineStatus.haxProperties).to.be.a("string");
    expect(WebBaselineStatus.haxProperties).to.include(
      "web-baseline-status.haxProperties.json",
    );
  });

  it("loads a valid schema with featureId required", async () => {
    const schema = await (
      await originalFetch(WebBaselineStatus.haxProperties)
    ).json();
    const field = schema.settings.configure.find(
      (f) => f.property === "featureId",
    );
    expect(field).to.exist;
    expect(field.required).to.equal(true);
    expect(schema.demoSchema[0].tag).to.equal("web-baseline-status");
  });

  it("maps the feature-id attribute to featureId", () => {
    expect(element.featureId).to.equal("anchor-positioning");
  });

  it("defaults featureId to empty string", async () => {
    const el = await fixture(html`<web-baseline-status></web-baseline-status>`);
    expect(el.featureId).to.equal("");
  });

  it("reflects featureId back to the feature-id attribute", async () => {
    element.featureId = "css-nesting";
    await element.updateComplete;
    expect(element.getAttribute("feature-id")).to.equal("css-nesting");
  });

  it("passes featureId through to the upstream widget", async () => {
    const widget = element.shadowRoot.querySelector("baseline-status");
    expect(widget).to.exist;
    expect(widget.featureId).to.equal("anchor-positioning");
    element.featureId = "css-nesting";
    await element.updateComplete;
    expect(widget.featureId).to.equal("css-nesting");
  });

  it("requests the feature from the status API and renders it", async () => {
    const widget = element.shadowRoot.querySelector("baseline-status");
    await widget.updateComplete;
    await aTimeout(50);
    await widget.updateComplete;
    expect(requested.some((u) => u.endsWith("/anchor-positioning"))).to.equal(
      true,
    );
    expect(widget.shadowRoot.textContent).to.include("Anchor positioning");
  });

  it("disables pointer events on the widget while editing in HAX", async () => {
    element.haxeditModeChanged(true);
    await element.updateComplete;
    const widget = element.shadowRoot.querySelector("baseline-status");
    expect(widget.classList.contains("is-editing")).to.equal(true);
    expect(globalThis.getComputedStyle(widget).pointerEvents).to.equal("none");
    element.haxeditModeChanged(false);
    await element.updateComplete;
    expect(widget.classList.contains("is-editing")).to.equal(false);
  });

  it("passes the a11y audit", async () => {
    await element.shadowRoot.querySelector("baseline-status").updateComplete;
    await aTimeout(50);
    // label-content-name-mismatch is raised by the upstream baseline-status
    // 1.1.1 <summary> (its aria-label does not contain the visible text); it
    // is not something this wrapper can change, so it is excluded here
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["label-content-name-mismatch"],
    });
  });
});
