import { html, fixture, expect } from '@open-wc/testing';
import "../spacebook-theme.js";

describe("SpacebookTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <spacebook-theme
        title="title"
      ></spacebook-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
