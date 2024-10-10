import { html, fixture, expect } from '@open-wc/testing';
import "../web-container.js";

describe("webContainer test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <web-container
        title="title"
      ></web-container>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
