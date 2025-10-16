import { fixture, expect, html } from "@open-wc/testing";

import "../product-glance.js";
import { ProductGlance } from "../product-glance.js";

describe("product-glance minimal test", () => {
  it("should be defined as a custom element", () => {
    expect(customElements.get("product-glance")).to.exist;
  });

  it("should create an instance", async () => {
    const element = await fixture(html`<product-glance></product-glance>`);
    expect(element).to.exist;
    expect(element instanceof ProductGlance).to.be.true;
  });

  it("should have shadow DOM", async () => {
    const element = await fixture(html`<product-glance></product-glance>`);
    expect(element.shadowRoot).to.exist;
  });

  it("should set title property", async () => {
    const element = await fixture(
      html`<product-glance title="test"></product-glance>`,
    );
    expect(element.title).to.equal("test");
  });
});
