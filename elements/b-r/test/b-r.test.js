import { fixture, expect, html } from "@open-wc/testing";
import "../b-r.js";
describe("b-r test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <b-r amount="22"></b-r> `);
  });

  it("test that 22 brs are there", async () => {
    expect(element).to.exist;
    expect(element.amount).to.equal(22);
    expect(element.shadowRoot.querySelectorAll("br").length).to.equal(22);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
