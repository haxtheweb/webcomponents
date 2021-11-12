import { fixture, expect, html } from "@open-wc/testing";
import "../bootstrap-theme.js";
describe("bootstrap-theme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<bootstrap-theme></bootstrap-theme> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
