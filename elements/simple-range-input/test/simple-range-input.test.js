import { fixture, expect, html } from "@open-wc/testing";
import "../simple-range-input.js";
describe("Image comparison", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <simple-range-input
        accent-color="blue"
        label="Range input"
        style="--simple-range-input-track-height:15px"
      ></simple-range-input>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
