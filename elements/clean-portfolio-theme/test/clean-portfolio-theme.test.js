import { html, fixture, expect } from '@open-wc/testing';
import "../clean-portfolio-theme.js";

describe("CleanPortfolioTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <clean-portfolio-theme
        title="title"
      ></clean-portfolio-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
