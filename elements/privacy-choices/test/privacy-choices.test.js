import { fixture, expect, html } from "@open-wc/testing";
import "../privacy-choices.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

const rows = (el) => [...el.shadowRoot.querySelectorAll("li")];
const stateOf = (el, i) =>
  rows(el)[i].querySelector(".state").textContent.trim();

describe("privacy-choices", () => {
  let element;
  beforeEach(async () => {
    HaxConsent.clearAll();
    element = await fixture(html`<privacy-choices></privacy-choices>`);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("lists every known service, each not chosen yet", () => {
    expect(rows(element).length).to.equal(5);
    rows(element).forEach((r, i) =>
      expect(stateOf(element, i)).to.contain("Not chosen yet"),
    );
  });

  it("drawing the list never stores anything", () => {
    expect(Object.keys(HaxConsent.choices()).length).to.equal(0);
  });

  it("follows choices made elsewhere without a reload", async () => {
    HaxConsent.set("youtube", "allow");
    HaxConsent.set("google-analytics", "deny");
    await element.updateComplete;
    expect(stateOf(element, 0)).to.equal("Not allowed");
    expect(stateOf(element, 1)).to.equal("Allowed");
  });

  it("ticking stores allow and unticking stores deny", async () => {
    element._change("vimeo", true);
    expect(HaxConsent.get("vimeo")).to.equal("allow");
    element._change("vimeo", false);
    expect(HaxConsent.get("vimeo")).to.equal("deny");
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelector('[role="status"]').textContent,
    ).to.contain("Vimeo is not allowed");
  });

  it("lists hosts answered on embeds after the known services", async () => {
    HaxConsent.set("embed:example.com", "allow");
    await element.updateComplete;
    expect(rows(element).length).to.equal(6);
    expect(rows(element)[5].textContent).to.contain("example.com");
  });

  it("Withdraw all returns every service to ask", async () => {
    HaxConsent.set("youtube", "allow");
    HaxConsent.set("embed:example.com", "deny");
    element.shadowRoot.querySelector("#withdraw").click();
    await element.updateComplete;
    expect(Object.keys(HaxConsent.choices()).length).to.equal(0);
    expect(rows(element).length).to.equal(5);
    expect(
      element.shadowRoot.querySelector('[role="status"]').textContent,
    ).to.contain("withdrawn");
  });
});

describe("privacy-choices change guard", () => {
  it("a first value-changed with no value stores nothing", async () => {
    HaxConsent.clearAll();
    const el = await fixture(html`<privacy-choices></privacy-choices>`);
    el._change("youtube", undefined);
    el._change("youtube", "");
    el._change("youtube", false);
    expect(HaxConsent.get("youtube")).to.equal(null);
  });
});
