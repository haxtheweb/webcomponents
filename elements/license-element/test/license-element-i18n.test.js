import { fixture, expect, html } from "@open-wc/testing";
import "../license-element.js";

describe("license-element label i18n", () => {
  it("renders the License tag as real text from this.t", async () => {
    const el = await fixture(
      html`<license-element title="Work" license="by"></license-element>`,
    );
    const label = el.shadowRoot.querySelector(".license-label");
    expect(label).to.exist;
    expect(label.textContent).to.equal("License");
    // DDD eyebrow: first visible line of the card (after the RDFa meta
    // tags); compare as a boolean so a failure cannot try to serialize
    // the DOM nodes
    const body = el.shadowRoot.querySelector(".license-body");
    expect(body.querySelector(":scope > :not(meta)") === label).to.be.true;
    expect(getComputedStyle(el, "::after").content).to.equal("none");
    el.t = { ...el.t, licenseLabel: "Lizenz" };
    await el.updateComplete;
    expect(label.textContent).to.equal("Lizenz");
  });
});
