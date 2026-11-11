import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { runInAction } from "mobx";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/ui-components/navigation/site-menu.js";

// site-menu turns on map-menu's lazy-children, so a large outline only
// builds the top level plus the path to the current page.

function outline(modules, lessons) {
  const items = [];
  let order = 0;
  for (let m = 1; m <= modules; m++) {
    items.push({
      id: `m${m}`,
      title: `Module ${m}`,
      slug: `m${m}`,
      location: `pages/m${m}/index.html`,
      parent: null,
      order: order++,
      indent: 0,
      metadata: {},
    });
    for (let l = 1; l <= lessons; l++) {
      items.push({
        id: `m${m}-l${l}`,
        title: `Lesson ${m}.${l}`,
        slug: `m${m}-l${l}`,
        location: `pages/m${m}-l${l}/index.html`,
        parent: `m${m}`,
        order: order++,
        indent: 1,
        metadata: {},
      });
    }
  }
  return {
    id: "site",
    title: "Menu site",
    metadata: { site: { name: "menu" } },
    items,
  };
}

describe("site-menu lazy children", () => {
  let saved;
  beforeEach(() => {
    saved = { manifest: store.manifest, activeId: store.activeId };
  });
  afterEach(() => {
    runInAction(() => {
      store.manifest = saved.manifest;
      store.activeId = saved.activeId;
    });
  });

  it("renders map-menu with lazy-children on", async () => {
    runInAction(() => {
      store.manifest = outline(5, 4);
      store.activeId = "m4-l3";
    });
    const el = await fixture(html`<site-menu></site-menu>`);
    await el.updateComplete;
    await aTimeout(50);
    const menu = el.shadowRoot.querySelector("map-menu");
    expect(menu.lazyChildren).to.equal(true);
    await menu.updateComplete;
    await aTimeout(50);
    const items = Array.from(
      menu.shadowRoot.querySelectorAll("map-menu-item"),
    ).map((i) => i.id);
    // only the current module's lessons are built
    expect(items).to.include("m4-l3");
    expect(items.some((id) => id.startsWith("m1-"))).to.equal(false);
    // every module header is there
    const subs = Array.from(
      menu.shadowRoot.querySelectorAll("map-menu-submenu"),
    ).map((s) => s.id);
    expect(subs).to.include.members(["m1", "m2", "m3", "m4", "m5"]);
  });
});
