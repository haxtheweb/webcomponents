import { html, fixture, expect } from '@open-wc/testing';
import "../bibliography-builder.js";

describe("BibliographyBuilder test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <bibliography-builder
        title="title"
      ></bibliography-builder>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
