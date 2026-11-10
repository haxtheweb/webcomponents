// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import "../training-theme.js";

// haxtheweb/issues#3267: My learning under the theme's own progress card
describe("training-theme learner progress", () => {
  it("renders My learning in the sidebar after the progress card", async () => {
    const el = await fixture(html`<training-theme></training-theme>`);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector(
      "aside.training-column .learning my-learning-button",
    );
    expect(btn).to.exist;
    expect(btn.getAttribute("part")).to.equal("my-learning-btn");
    // it is never inside the progressbar (its children are presentational)
    expect(btn.closest('[role="progressbar"]')).to.equal(null);
    expect(el.shadowRoot.querySelector("site-rss-button")).to.equal(null);
  });
});
