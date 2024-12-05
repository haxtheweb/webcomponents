import { html, fixture, expect } from '@open-wc/testing';
import "../d-d-docs.js";

describe("DDDocs test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <d-d-docs
        title="title"
      ></d-d-docs>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
