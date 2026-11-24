import { fixture, expect, html } from "@open-wc/testing";
import "../web-baseline-status.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// nothing is requested from webstatus.dev until the visitor allows it
describe("web-baseline-status consent", () => {
  let el;
  beforeEach(async () => {
    HaxConsent.clearAll();
    el = await fixture(
      html`<web-baseline-status feature-id="anchor-positioning">
      </web-baseline-status>`,
    );
  });
  after(() => HaxConsent.clearAll());

  it("shows the panel and no widget before consent", () => {
    expect(el.shadowRoot.querySelector("baseline-status")).to.not.exist;
    const gate = el.shadowRoot.querySelector("hax-consent-gate");
    expect(gate.getAttribute("service")).to.equal("webstatus");
  });

  it("passes the a11y audit while waiting", async () => {
    await expect(el).shadowDom.to.be.accessible();
  });

  it("draws the widget once allowed and asks again when withdrawn", async () => {
    HaxConsent.set("webstatus", "allow");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("baseline-status")).to.exist;
    expect(el.shadowRoot.querySelector("hax-consent-gate")).to.not.exist;
    HaxConsent.set("webstatus", null);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("baseline-status")).to.not.exist;
  });
});
