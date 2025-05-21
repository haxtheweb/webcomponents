import { html, fixture, expect } from '@open-wc/testing';
import "../glossy-portfolio-theme.js";

describe("GlossyPortfolioTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <glossy-portfolio-theme
        title="title"
      ></glossy-portfolio-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
