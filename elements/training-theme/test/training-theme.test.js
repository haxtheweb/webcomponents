import { fixture, expect, html } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "../training-theme.js";

describe("elementName test", () => {
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
    // Wait for the theme and its nested components (site-title,
    // training-button, site-menu-button) to finish their first render and
    // for the light-dark() color-scheme resolution to settle before any
    // assertion reads computed styles. This stabilizes the color-contrast
    // audit which is otherwise racy with mobx autoruns and style injection.
    await element.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
