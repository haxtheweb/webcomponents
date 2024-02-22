import { fixture, expect, html } from "@open-wc/testing";
import "../micro-frontend-registry.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<micro-frontend-registry></micro-frontend-registry>`,
    );
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
