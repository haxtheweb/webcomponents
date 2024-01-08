import { fixture, expect, html } from "@open-wc/testing";
import "../d-d-d.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<d-d-d></d-d-d>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
