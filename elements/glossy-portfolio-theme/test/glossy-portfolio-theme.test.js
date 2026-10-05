import { html, fixture, expect } from "@open-wc/testing";
import { forceThemeReveal } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../glossy-portfolio-theme.js";

// audits of a fully rendered theme can legitimately exceed mocha's 2000ms
// default under test:all load; give the suite real headroom
describe("GlossyPortfolioTheme test", function () {
  this.timeout(10000);
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <glossy-portfolio-theme title="title"></glossy-portfolio-theme>
    `);
    await element.updateComplete;
    await forceThemeReveal(element);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
