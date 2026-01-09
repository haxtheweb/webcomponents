import { html, fixture, expect } from '@open-wc/testing';
import "../demo-snippet.js";

describe("DemoSnippet test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <demo-snippet
        title="title"
      ></demo-snippet>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
