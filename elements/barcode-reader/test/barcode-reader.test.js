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

  it("basic setup for testing the link case", async () => {
    // case 1 of the menu item
    expect(element).to.exist;
  });
});
