import { fixture, expect, html } from "@open-wc/testing";
import "../hax-consent-gate.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

describe("hax-consent-gate", () => {
  beforeEach(() => {
    HaxConsent.clearAll();
    HaxConsent.choicesUrl = null;
  });

  describe("bar", () => {
    let element;
    beforeEach(async () => {
      element = await fixture(
        html`<hax-consent-gate
          variant="bar"
          service="google-analytics"
        ></hax-consent-gate>`,
      );
    });
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
    it("is a labelled region with Allow and Don't allow of equal weight", () => {
      const region = element.shadowRoot.querySelector('[role="region"]');
      expect(region.getAttribute("aria-label")).to.equal("Privacy choice");
      const allow = element.shadowRoot.querySelector("#allow");
      const deny = element.shadowRoot.querySelector("#deny");
      const a = getComputedStyle(allow);
      const d = getComputedStyle(deny);
      expect(a.backgroundColor).to.equal(d.backgroundColor);
      expect(a.color).to.equal(d.color);
      expect(a.borderTopColor).to.equal(d.borderTopColor);
      expect(a.fontWeight).to.equal(d.fontWeight);
      expect(allow.getBoundingClientRect().height).to.equal(
        deny.getBoundingClientRect().height,
      );
    });
    it("has no close button: it stays until the visitor chooses", () => {
      expect(element.shadowRoot.querySelectorAll("button").length).to.equal(2);
    });
    it("says how to change the choice, linking the choices page when there is one", async () => {
      expect(element.shadowRoot.querySelector(".later").textContent).to.contain(
        "clearing this site's data",
      );
      HaxConsent.choicesUrl = "privacy";
      element.requestUpdate();
      await element.updateComplete;
      const link = element.shadowRoot.querySelector(".later a");
      expect(link.getAttribute("href")).to.equal("privacy");
    });
    it("Don't allow stores deny and shows a status before leaving", async () => {
      element.shadowRoot.querySelector("#deny").click();
      await element.updateComplete;
      expect(HaxConsent.get("google-analytics")).to.equal("deny");
      expect(element.shadowRoot.querySelector('[role="status"]')).to.exist;
    });
    it("Allow stores allow", async () => {
      element.shadowRoot.querySelector("#allow").click();
      expect(HaxConsent.get("google-analytics")).to.equal("allow");
    });
    it("reserves its height on the page and gives it back", async () => {
      document.body.style.paddingBottom = "3px";
      const bar = document.createElement("hax-consent-gate");
      bar.setAttribute("variant", "bar");
      document.body.appendChild(bar);
      await bar.updateComplete;
      await wait(50);
      expect(document.body.style.paddingBottom).to.not.equal("3px");
      bar.remove();
      expect(document.body.style.paddingBottom).to.equal("3px");
      document.body.style.paddingBottom = "";
    });
  });

  describe("panel", () => {
    let element;
    beforeEach(async () => {
      element = await fixture(
        html`<hax-consent-gate
          variant="panel"
          service="google-maps"
        ></hax-consent-gate>`,
      );
    });
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
    it("offers one Always allow choice named for the service", () => {
      const buttons = element.shadowRoot.querySelectorAll("button");
      expect(buttons.length).to.equal(1);
      expect(buttons[0].textContent).to.contain("Always allow Google Maps");
    });
    it("names an unknown host in its notice", async () => {
      const other = await fixture(
        html`<hax-consent-gate
          variant="panel"
          service="embed:example.com"
          host="example.com"
        ></hax-consent-gate>`,
      );
      expect(other.shadowRoot.querySelector(".notice").textContent).to.contain(
        "example.com",
      );
    });
    it("draws nothing once allowed, and asks again when withdrawn", async () => {
      element.shadowRoot.querySelector("#allow").click();
      await element.updateComplete;
      expect(HaxConsent.get("google-maps")).to.equal("allow");
      expect(element.shadowRoot.querySelector(".panel")).to.not.exist;
      HaxConsent.set("google-maps", null);
      await element.updateComplete;
      expect(element.shadowRoot.querySelector(".panel")).to.exist;
    });
  });
});
