import { fixture, expect, html } from "@open-wc/testing";
import "../lesson-overview.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<lesson-overview></lesson-overview>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
