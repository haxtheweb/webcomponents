// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/haxcms-page-details-dialog.js";

describe("haxcms-page-details-dialog (haxtheweb/issues#2952)", () => {
  const item = {
    id: "item-1",
    title: "Page one",
    slug: "page-one",
    description: "About page one",
    metadata: {
      tags: ["alpha", "beta"],
      published: false,
      locked: true,
      updated: 1700000000,
    },
  };

  it("shows an empty state with no item", async () => {
    const el = await fixture(
      html`<haxcms-page-details-dialog></haxcms-page-details-dialog>`,
    );
    el.item = null;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".hax-ui-empty")).to.exist;
  });

  it("shows the page's status, address, description and tags", async () => {
    const el = await fixture(
      html`<haxcms-page-details-dialog></haxcms-page-details-dialog>`,
    );
    el.item = item;
    await el.updateComplete;
    const text = el.shadowRoot.textContent;
    expect(text).to.include("Unpublished");
    expect(text).to.include("Locked");
    expect(text).to.include("page-one");
    expect(text).to.include("About page one");
    expect(text).to.include("alpha, beta");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("disables the editing actions on a locked page but not unlock", async () => {
    const el = await fixture(
      html`<haxcms-page-details-dialog></haxcms-page-details-dialog>`,
    );
    el.item = item;
    await el.updateComplete;
    const btn = (action) =>
      el.shadowRoot.querySelector(`button[data-action="${action}"]`);
    expect(btn("_editPage").disabled).to.be.true;
    expect(btn("_editTitle").disabled).to.be.true;
    expect(btn("_toggleLocked").disabled).to.be.false;
    expect(btn("_openRevisions").disabled).to.be.false;
  });

  it("runs the page actions menu handler on the active page's page-break", async () => {
    let called = 0;
    // the dialog finds the page's page-break by item-id and calls its
    // own handler, so a stub handler on the instance stands in for it
    const wrap = await fixture(html`<div></div>`);
    const tag = globalThis.document.createElement("page-break");
    tag.setAttribute("item-id", "item-1");
    tag._toggleLocked = () => {
      called++;
    };
    wrap.appendChild(tag);
    const el = await fixture(
      html`<haxcms-page-details-dialog></haxcms-page-details-dialog>`,
    );
    el.item = item;
    await el.updateComplete;
    let hidden = 0;
    el.addEventListener("simple-modal-hide", () => hidden++);
    el.shadowRoot.querySelector('button[data-action="_toggleLocked"]').click();
    expect(called).to.equal(1);
    expect(hidden).to.equal(1);
  });

  it("follows the store's active item", async () => {
    expect(store).to.exist;
    const el = await fixture(
      html`<haxcms-page-details-dialog></haxcms-page-details-dialog>`,
    );
    await el.updateComplete;
    // no site loaded in this test: nothing is active
    expect(el.shadowRoot.querySelector(".hax-ui-empty")).to.exist;
  });
});
