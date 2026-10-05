import { html, fixture, expect } from "@open-wc/testing";
import {
  forceThemeReveal,
  lockLightColorScheme,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../clean-portfolio-theme.js";

// audits of a fully rendered theme can legitimately exceed mocha's 2000ms
// default under test:all load; give the suite real headroom
describe("CleanPortfolioTheme test", function () {
  this.timeout(10000);
  let element;
  let restoreColorScheme;

  before(() => {
    // Lock the light-dark() CSS color scheme so this theme's styles
    // resolve deterministically regardless of the host OS/browser's
    // prefers-color-scheme (see HAXCMSThemeA11yTestHelpers.js).
    restoreColorScheme = lockLightColorScheme();
  });

  after(() => {
    restoreColorScheme();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <clean-portfolio-theme title="title"></clean-portfolio-theme>
    `);
    await element.updateComplete;
    // deterministically reveal the theme so the audit never races the
    // rAF-gated opacity fade (see HAXCMSThemeA11yTestHelpers.js)
    await forceThemeReveal(element);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
