import { html, fixture, expect } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  forceThemeReveal,
  lockLightColorScheme,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../writing-theme.js";

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));
const day = (y, m, d) => Math.floor(Date.UTC(y, m - 1, d, 12) / 1000);

const item = (id, title, slug, order, parent, metadata = {}) => ({
  id,
  title,
  slug,
  order,
  parent,
  indent: parent ? 1 : 0,
  location: `pages/${id}/index.html`,
  metadata: { published: true, created: day(2026, 1, 1), ...metadata },
});

// Home, About, Archive, Posts (hidden) and twelve posts, so the home list
// has more posts than it shows
const manifest = () => {
  const items = [
    item("home", "Back forty notes", "home", 0, null),
    item("about", "About", "about", 1, null),
    item("archive", "Archive", "archive", 2, null),
    item("posts", "Posts", "posts", 3, null, { hideInMenu: true }),
  ];
  for (let i = 1; i <= 12; i++) {
    items.push(
      item(`p${i}`, `Post ${i}`, `posts/post-${i}`, i, "posts", {
        created: day(i <= 2 ? 2025 : 2026, (i % 12) + 1, 3),
        updated:
          i === 12
            ? day(2026, 1, 20)
            : day(i <= 2 ? 2025 : 2026, (i % 12) + 1, 3),
        tags: i % 2 ? ["soil"] : ["garlic", "planting"],
      }),
    );
  }
  return { title: "Back forty notes", metadata: { site: {} }, items };
};

describe("writing-theme", function () {
  this.timeout(10000);
  let element;
  let restoreColorScheme;
  let saved;

  before(() => {
    restoreColorScheme = lockLightColorScheme();
    saved = { manifest: store.manifest, activeId: store.activeId };
  });

  after(() => {
    restoreColorScheme();
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
  });

  const show = async (activeId) => {
    store.manifest = manifest();
    store.activeId = activeId;
    element = await fixture(html`<writing-theme></writing-theme>`);
    await tick();
    await element.updateComplete;
    await forceThemeReveal(element);
    return element.shadowRoot;
  };

  it("keeps the content contract HAX needs and a skip link", async () => {
    const root = await show("home");
    expect(root.querySelector("a.skip-link")).to.exist;
    expect(root.querySelector("#contentcontainer #slot slot")).to.exist;
  });

  it("puts the shown top-level pages in the nav, not hidden ones", async () => {
    const root = await show("about");
    const links = [...root.querySelectorAll("nav a")].map((a) =>
      a.textContent.trim(),
    );
    expect(links).to.deep.equal(["Back forty notes", "About", "Archive"]);
    expect(
      root.querySelector('nav a[aria-current="page"]').textContent.trim(),
    ).to.equal("About");
  });

  it("lists the 10 most recent posts on the home page, newest first", async () => {
    const root = await show("home");
    const posts = root.querySelectorAll(".listing .posts li");
    expect(posts.length).to.equal(10);
    const first = posts[0].querySelector("time").getAttribute("datetime");
    const last = posts[9].querySelector("time").getAttribute("datetime");
    expect(first > last).to.equal(true);
    expect(root.querySelector('.listing a[href="archive"]')).to.exist;
    const tags = [...root.querySelectorAll(".tags a")].map((a) =>
      a.textContent.trim(),
    );
    expect(tags).to.deep.equal(["garlic", "planting", "soil"]);
  });

  it("groups every post by year on the archive", async () => {
    const root = await show("archive");
    const years = [...root.querySelectorAll(".listing h3")].map((h) =>
      h.textContent.trim(),
    );
    expect(years).to.deep.equal(["2026", "2025"]);
    expect(root.querySelectorAll(".listing .posts li").length).to.equal(12);
  });

  it("shows posted, updated and tags under a post's title", async () => {
    const root = await show("p12");
    const byline = root.querySelector(".byline");
    expect(byline).to.exist;
    expect(byline.querySelectorAll("time").length).to.equal(2);
    expect(byline.textContent).to.contain("Updated");
    expect(byline.querySelector('a[href="archive?tag=garlic"]')).to.exist;
  });

  it("leaves out updated when it is the posted date", async () => {
    const root = await show("p4");
    const byline = root.querySelector(".byline");
    expect(byline.querySelectorAll("time").length).to.equal(1);
    expect(byline.textContent).to.not.contain("Updated");
  });

  it("filters the archive to one tag", async () => {
    store.manifest = manifest();
    store.activeId = "archive";
    element = await fixture(html`<writing-theme></writing-theme>`);
    await tick();
    element.tagFilter = "soil";
    await element.updateComplete;
    const root = element.shadowRoot;
    expect(root.querySelector(".listing h2").textContent.trim()).to.equal(
      "Posts tagged soil",
    );
    expect(root.querySelectorAll(".listing .posts li").length).to.equal(6);
  });

  it("passes the a11y audit", async () => {
    await show("home");
    // the skip link's target is inside the shadow root, which axe cannot
    // resolve from a shadowDom audit (same as twenty-six-theme)
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});
