import { fixture, expect, html } from "@open-wc/testing";
import "../barcode-reader.js";
describe("barcode-reader test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<barcode-reader
      scale="50"
      ?hideinput="${true}"
    ></barcode-reader> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
