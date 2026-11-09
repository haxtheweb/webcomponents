// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import "../clean-two.js";

// haxtheweb/issues#3267: My learning in the icon rail
describe("clean-two learner progress", () => {
  it("puts a compact My learning button in the icon rail", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector("header.header my-learning-button");
    expect(btn).to.exist;
    expect(btn.hasAttribute("compact")).to.equal(true);
    expect(btn.getAttribute("part")).to.equal("my-learning-btn");
    expect(el.shadowRoot.querySelector("site-page-progress")).to.equal(null);
  });
});
