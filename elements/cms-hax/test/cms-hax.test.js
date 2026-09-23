import { fixture, expect, html } from "@open-wc/testing";

import "../cms-hax.js";

describe("cms-hax test", () => {
  let element;
  const storeUrl = new URL("../demo/sample-store.json", import.meta.url).href;

  beforeEach(async () => {
    // attribute is entity encoded on purpose, matching how CMSs wire this
    // element up; decodeHTMLEntities converts it back to JSON internally
    element = await fixture(
      html`<cms-hax
        app-store-connection=${`{&quot;url&quot;:&quot;${storeUrl}&quot;}`}
      ></cms-hax>`,
    );
    await element.updateComplete;
  });

  it("renders an h-a-x element wired to the app store", async () => {
    const hax = element.shadowRoot.querySelector("h-a-x");
    expect(hax).to.exist;
    await element.updateComplete;
    expect(hax.getAttribute("app-store")).to.include(storeUrl);
  });

  it("has expected default properties", () => {
    expect(element.method).to.equal("PUT");
    expect(element.elementAlign).to.equal("left");
    expect(element.openDefault).to.be.false;
    expect(element.hidePanelOps).to.be.false;
    expect(element.syncBody).to.be.false;
    expect(element.hideMessage).to.be.false;
  });

  it("decodes HTML entities in the app store connection", () => {
    expect(element.__appStore).to.equal(`{"url":"${storeUrl}"}`);
    expect(element.decodeHTMLEntities("&amp;&lt;&gt;&quot;&apos;")).to.equal(
      "&<>\"'",
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
