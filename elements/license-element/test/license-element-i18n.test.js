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
    // last in the shadow root, where :host::after used to render
    expect(el.shadowRoot.lastElementChild).to.equal(label);
    expect(getComputedStyle(el, "::after").content).to.equal("none");
    el.t = { ...el.t, licenseLabel: "Lizenz" };
    await el.updateComplete;
    expect(label.textContent).to.equal("Lizenz");
  });
});
