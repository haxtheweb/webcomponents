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
      description: "A reflective companion for training.",
      metadata: {
        platform: {},
        theme: { variables: {} },
        author: {
          image: "",
          name: "Example Teaching Center",
          email: "teaching@example.edu",
          socialLink: "",
        },
      },
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
        {
          id: "p2",
          title: "Page Two",
          slug: "page-two",
          location: "pages/page-two/index.html",
          order: 2,
          parent: null,
          indent: 0,
          metadata: { published: true, locked: false, status: "" },
        },
        {
          id: "p3",
          title: "Page Three",
          slug: "page-three",
          location: "pages/page-three/index.html",
          order: 3,
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

  it("renders sidebar branding from the manifest", async () => {
    expect(
      element.shadowRoot.querySelector(".sidebar-title").textContent.trim(),
    ).to.equal("Training Test Site");
    expect(
      element.shadowRoot.querySelector(".sidebar-subtitle").textContent.trim(),
    ).to.equal("A reflective companion for training.");
    expect(
      element.shadowRoot.querySelector(".eyebrow").textContent.trim(),
    ).to.equal("Example Teaching Center");
    // author metadata flows into the sidebar footer
    const footer = element.shadowRoot.querySelector(".sidebar-footer");
    expect(footer).to.exist;
    const mailto = footer.querySelector("a[href]");
    expect(mailto.getAttribute("href")).to.equal("mailto:teaching@example.edu");
  });

  it("renders the progress ring from the manifest outline", async () => {
    const progress = element.shadowRoot.querySelector(".progress");
    expect(progress).to.exist;
    expect(progress.getAttribute("role")).to.equal("progressbar");
    // maxIndex stays at 0 with no active item, so 1 of 3 pages viewed
    expect(progress.getAttribute("aria-valuemin")).to.equal("0");
    expect(progress.getAttribute("aria-valuenow")).to.equal("1");
    expect(progress.getAttribute("aria-valuemax")).to.equal("3");
    expect(
      element.shadowRoot.querySelector(".ring-count").textContent.trim(),
    ).to.equal("1");
  });
});
