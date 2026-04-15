import { html, fixture, expect } from '@open-wc/testing';
import "../citation-builder.js";

describe("CitationBuilder test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <citation-builder
        title="title"
      ></citation-builder>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
