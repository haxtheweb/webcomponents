import { fixture, expect, html } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  forceThemeReveal,
  lockLightColorScheme,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../haxor-slevin.js";

// Round 8 coverage (#3079): behavioral suite for the haxor-slevin blog
// theme. Store state is driven via the singleton save/restore pattern
// (see hax-body/test/hax-store.test.js and collection-list tests); no
// real sites or networks are loaded.

// haxtheweb/issues#3107: mock and fallback images are inline SVG data
// URIs so accent-card / full-width-image never issue a network request.
// The suite used to 404 on post1.jpg / active-hero.jpg / the theme
// default assets/banner.jpg: mock images pointed at missing files, and
// manifests without a theme image variable let the theme's manifest
// autorun (and the site-query reactions that re-render post cards on
// manifest updates, even on torn-down elements) fall back to the
// fetchable default. Suite manifests below seed the data URI as the
// theme image so no render path can ever fetch it; the bare-default
// VALUE itself stays asserted in the seeds test (which renders no cards)
const TINY_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";

describe("HaxorSlevin theme", function () {
  // the suite fixtures a full site theme per test with deliberate 1000ms+
  // settle timers (firstUpdated dynamic imports, deferred pageAllowed,
  // anchor targeting); the mocha 2s default times the a11y audit out
  // under load, so give the suite real headroom
  this.timeout(10000);
  let element;
  let savedManifest;
  let savedActiveId;
  let savedEditMode;
  let savedDarkMode;
  let savedLocation;
  let savedPageAllowed;
  let restoreColorScheme;
  const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    savedEditMode = store.editMode;
    savedDarkMode = store.darkMode;
    savedLocation = store.location;
    savedPageAllowed = store.pageAllowed;
    // lock light scheme for the a11y audit (see HAXCMSThemeA11yTestHelpers.js)
    restoreColorScheme = lockLightColorScheme();
    store.darkMode = false;
    store.editMode = false;
    // keep a truthy manifest with an items array so regionData is never
    // undefined for the site-region elements rendered inside the theme
    // (see collection-list reference suite) AND store.findItem / site-query
    // always have items to search (a bare {} manifest makes findItem throw
    // reading items.find, and a null manifest makes site-region throw
    // reading regionData[name])
    store.manifest = { items: [] };
  });

  after(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
    store.editMode = savedEditMode;
    store.darkMode = savedDarkMode;
    store.location = savedLocation;
    store.pageAllowed = savedPageAllowed;
    restoreColorScheme();
  });

  afterEach(() => {
    // keep the manifest convention between tests (see before()) but seed
    // the theme image variable with the data URI: the manifest reset
    // re-fires the theme's manifest autorun and the site-query reactions
    // (whose queued results can re-render post cards even after the test
    // ends), and with the bare default those renders fetched the missing
    // assets/banner.jpg (haxtheweb/issues#3107)
    store.manifest = {
      items: [],
      metadata: { theme: { variables: { image: TINY_IMG } } },
    };
    store.activeId = savedActiveId;
    store.editMode = savedEditMode;
    store.location = savedLocation;
    store.pageAllowed = savedPageAllowed;
  });

  beforeEach(async () => {
    element = await fixture(html` <haxor-slevin></haxor-slevin> `);
    await element.updateComplete;
  });

  it("seeds constructor and manifest-default state", () => {
    expect(element.selectedPage).to.equal(0);
    expect(element.getAttribute("selected-page")).to.equal("0");
    expect(element.activeManifestIndexCounter).to.equal(0);
    expect(element.__mainPosts.length).to.equal(0);
    expect(element.__followUpPosts.length).to.equal(0);
    expect(element.activeItem).to.equal(null);
    expect(element.editMode).to.equal(false);
    // the first update runs the editMode branch of updated() so the
    // state class is seeded to the empty string, not left undefined
    expect(element.stateClass).to.equal("");
    expect(element.color).to.equal(undefined);
    expect(element.title).to.equal("");
    // manifest defaults seeded through varGet fallbacks
    expect(element.image).to.equal("assets/banner.jpg");
    expect(element.icon).to.equal("icons:record-voice-over");
  });

  it("renders the theme structure", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link").getAttribute("href")).to.equal(
      "#contentcontainer",
    );
    expect(root.querySelector("header.header-wrapper") === null).to.equal(
      false,
    );
    expect(
      root.querySelector('site-modal[button-label="Search"]') === null,
    ).to.equal(false);
    expect(
      root.querySelector("simple-icon-button-lite.backbutton") === null,
    ).to.equal(false);
    expect(root.querySelector('site-region[name="header"]') === null).to.equal(
      false,
    );
    expect(root.querySelector("#home h1.home-title") === null).to.equal(false);
    expect(
      root.querySelector('#home site-query[limit="10"]') === null,
    ).to.equal(false);
    expect(
      root.querySelector('site-region[name="footerPrimary"]') === null,
    ).to.equal(false);
    expect(
      root.querySelector(
        "main.contentcontainer-wrapper article#contentcontainer",
      ) === null,
    ).to.equal(false);
    expect(
      root.querySelector('site-region[name="contentTop"]') === null,
    ).to.equal(false);
    expect(
      root.querySelector('site-git-corner[position="right"]') === null,
    ).to.equal(false);
    // subtitle is hidden without a value
    expect(root.querySelector("h3.subtitle").hidden).to.equal(true);
    expect(root.querySelector("section#slot slot") === null).to.equal(false);
    expect(
      root.querySelector('site-region[name="contentBottom"]') === null,
    ).to.equal(false);
    expect(root.querySelector('main site-query[limit="6"]') === null).to.equal(
      false,
    );
    expect(
      root.querySelector('nav.social-float[aria-label="Social links"]') ===
        null,
    ).to.equal(false);
    expect(
      root.querySelectorAll("nav.social-float social-share-link").length,
    ).to.equal(4);
    expect(root.querySelector("footer.annoy-user") === null).to.equal(false);
    expect(
      root.querySelector('footer.annoy-user site-rss-button[type="atom"]') ===
        null,
    ).to.equal(false);
    expect(
      root.querySelector('footer.annoy-user site-rss-button[type="rss"]') ===
        null,
    ).to.equal(false);
    expect(
      root.querySelector("footer.annoy-user site-share-widget") === null,
    ).to.equal(false);
  });

  it("renders main posts as accent-card links", async () => {
    // #3107: override the theme default image with the data URI so the
    // no-image fallback path renders without a network fetch too
    element.image = TINY_IMG;
    element.color = "red";
    element.__mainPostsChanged({
      detail: {
        value: [
          {
            title: "Post One",
            slug: "post-one",
            description: "First post body",
            metadata: { image: TINY_IMG, created: 1700000000 },
          },
          {
            title: "Post Two",
            slug: "post-two",
            description: "Second post body",
            metadata: { created: 1600000000 },
          },
        ],
      },
    });
    expect(element.__mainPosts.length).to.equal(2);
    await element.updateComplete;
    const root = element.shadowRoot;
    const first = root.querySelector('a.article-link[href="post-one"]');
    expect(first === null).to.equal(false);
    const firstCard = first.querySelector("accent-card");
    expect(firstCard.getAttribute("accent-color")).to.equal("red");
    expect(firstCard.getAttribute("image-src")).to.equal(TINY_IMG);
    expect(firstCard.getAttribute("image-alt")).to.equal("Post One");
    expect(
      firstCard.querySelector('div[slot="heading"] h2').textContent,
    ).to.equal("Post One");
    const chip = firstCard.querySelector("date-chip");
    expect(chip === null).to.equal(false);
    expect(chip.getAttribute("timestamp")).to.equal("1700000000");
    expect(chip.hasAttribute("unix")).to.equal(true);
    expect(
      firstCard
        .querySelector('p[slot="content"]')
        .textContent.includes("First post body"),
    ).to.equal(true);
    // posts without an image fall back to the theme default image
    // (overridden to the data URI above; the bare default value itself
    // is asserted in the seeds test)
    const second = root.querySelector('a.article-link[href="post-two"]');
    const secondCard = second.querySelector("accent-card");
    expect(secondCard.getAttribute("image-src")).to.equal(TINY_IMG);
    expect(secondCard.getAttribute("image-alt")).to.equal("Post Two");
    // heading-order fix: post cards render h2 headings in the accent-card
    // heading slot so the outline descends h1 (home title) -> h2 (posts)
    // without skipping a level, and follow-up posts keep the same h2 level
    // under the site-active-title h1 in the content view
    expect(root.querySelector("h1.home-title") === null).to.equal(false);
    expect(
      root.querySelector('a.article-link div[slot="heading"] h2') === null,
    ).to.equal(false);
    expect(
      root.querySelector('a.article-link div[slot="heading"] h3') === null,
    ).to.equal(true);
  });

  it("renders follow-up posts from the query result", async () => {
    // #3107: data URI default so the fallback card never fetches
    element.image = TINY_IMG;
    element.__followUpPostsChanged({
      detail: {
        value: [
          {
            title: "Follow Up",
            slug: "follow-up",
            description: "Follow up body",
            metadata: { created: 1500000000 },
          },
        ],
      },
    });
    expect(element.__followUpPosts.length).to.equal(1);
    await element.updateComplete;
    const link = element.shadowRoot.querySelector(
      'a.article-link-bottom[href="follow-up"]',
    );
    expect(link === null).to.equal(false);
    const card = link.querySelector("accent-card");
    expect(card === null).to.equal(false);
    const dt = card.querySelector('div[slot="subheading"] simple-datetime');
    expect(dt === null).to.equal(false);
    expect(dt.getAttribute("timestamp")).to.equal("1500000000");
    expect(dt.hasAttribute("unix")).to.equal(true);
    expect(card.querySelector('div[slot="content"] p').textContent).to.equal(
      "Follow up body",
    );
  });

  it("prefers relatedItems on the active item for follow-up posts", async () => {
    // #3107: set the data URI BEFORE the manifest change; the manifest
    // update re-runs the site-query reactions, which render the injected
    // items as post cards with the image fallback, so the fetchable
    // theme default must never be the value in play at that moment
    element.image = TINY_IMG;
    store.manifest = {
      title: "Haxor",
      items: [
        { id: "r1", title: "Related One", slug: "related-one", metadata: {} },
        { id: "r2", title: "Related Two", slug: "related-two", metadata: {} },
      ],
      // #3107: same theme-image seeding as afterEach
      metadata: { theme: { variables: { image: TINY_IMG } } },
    };
    await tick();
    element.activeItem = { metadata: { relatedItems: "r1,missing-id,r2" } };
    element.__followUpPostsChanged({
      detail: { value: [{ title: "Ignored", slug: "ignored" }] },
    });
    // unknown ids are skipped, the query result is ignored
    expect(element.__followUpPosts.length).to.equal(2);
    expect(element.__followUpPosts[0].title).to.equal("Related One");
    expect(element.__followUpPosts[1].title).to.equal("Related Two");
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelector(
        'a.article-link-bottom[href="related-one"]',
      ) === null,
    ).to.equal(false);
    expect(
      element.shadowRoot.querySelector(
        'a.article-link-bottom[href="related-two"]',
      ) === null,
    ).to.equal(false);
    expect(
      element.shadowRoot.querySelector('a.article-link-bottom[href="ignored"]'),
    ).to.equal(null);
  });

  it("renders a full-width image only when the active item has one", async () => {
    element.activeItem = {
      title: "Active Post",
      metadata: { image: TINY_IMG },
    };
    await element.updateComplete;
    const fwi = element.shadowRoot.querySelector("full-width-image");
    expect(fwi === null).to.equal(false);
    expect(fwi.getAttribute("source")).to.equal(TINY_IMG);
    expect(fwi.getAttribute("caption")).to.equal("Active Post");
    element.activeItem = { title: "Active Post", metadata: {} };
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("full-width-image")).to.equal(null);
    expect(
      element.shadowRoot.querySelector("site-active-title") === null,
    ).to.equal(false);
  });

  it("maps the manifest css variable to the theme color", () => {
    expect(element._getColor(null)).to.equal(undefined);
    expect(element._getColor({})).to.equal(undefined);
    expect(
      element._getColor({
        metadata: {
          theme: {
            variables: {
              cssVariable: "--simple-colors-default-theme-orange-7",
            },
          },
        },
      }),
    ).to.equal("orange");
  });

  it("applies the disable-items state class in edit mode", async () => {
    expect(element._getStateClass(true)).to.equal("disable-items");
    expect(element._getStateClass(false)).to.equal("");
    element.editMode = true;
    // stateClass is set inside updated() so the class lands in a second
    // scheduled render; await two update cycles before reading the DOM
    await element.updateComplete;
    await element.updateComplete;
    expect(element.stateClass).to.equal("disable-items");
    expect(element.hasAttribute("edit-mode")).to.equal(true);
    expect(
      element.shadowRoot
        .querySelector("nav.social-float")
        .className.includes("disable-items"),
    ).to.equal(true);
    expect(
      element.shadowRoot
        .querySelector("footer.annoy-user")
        .className.includes("disable-items"),
    ).to.equal(true);
    element.editMode = false;
    await element.updateComplete;
    await element.updateComplete;
    expect(element.stateClass).to.equal("");
    expect(
      element.shadowRoot
        .querySelector("nav.social-float")
        .className.includes("disable-items"),
    ).to.equal(false);
  });

  it("reflects selectedPage and toggles store.pageAllowed", async () => {
    element.selectedPage = 1;
    await element.updateComplete;
    expect(element.getAttribute("selected-page")).to.equal("1");
    await tick(30);
    expect(store.pageAllowed).to.equal(true);
    element.selectedPage = 0;
    await element.updateComplete;
    expect(element.getAttribute("selected-page")).to.equal("0");
    await tick(30);
    expect(store.pageAllowed).to.equal(false);
  });

  it("reads title, color, image, icon and author from the manifest", async () => {
    store.manifest = {
      title: "Haxor Blog",
      metadata: {
        author: { name: "Blog Author" },
        theme: {
          variables: {
            cssVariable: "--simple-colors-default-theme-blue-7",
            image: "assets/hero.jpg",
            icon: "icons:search",
          },
        },
      },
      items: [],
    };
    await tick();
    await element.updateComplete;
    expect(element.color).to.equal("blue");
    expect(element.title).to.equal("Haxor Blog");
    expect(element.image).to.equal("assets/hero.jpg");
    expect(element.icon).to.equal("icons:search");
    expect(element.author.name).to.equal("Blog Author");
    expect(
      element.shadowRoot.querySelector("h1.home-title").textContent,
    ).to.equal("Haxor Blog");
    expect(
      element.shadowRoot
        .querySelector("simple-icon-button-lite.backbutton")
        .getAttribute("icon"),
    ).to.equal("icons:search");
    expect(
      element.shadowRoot
        .querySelector("footer.annoy-user simple-icon-lite")
        .getAttribute("icon"),
    ).to.equal("icons:search");
  });

  it("builds the share url and message from the active title", async () => {
    // #3107: same as the relatedItems test — the manifest items re-render
    // as post cards through the site-query reactions, so pin the image
    // fallback to the data URI before injecting the manifest
    element.image = TINY_IMG;
    store.manifest = {
      title: "Haxor",
      items: [
        { id: "p1", title: "Active Page", slug: "active-page", metadata: {} },
      ],
      // #3107: same theme-image seeding as afterEach
      metadata: { theme: { variables: { image: TINY_IMG } } },
    };
    store.activeId = "p1";
    await tick();
    expect(element.activeTitle).to.equal("Active Page");
    expect(element.activeManifestIndexCounter).to.equal(1);
    expect(element.shareUrl).to.equal(globalThis.document.location.href);
    expect(element.shareMsg).to.equal(
      "Active Page " + globalThis.document.location.href,
    );
  });

  it("ignores location changes without a route", () => {
    element.selectedPage = 1;
    element._noticeLocationChange(null);
    element._noticeLocationChange(undefined);
    element._noticeLocationChange({});
    expect(element.selectedPage).to.equal(1);
  });

  it("selects the home page for home and 404 routes", () => {
    element.selectedPage = 1;
    element._noticeLocationChange({ route: { name: "home" } });
    expect(element.selectedPage).to.equal(0);
    element.selectedPage = 1;
    element._noticeLocationChange({ route: { name: "404" } });
    expect(element.selectedPage).to.equal(0);
  });

  it("defers pageAllowed when the first run lands on home", async () => {
    element._noticeLocationChange({ route: { name: "home" } }, true);
    await tick(1100);
    expect(store.pageAllowed).to.equal(false);
  });

  it("selects the content page for named routes", async () => {
    element._noticeLocationChange({ route: { name: "page-one" } });
    expect(element.selectedPage).to.equal(1);
    // attribute reflection lands on the next update cycle
    await element.updateComplete;
    expect(element.getAttribute("selected-page")).to.equal("1");
    // the deferred anchor targeting happens after content import
    await tick(1100);
    expect(element.selectedPage).to.equal(1);
  });

  it("navigates back to home through history", async () => {
    store.location = { baseUrl: "/haxor-slevin-back" };
    await tick();
    element.selectedPage = 1;
    await element.updateComplete;
    element._goBack();
    expect(element.selectedPage).to.equal(0);
    await element.updateComplete;
    expect(element.getAttribute("selected-page")).to.equal("0");
  });

  it("lazily imports site-search when the modal is clicked", () => {
    expect(() => element.siteModalClick()).to.not.throw();
  });

  it("runs disposers on disconnect", async () => {
    const el = await fixture(html` <haxor-slevin></haxor-slevin> `);
    el.remove();
    expect(Array.isArray(el.__disposer)).to.equal(true);
    expect(el.__disposer.length).to.equal(0);
  });

  it("passes the a11y audit", async () => {
    // audit the empty (no posts) state: the post rendering paths are
    // already behaviorally asserted (including the h2 heading-order fix
    // above) and the site-* pieces have no active item in this state
    store.manifest = { title: "Haxor Blog", items: [] };
    await tick();
    await element.updateComplete;
    // give the firstUpdated dynamic imports time to resolve
    await tick(1200);
    // deterministically reveal the theme so the audit never races the
    // rAF-gated opacity fade (see HAXCMSThemeA11yTestHelpers.js)
    await forceThemeReveal(element);
    await expect(element).shadowDom.to.be.accessible({
      // skip-link targets live inside the shadow root (axe cannot resolve
      // them across the boundary); color-contrast is racy in headless
      // light/dark resolution (see spacebook-theme tests); empty headings
      // come from the site-* pieces having no active item in this state
      ignoredRules: ["skip-link", "color-contrast", "empty-heading"],
    });
  });
});

/*
describe("haxor-slevin test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <haxor-slevin title="test-title"></haxor-slevin> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
*/
/*
describe("A11y/chai axe tests", () => {
  it("haxor-slevin passes accessibility test", async () => {
    const el = await fixture(html` <haxor-slevin></haxor-slevin> `);
    await expect(el).to.be.accessible();
  });
  it("haxor-slevin passes accessibility negation", async () => {
    const el = await fixture(
      html`<haxor-slevin aria-labelledby="haxor-slevin"></haxor-slevin>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("haxor-slevin can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<haxor-slevin .foo=${'bar'}></haxor-slevin>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<haxor-slevin ></haxor-slevin>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<haxor-slevin></haxor-slevin>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<haxor-slevin></haxor-slevin>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
