import { expect, fixture, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/ui-components/navigation/site-menu-button.js";

// Covers previous / next from the outline and the targetItemId override a
// theme can set to send the button (and its label) to a specific page.

function item(id, order) {
  return {
    id,
    title: "Title " + id,
    slug: id,
    location: `pages/${id}/index.html`,
    order,
    parent: null,
    indent: 0,
    metadata: { published: true },
  };
}

describe("site-menu-button", () => {
  let saved;

  beforeEach(() => {
    saved = { manifest: store.manifest, activeId: store.activeId };
    store.manifest = {
      id: "menu-button-site",
      title: "Menu button site",
      metadata: {
        site: { name: "menu-button-site", lang: "en" },
        platform: {},
        theme: { element: "test-theme", variables: {}, regions: {} },
      },
      items: [item("one", 0), item("two", 1), item("three", 2)],
    };
    store.activeId = "three";
  });

  afterEach(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
  });

  async function settle(el) {
    // the store values reach the button on a microtask
    await Promise.resolve();
    await el.updateComplete;
    await Promise.resolve();
    await el.updateComplete;
  }

  it("goes to the next page in the outline by default", async () => {
    store.activeId = "one";
    const el = await fixture(
      html`<site-menu-button type="next"></site-menu-button>`,
    );
    await settle(el);
    expect(el.link).to.equal("two");
    expect(el.label).to.equal("Title two");
    expect(el.disabled).to.equal(false);
  });

  it("goes to targetItemId instead, and back when it is cleared", async () => {
    const el = await fixture(
      html`<site-menu-button type="next"></site-menu-button>`,
    );
    await settle(el);
    // the last page has no next page in the outline
    expect(el.disabled).to.equal(true);
    el.targetItemId = "one";
    await el.updateComplete;
    expect(el.link).to.equal("one");
    expect(el.label).to.equal("Title one");
    expect(el.disabled).to.equal(false);
    expect(el.shadowRoot.querySelector("a").getAttribute("href")).to.equal(
      "one",
    );
    el.targetItemId = null;
    await el.updateComplete;
    expect(el.link).to.equal(null);
    expect(el.disabled).to.equal(true);
  });

  it("stays disabled in edit mode even with a target", async () => {
    const el = await fixture(
      html`<site-menu-button type="next"></site-menu-button>`,
    );
    await settle(el);
    el.editMode = true;
    el.targetItemId = "one";
    await el.updateComplete;
    expect(el.disabled).to.equal(true);
  });
});
