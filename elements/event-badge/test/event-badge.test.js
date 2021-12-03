import { fixture, expect, html } from "@open-wc/testing";

import "../event-badge.js";

describe("event-badge test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <event-badge></event-badge> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
