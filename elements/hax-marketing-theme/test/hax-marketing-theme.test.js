import { html, fixture, expect } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  forceThemeReveal,
  lockLightColorScheme,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../hax-marketing-theme.js";

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

const item = (id, title, order, parent = null, metadata = {}) => ({
  id,
  title,
  slug: id,
  order,
  parent,
  indent: parent ? 1 : 0,
  description: id === "start" ? "Pick what it is for." : "",
  location: `pages/${id}/index.html`,
  metadata: { published: true, ...metadata },
});

const manifest = (variables = {}) => ({
  title: "HAX",
  metadata: {
    site: {},
    theme: {
      element: "hax-marketing-theme",
      path: "@haxtheweb/hax-marketing-theme/hax-marketing-theme.js",
      name: "HAX marketing",
      variables,
    },
  },
  items: [
    item("start", "I want a website that", 0),
    item("compare", "Compare", 1),
    item("hidden", "Hidden page", 2, null, { hideInMenu: true }),
    item("get-started", "Get started", 3),
    item("hosting", "Hosting", 4, "get-started"),
  ],
});

describe("hax-marketing-theme", function () {
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

  const show = async (activeId, variables) => {
    store.manifest = manifest(variables);
    store.activeId = activeId;
    element = await fixture(html`<hax-marketing-theme></hax-marketing-theme>`);
    await tick();
    await element.updateComplete;
    await forceThemeReveal(element);
    return element.shadowRoot;
  };

  it("keeps the content contract HAX needs and a skip link", async () => {
    const root = await show("start");
    expect(root.querySelector("a.skip-link")).to.exist;
    expect(root.querySelector("#contentcontainer #slot slot")).to.exist;
  });

  it("lists the shown top-level pages after home and marks the current one", async () => {
    const root = await show("compare");
    const links = [...root.querySelectorAll("header nav a")].map((a) =>
      a.textContent.trim(),
    );
    expect(links).to.deep.equal(["Compare", "Get started"]);
    expect(
      root
        .querySelector('header nav a[aria-current="page"]')
        .textContent.trim(),
    ).to.equal("Compare");
    expect(root.querySelector("header .brand a").textContent.trim()).to.equal(
      "HAX",
    );
  });

  it("lists every shown page in the footer, children under their parent", async () => {
    const root = await show("start");
    const columns = [...root.querySelectorAll("footer .cols > div")].map(
      (div) => [
        div.querySelector("h2").textContent.trim(),
        [...div.querySelectorAll("a")].map((a) => a.textContent.trim()),
      ],
    );
    expect(columns).to.deep.equal([
      ["HAX", ["I want a website that", "Compare", "Get started"]],
      ["Get started", ["Hosting"]],
    ]);
  });

  it("draws nothing site specific until the site sets it", async () => {
    const root = await show("start");
    expect(root.querySelector("hax-network-bar")).to.not.exist;
    expect(root.querySelector(".eyebrow")).to.not.exist;
    expect(root.querySelector("hax-reel")).to.not.exist;
    expect(root.querySelector("footer .payoff")).to.not.exist;
  });

  it("takes its eyebrow, buttons, art and payoff from the theme variables", async () => {
    const picture = new URL("../demo/files/traveler-logo.svg", import.meta.url)
      .href;
    const root = await show("start", {
      eyebrow: "Free. Open.",
      cta: "Start building",
      heroAction: "Pick a starter",
      payoff: "This one is yours.",
      logos: [
        { src: picture, alt: "Logo" },
        { src: picture, alt: "Logo again" },
      ],
      art: [{ src: picture, alt: "Art" }],
    });
    expect(root.querySelector(".eyebrow").textContent.trim()).to.equal(
      "Free. Open.",
    );
    expect(root.querySelector("header a.cta").textContent.trim()).to.equal(
      "Start building",
    );
    expect(
      root.querySelector(".hero .actions a.cta").textContent.trim(),
    ).to.equal("Pick a starter");
    expect(
      root.querySelector(".hero .actions a.ghost").textContent.trim(),
    ).to.equal("Get started");
    expect(root.querySelector("header hax-reel.logo")).to.exist;
    expect(root.querySelector(".hero hax-reel.traveler")).to.exist;
    expect(root.querySelector("footer .payoff").textContent.trim()).to.equal(
      "This one is yours.",
    );
  });

  it("shows the page description as the lede", async () => {
    const root = await show("start");
    expect(root.querySelector(".lede").textContent.trim()).to.equal(
      "Pick what it is for.",
    );
  });

  it("sets palette roles that read on each other", async () => {
    await show("start");
    await tick(100);
    const onBrand = element.style.getPropertyValue("--hm-on-brand");
    expect(["#000000", "#ffffff"]).to.include(onBrand);
  });

  it("takes a design system the site picks", () => {
    expect(customElements.get("hax-marketing-theme").acceptsDesignSystems).to.be
      .true;
  });

  it("carries the style switcher in its chrome", async () => {
    const root = await show("start");
    expect(root.querySelector(".switcher hax-style-switcher")).to.exist;
  });

  it("passes the a11y audit", async () => {
    await show("start", { eyebrow: "Free. Open.", cta: "Start building" });
    await tick(100);
    // the skip link's target is inside the shadow root, which axe cannot
    // resolve from a shadowDom audit (same as writing-theme)
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});
