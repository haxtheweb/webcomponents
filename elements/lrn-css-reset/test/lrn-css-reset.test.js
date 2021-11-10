import { fixture, expect, html } from "@open-wc/testing";
import "../lrn-css-reset.js";
describe("CSS Reset", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <lrn-css-reset></lrn-css-reset> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
