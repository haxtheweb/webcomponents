import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-builder.js";
import "../lib/core/haxcms-site-editor-ui.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// HAXcms asks for Google Analytics consent whenever a site has a gaID, and
// signed-in users can change every choice from the user menu
const manifest = (gaID, slugs = []) => ({
  metadata: { site: { settings: gaID ? { gaID: gaID } : {} } },
  items: slugs.map((slug, i) => ({ id: "item-" + i, slug: slug })),
});
const bar = () =>
  globalThis.document.querySelector('hax-consent-gate[variant="bar"]');

describe("haxcms-site-builder Google Analytics consent", () => {
  let builder;
  beforeEach(() => {
    HaxConsent.clearAll();
    HaxConsent.choicesUrl = null;
    builder = globalThis.document.createElement("haxcms-site-builder");
  });
  afterEach(() => {
    if (bar()) {
      bar().remove();
    }
    HaxConsent.clearAll();
  });

  it("shows the bar when the site has a gaID and no choice was made", async () => {
    await builder._consentGate(manifest("G-ABC123"));
    expect(bar()).to.exist;
    expect(bar().getAttribute("service")).to.equal("google-analytics");
    // first in the tab order
    expect(globalThis.document.body.firstElementChild).to.equal(bar());
  });

  it("shows nothing without a gaID, or once a choice is made", async () => {
    await builder._consentGate(manifest(null));
    expect(bar()).to.not.exist;
    HaxConsent.set("google-analytics", "deny");
    await builder._consentGate(manifest("G-ABC123"));
    expect(bar()).to.not.exist;
  });

  it("links privacy choices to the site's privacy page when it has one", async () => {
    await builder._consentGate(manifest("G-ABC123", ["welcome", "privacy"]));
    expect(HaxConsent.choicesUrl).to.equal("privacy");
    await builder._consentGate(manifest("G-ABC123", ["welcome"]));
    expect(HaxConsent.choicesUrl).to.equal(null);
  });

  it("takes the bar down when the gaID is removed, and never adds two", async () => {
    await builder._consentGate(manifest("G-ABC123"));
    await builder._consentGate(manifest("G-ABC123"));
    expect(
      globalThis.document.querySelectorAll('hax-consent-gate[variant="bar"]')
        .length,
    ).to.equal(1);
    await builder._consentGate(manifest(null));
    expect(bar()).to.not.exist;
  });
});

describe("haxcms-site-editor-ui Privacy choices menu item", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`,
    );
    await aTimeout(0);
  });

  it("sits in the main menu after the character", () => {
    const menu = element.shadowRoot.querySelector("#user-menu");
    const items = [...menu.querySelectorAll('[slot="main-menu"]')].map(
      (n) => n.getAttribute("part") || n.tagName.toLowerCase(),
    );
    expect(items.indexOf("privacychoicesbtn")).to.equal(
      items.indexOf("customizecharacterbtn") + 1,
    );
    expect(
      element.shadowRoot
        .querySelector("#privacychoicesbtn")
        .getAttribute("label"),
    ).to.equal("Privacy choices");
  });

  it("opens privacy-choices in a dialog", async () => {
    let detail = null;
    const grab = (e) => {
      detail = e.detail;
      e.stopImmediatePropagation();
    };
    globalThis.addEventListener("simple-modal-show", grab, { capture: true });
    try {
      element.shadowRoot.querySelector("#privacychoicesbtn").click();
      for (let i = 0; i < 50 && !detail; i++) {
        await aTimeout(20);
      }
    } finally {
      globalThis.removeEventListener("simple-modal-show", grab, {
        capture: true,
      });
    }
    expect(detail).to.not.equal(null);
    expect(detail.title).to.equal("Privacy choices");
    expect(detail.modal).to.equal(true);
    expect(detail.elements.content.tagName.toLowerCase()).to.equal(
      "privacy-choices",
    );
  });
});
