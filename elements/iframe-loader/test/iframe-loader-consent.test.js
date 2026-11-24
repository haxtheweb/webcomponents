import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../iframe-loader.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// a cross-origin frame makes no request until its host is allowed
describe("iframe-loader consent", () => {
  beforeEach(() => HaxConsent.clearAll());
  after(() => HaxConsent.clearAll());

  it("holds a cross-origin source back and shows the consent panel", async () => {
    const el = await fixture(
      html`<iframe-loader source="https://example.com/page"></iframe-loader>`,
    );
    const frame = el.querySelector("iframe");
    expect(frame.hasAttribute("src")).to.equal(false);
    expect(frame.getAttribute("data-hax-consent-src")).to.equal(
      "https://example.com/page",
    );
    const gate = el.shadowRoot.querySelector("hax-consent-gate");
    expect(gate).to.exist;
    expect(gate.getAttribute("service")).to.equal("embed:example.com");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("names Google Maps for a maps embed", async () => {
    const el = await fixture(
      html`<iframe-loader
        source="https://www.google.com/maps/embed?pb=1"
      ></iframe-loader>`,
    );
    expect(
      el.shadowRoot.querySelector("hax-consent-gate").getAttribute("service"),
    ).to.equal("google-maps");
  });

  it("loads in place once allowed and holds back again when withdrawn", async () => {
    const el = await fixture(
      html`<iframe-loader source="https://example.com/page"></iframe-loader>`,
    );
    HaxConsent.set("embed:example.com", "allow");
    await el.updateComplete;
    await aTimeout(0);
    const frame = el.querySelector("iframe");
    expect(frame.getAttribute("src")).to.equal("https://example.com/page");
    expect(el.shadowRoot.querySelector("hax-consent-gate")).to.not.exist;
    HaxConsent.set("embed:example.com", null);
    await el.updateComplete;
    await aTimeout(0);
    expect(frame.hasAttribute("src")).to.equal(false);
    expect(el.shadowRoot.querySelector("hax-consent-gate")).to.exist;
  });

  it("reads a frame HAXcms held back (data-hax-consent-src)", async () => {
    const el = await fixture(
      html`<iframe-loader
        ><iframe
          data-hax-consent-src="https://example.com/held"
          title="held"
        ></iframe
      ></iframe-loader>`,
    );
    expect(el.source).to.equal("https://example.com/held");
    expect(el.querySelector("iframe").hasAttribute("src")).to.equal(false);
    HaxConsent.set("embed:example.com", "allow");
    await el.updateComplete;
    await aTimeout(0);
    expect(el.querySelector("iframe").getAttribute("src")).to.equal(
      "https://example.com/held",
    );
  });

  it("same-origin sources need no consent", async () => {
    const el = await fixture(
      html`<iframe-loader source="/files/notes.txt"></iframe-loader>`,
    );
    expect(el.shadowRoot.querySelector("hax-consent-gate")).to.not.exist;
    expect(el.querySelector("iframe").getAttribute("src")).to.equal(
      "/files/notes.txt",
    );
  });
});
