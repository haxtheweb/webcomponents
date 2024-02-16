import { fixture, expect, html } from "@open-wc/testing";

import "../place-holder.js";

describe("place-holder test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <place-holder title="audio"></place-holder>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
