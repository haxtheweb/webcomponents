import { fixture, expect, html } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  forceThemeReveal,
  lockLightThemeEnvironment,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../training-theme.js";

// audits of a fully rendered theme can legitimately exceed mocha's 2000ms
// default under test:all load; give the suite real headroom
describe("elementName test", function () {
  this.timeout(10000);
  let element;
  let savedManifest;
  let savedActiveId;
  let restoreThemeEnvironment;

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    // Lock dark mode + the light-dark() CSS color scheme so this theme's
    // styles resolve deterministically regardless of the host OS/browser's
    // prefers-color-scheme (see HAXCMSThemeA11yTestHelpers.js).
    restoreThemeEnvironment = lockLightThemeEnvironment(store);
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
    restoreThemeEnvironment();
  });

  beforeEach(async () => {
    element = await fixture(html`<training-theme></training-theme>`);
    await element.updateComplete;
    // deterministically reveal the theme (see HAXCMSThemeA11yTestHelpers.js)
    // so audits never race the rAF gate or the opacity fade
    await forceThemeReveal(element);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
