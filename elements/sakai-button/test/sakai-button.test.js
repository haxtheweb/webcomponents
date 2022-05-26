import { fixture, expect, html } from "@open-wc/testing";
import "../sakai-button.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<sakai-button></sakai-button>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
