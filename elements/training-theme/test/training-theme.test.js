import { fixture, expect, html } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "../training-theme.js";

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
describe("elementName test", function () {
  this.timeout(10000);
  let element;
  let savedManifest;
  let savedActiveId;
  let savedDarkMode;
  let savedColorScheme;

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    savedDarkMode = store.darkMode;
    store.darkMode = false;
    // Lock the test page to a light color scheme so the light-dark() CSS
    // function used throughout this theme resolves to its light (dark-text
    // on light-background) values. Without this, headless Chromium may
    // inherit the system prefers-color-scheme and resolve light-dark() to
    // near-white text on white, producing a flaky color-contrast violation.
    savedColorScheme = document.documentElement.style.colorScheme;
    document.documentElement.style.colorScheme = "light";
    store.manifest = {
      id: "training-test",
      title: "Training Test Site",
      metadata: { platform: {}, theme: { variables: {} } },
      items: [
        {
          id: "p1",
          title: "Page One",
          slug: "page-one",
          location: "pages/page-one/index.html",
          order: 1,
          parent: null,
          indent: 0,
          metadata: { published: true, locked: false, status: "" },
        },
      ],
    };
    store.activeId = null;
  });

  after(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
    store.darkMode = savedDarkMode;
    if (savedColorScheme === "") {
      document.documentElement.style.removeProperty("color-scheme");
    } else {
      document.documentElement.style.colorScheme = savedColorScheme;
    }
  });

  beforeEach(async () => {
    element = await fixture(html`<training-theme></training-theme>`);
    await element.updateComplete;
    // deterministically reveal the theme (see forceThemeReveal above) so
    // audits never race the rAF gate or the opacity fade
    await forceThemeReveal(element);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
