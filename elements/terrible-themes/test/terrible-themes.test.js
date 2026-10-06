import { fixture, expect, html } from "@open-wc/testing";
import {
  forceThemeReveal,
  lockLightColorScheme,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../terrible-themes.js";

// audits of a fully rendered theme can legitimately exceed mocha's 2000ms
// default under test:all load; give the suite real headroom. Previously
// this a11y audit was disabled (see git history) to work around the
// rAF-gated opacity fade race documented in HAXCMSThemeA11yTestHelpers.js;
// it is re-enabled here using the shared harness instead of being left
// disabled.
describe("elementName test", function () {
  this.timeout(10000);
  let element;
  let restoreColorScheme;

  before(() => {
    restoreColorScheme = lockLightColorScheme();
  });

  after(() => {
    restoreColorScheme();
  });

  beforeEach(async () => {
    element = await fixture(html`<terrible-themes></terrible-themes>`);
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
