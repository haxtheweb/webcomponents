// Outline Actions (move, indent, add child, delete) sit on the current
// page's row in the site menu. A page with no row (deeper than the menu
// shows, hidden from it, or a theme without the menu) offers them itself,
// beside Page Actions, so every page can be managed.
import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { runInAction } from "mobx";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "../page-break.js";
import "@haxtheweb/haxcms-elements/lib/core/micros/haxcms-page-operations.js";

const here = (el) =>
  el.shadowRoot.querySelector("haxcms-page-operations[fallback]");

describe("page-break offers Outline Actions when no menu row has them", () => {
  let el;
  let saved;

  beforeEach(async () => {
    saved = store.pageOperationsElement;
    runInAction(() => {
      store.pageOperationsElement = null;
    });
    el = await fixture(
      html`<page-break item-id="deep" title="Deep page"></page-break>`,
    );
    el.isLoggedIn = true;
    await el.updateComplete;
  });

  afterEach(() => {
    runInAction(() => {
      store.pageOperationsElement = saved;
    });
  });

  it("shows them on the page after a moment, tied to this page", async () => {
    // not at once: a menu row goes away and comes back as the menu redraws
    expect(here(el)).to.equal(null);
    await aTimeout(650);
    await el.updateComplete;
    const ops = here(el);
    expect(ops).to.not.equal(null);
    expect(ops.getAttribute("action-id")).to.equal("deep");
    // the copy is not mistaken for a menu row
    expect(store.pageOperationsElement).to.equal(null);
  });

  it("steps aside as soon as a menu row has them", async () => {
    await aTimeout(650);
    await el.updateComplete;
    expect(here(el)).to.not.equal(null);
    runInAction(() => {
      store.pageOperationsElement = document.createElement("div");
    });
    await aTimeout(50);
    await el.updateComplete;
    expect(here(el)).to.equal(null);
  });

  it("never shows them to a visitor", async () => {
    el.isLoggedIn = false;
    await aTimeout(650);
    await el.updateComplete;
    expect(here(el)).to.equal(null);
  });
});
