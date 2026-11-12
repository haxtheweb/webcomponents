import { html, fixture, expect } from "@open-wc/testing";
import "../hax-network-bar.js";

describe("hax-network-bar", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<hax-network-bar current="elements"></hax-network-bar>`,
    );
  });

  it("links every site in the network", async () => {
    const links = element.shadowRoot.querySelectorAll(".sites a");
    expect(links.length).to.equal(5);
    expect(links[0].getAttribute("href")).to.equal("https://hax.cloud");
  });

  it("marks only the current site", async () => {
    const current = element.shadowRoot.querySelectorAll(
      'a[aria-current="page"]',
    );
    expect(current.length).to.equal(1);
    expect(current[0].textContent.trim()).to.equal("Elements");
  });

  it("marks nothing when current names no site", async () => {
    element.current = "";
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelectorAll('a[aria-current="page"]').length,
    ).to.equal(0);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
