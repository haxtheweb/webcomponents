import { fixture, expect, html } from "@open-wc/testing";
import "../user-scaffold.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<user-scaffold></user-scaffold>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
