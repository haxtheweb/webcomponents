import { fixture, expect, html } from "@open-wc/testing";
import "../lib/ui-components/site/site-search.js";

describe("site-search accessibility", () => {
  it("names the search field and only uses allowed ARIA", async () => {
    const el = await fixture(html`<site-search></site-search>`);
    await el.updateComplete;
    const field = el.shadowRoot.querySelector("#search");
    expect(field.getAttribute("role")).to.equal("searchbox");
    expect(field.hasAttribute("aria-expanded")).to.equal(false);
    expect(field.getAttribute("aria-label")).to.not.equal("");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("points at the results only while there are results", async () => {
    const el = await fixture(html`<site-search></site-search>`);
    const field = el.shadowRoot.querySelector("#search");
    expect(field.hasAttribute("aria-controls")).to.equal(false);
    el.__results = [{ title: "Leaf", location: "leaf", description: "" }];
    el.search = "leaf";
    await el.updateComplete;
    expect(field.getAttribute("aria-controls")).to.equal("search-results");
    expect(el.shadowRoot.querySelector("#search-results")).to.exist;
  });
});
