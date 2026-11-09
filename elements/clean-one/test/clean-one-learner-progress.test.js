// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import "../clean-one.js";

// haxtheweb/issues#3267: My learning replaces the activities bar under the title
describe("clean-one learner progress", () => {
  it("no longer renders the activities done bar under the page title", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("site-page-progress")).to.equal(null);
  });

  it("puts My learning in the toolbar row next to Print / PDF", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector(
      ".site-header .pull-left my-learning-button",
    );
    expect(btn).to.exist;
    expect(btn.hasAttribute("compact")).to.equal(false);
    expect(btn.getAttribute("part")).to.equal("my-learning-btn");
  });

  it("has a bottom-left My learning for mobile, hidden on wide layouts", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    await el.updateComplete;
    const mobile = el.shadowRoot.querySelector(
      "footer my-learning-button.learning-btn-mobile",
    );
    expect(mobile).to.exist;
    // the footer holds it before the page navigation cluster
    expect(mobile.nextElementSibling.tagName).to.equal("NAV");
    if (globalThis.innerWidth >= 1024) {
      expect(getComputedStyle(mobile).display).to.equal("none");
    }
  });
});
