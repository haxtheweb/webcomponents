import { fixture, expect, html } from "@open-wc/testing";
import "../moar-sarcasm.js";

describe("moar-sarcasm a11y label i18n", () => {
  it("default label follows translations until an author sets one", async () => {
    const el = await fixture(html`<moar-sarcasm>so cool</moar-sarcasm>`);
    expect(el.a11y).to.equal("the following is sarcastic:");
    el.t = { ...el.t, followingIsSarcastic: "lo siguiente es sarcástico:" };
    el._i18nUpdated();
    expect(el.a11y).to.equal("lo siguiente es sarcástico:");
    expect(el.shadowRoot.querySelector(".slot").textContent).to.include(
      "lo siguiente es sarcástico:",
    );
    // the sarcastic rendering is not wiped by a label change
    expect(el.shadowRoot.querySelector(".sarcastic").textContent).to.equal(
      "so cool",
    );
    el.a11y = "authored label";
    el.t = { ...el.t, followingIsSarcastic: "changed again" };
    el._i18nUpdated();
    expect(el.a11y).to.equal("authored label");
  });
  it("keeps an authored a11y attribute and renders it as text", async () => {
    const el = await fixture(
      html`<moar-sarcasm a11y="<b>not markup</b>">hi</moar-sarcasm>`,
    );
    const label = el.shadowRoot.querySelector(".a11y");
    expect(label.textContent).to.equal("<b>not markup</b>");
    expect(label.querySelector("b")).to.equal(null);
    el.t = { ...el.t, followingIsSarcastic: "translated" };
    el._i18nUpdated();
    expect(el.a11y).to.equal("<b>not markup</b>");
  });
});
