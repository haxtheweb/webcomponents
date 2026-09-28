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

  it("passes the a11y audit", async function () {
    // d-d-docs renders every styleguide topic's DOM at once, so the axe-core
    // audit can exceed the default 2s mocha timeout, especially under coverage.
    this.timeout(10000);
    await expect(element).shadowDom.to.be.accessible();
  });
});
