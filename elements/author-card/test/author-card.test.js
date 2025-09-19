import { html, fixture, expect } from '@open-wc/testing';
import "../author-card.js";

describe("AuthorCard test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <author-card
        title="title"
      ></author-card>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
