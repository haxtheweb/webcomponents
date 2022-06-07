import { fixture, expect, html } from "@open-wc/testing";
import "../simple-img.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<simple-img></simple-img>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
