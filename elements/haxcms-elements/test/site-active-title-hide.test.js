import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/ui-components/active-item/site-active-title.js";

// "Hide page title" (page metadata.hideTitle): the title stays the page's h1
// for screen readers but is not drawn, except while editing
describe("site-active-title hide page title", () => {
  const setActive = async (metadata) => {
    store.manifest = {
      title: "Site",
      metadata: {},
      items: [{ id: "a", title: "Page A", slug: "a", metadata }],
    };
    store.activeId = "a";
    await aTimeout(20);
  };

  it("shows the title by default", async () => {
    await setActive({});
    const el = await fixture(html`<site-active-title></site-active-title>`);
    await aTimeout(20);
    expect(el.hideTitle).to.equal(false);
    expect(el.hasAttribute("hide-title")).to.equal(false);
  });

  it("visually hides the title when the page hides it, keeping the h1", async () => {
    await setActive({ hideTitle: true });
    const el = await fixture(html`<site-active-title></site-active-title>`);
    await aTimeout(20);
    await el.updateComplete;
    expect(el.hasAttribute("hide-title")).to.equal(true);
    const h1 = el.querySelector("h1");
    expect(h1).to.exist;
    expect(h1.textContent.trim()).to.equal("Page A");
    expect(h1.getBoundingClientRect().width).to.be.at.most(1);
  });

  it("does not hide a parent or ancestor title", async () => {
    await setActive({ hideTitle: true });
    const el = await fixture(
      html`<site-active-title dynamic-methodology="above"></site-active-title>`,
    );
    el.dynamicMethodology = "above";
    await aTimeout(20);
    expect(el.hideTitle).to.equal(false);
  });
});
