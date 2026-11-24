import { fixture, expect, html } from "@open-wc/testing";
import { LinkedinEmbed } from "../linkedin-embed.js";

// LinkedIn no longer serves embeddable profile badges, so the element is a
// plain profile link that loads nothing from LinkedIn
const haxSchema = async (C) => {
  const hp = C.haxProperties;
  return typeof hp === "string" ? (await fetch(hp)).json() : hp;
};

describe("linkedin-embed", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<linkedin-embed vanityname="btopro"></linkedin-embed>`,
    );
  });

  it("is an instance of LinkedinEmbed with the right tag", () => {
    expect(element).to.be.instanceOf(LinkedinEmbed);
    expect(LinkedinEmbed.tag).to.equal("linkedin-embed");
  });

  it("renders a link to the profile that opens in a new tab", () => {
    const link = element.shadowRoot.querySelector("a");
    expect(link.getAttribute("href")).to.equal(
      "https://www.linkedin.com/in/btopro",
    );
    expect(link.getAttribute("target")).to.equal("_blank");
    expect(link.getAttribute("rel")).to.include("noopener");
    expect(link.textContent.trim()).to.equal("View btopro on LinkedIn");
  });

  it("loads nothing from LinkedIn", () => {
    expect(element.shadowRoot.querySelector("iframe")).to.not.exist;
    expect(element.shadowRoot.querySelector("hax-consent-gate")).to.not.exist;
    expect(globalThis.document.querySelector('script[src*="linkedin"]')).to.not
      .exist;
  });

  it("normalizes a full profile address", async () => {
    element.vanityname = "https://www.linkedin.com/in/someone/";
    await element.updateComplete;
    await element.updateComplete;
    expect(element.vanityname).to.equal("someone");
    expect(element.shadowRoot.querySelector("a").getAttribute("href")).to.equal(
      "https://www.linkedin.com/in/someone",
    );
  });

  it("falls back to the default name for empty values", async () => {
    element.vanityname = "";
    await element.updateComplete;
    await element.updateComplete;
    expect(element.vanityname).to.equal("btopro");
  });

  it("encodes the name in the profile address", async () => {
    element.vanityname = "a b?c";
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("a").getAttribute("href")).to.equal(
      "https://www.linkedin.com/in/a%20b%3Fc",
    );
  });

  it("keeps the locale attribute content already uses", async () => {
    const el = await fixture(
      html`<linkedin-embed vanityname="x" locale="fr_FR"></linkedin-embed>`,
    );
    expect(el.locale).to.equal("fr_FR");
    expect(el.shadowRoot.querySelector("a")).to.exist;
  });

  it("stops the link from navigating while editing in HAX", async () => {
    expect(element.haxHooks().editModeChanged).to.equal("haxeditModeChanged");
    element.haxeditModeChanged(true);
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("a.is-editing")).to.exist;
    element.haxeditModeChanged(false);
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("a.is-editing")).to.not.exist;
    expect(element.haxactiveElementChanged(element, true)).to.equal(element);
  });

  it("is hidden from the HAX tray", async () => {
    const schema = await haxSchema(LinkedinEmbed);
    expect(schema.gizmo.meta.hidden).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
