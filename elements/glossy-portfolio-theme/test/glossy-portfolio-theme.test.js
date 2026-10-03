import { html, fixture, expect } from "@open-wc/testing";
import "../glossy-portfolio-theme.js";

// HAXCMSLitElementTheme gates every theme behind theme-ready (visibility)
// and then fades the host in with a 0.6s opacity transition. That reveal is
// rAF-gated, and headless test sessions share one browser where inactive
// pages can starve requestAnimationFrame entirely (deferring the fade
// indefinitely), while active pages race the audit through the fade:
// axe-core's color-contrast check blends text color with the element
// opacity, so an audit mid-fade reports bogus near-white foreground colors
// (e.g. #fdfdfd on #ffffff) as false color-contrast violations. Auditing
// before theme-ready is just as wrong: content is still visibility:hidden
// so axe skips it and the audit passes vacuously. Disable the fade and flip
// the gate directly so every audit runs against fully revealed content; the
// natural rAF-gated reveal timing stays covered by HAXCMSLitElementTheme's
// own test suite.
async function forceThemeReveal(element) {
  element.style.setProperty("transition", "none");
  element.themeReady = true;
  await element.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
}

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
