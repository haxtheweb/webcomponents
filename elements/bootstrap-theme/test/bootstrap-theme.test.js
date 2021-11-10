import { fixture, expect, html } from "@open-wc/testing";
import "../bootstrap-theme.js";
describe("bootstrap-theme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<bootstrap-theme></bootstrap-theme> `);
  });

  it("basic setup for testing the link case", async () => {
    // case 1 of the menu item
    expect(element).to.exist;
  });
});
