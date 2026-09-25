import { html, fixture, expect } from '@open-wc/testing';
import "../haxma-theme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

describe("HaxmaTheme test", () => {
  let element;
  let savedManifest;
  let savedActiveId;
  let savedDarkMode;

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    savedDarkMode = store.darkMode;
    store.darkMode = false;
    store.manifest = {
      id: "haxma-test",
      title: "HAXma Test Site",
      description: "HAXma test site",
      metadata: {
        site: { name: "haxma-test" },
        platform: {},
        theme: { variables: {} },
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
      ],
    };
    store.activeId = null;
  });

  after(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
    store.darkMode = savedDarkMode;
  });

  beforeEach(async () => {
    element = await fixture(html`
      <haxma-theme
        title="title"
      ></haxma-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    // skip-link is ignored because axe-core resolves skip-link hrefs via
    // document.getElementById(), which cannot pierce shadow DOM. The
    // #contentcontainer target exists and is focusable (tabindex="-1") in
    // the shadow DOM, but axe cannot find it. This is an axe limitation,
    // not a code defect.
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});
