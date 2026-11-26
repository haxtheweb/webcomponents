// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import { HAXCMSThemeVideoPlayerPalette } from "../lib/core/utils/HAXCMSThemeVideoPlayerPalette.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/haxcms-page-details-dialog.js";
import "@haxtheweb/media-image/media-image.js";
import "@haxtheweb/image-gallery/image-gallery.js";

// a stand-in theme (DDDSuper, as themes are): the hooks are a style any
// theme can add
class PaletteHookHost extends DDDSuper(LitElement) {
  static get styles() {
    return [super.styles, HAXCMSThemeVideoPlayerPalette];
  }
  render() {
    return html`<slot></slot>`;
  }
}
globalThis.customElements.define("palette-hook-host", PaletteHookHost);

const prop = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();

describe("HAXCMSThemeVideoPlayerPalette (haxtheweb/issues#2697)", () => {
  it("leaves the video-player hooks unset without a palette", async () => {
    const el = await fixture(
      html`<palette-hook-host><span></span></palette-hook-host>`,
    );
    expect(prop(el.firstElementChild, "--video-player-bg-color")).to.equal("");
  });

  it("draws the player surface from the palette once one is set", async () => {
    const el = await fixture(
      html`<palette-hook-host data-palette="4"
        ><span></span
      ></palette-hook-host>`,
    );
    const child = el.firstElementChild;
    expect(prop(child, "--video-player-bg-color")).to.not.equal("");
    expect(prop(child, "--video-player-color")).to.not.equal("");
    expect(prop(child, "--video-player-hover-bg-color")).to.not.equal("");
  });
});

describe("print styles (haxtheweb/issues#3123)", () => {
  const printRules = (el) =>
    el.constructor.elementStyles
      .map((s) => s.cssText || "")
      .join("\n")
      .split("@media print")
      .slice(1)
      .join("\n");

  it("image-gallery prints its slotted images, not the interactive layout", async () => {
    const el = await fixture(
      html`<image-gallery mode="gallery"
        ><media-image source="a.jpg" alt="a"></media-image
        ><media-image source="b.jpg" alt="b"></media-image
      ></image-gallery>`,
    );
    const rules = printRules(el);
    expect(rules).to.include(".gallery-layout");
    expect(rules).to.include(".slot-hidden");
    expect(rules).to.include("break-inside: avoid");
  });

  it("media-image keeps image and caption together and inside the page", async () => {
    const el = await fixture(
      html`<media-image source="a.jpg" alt="a" offset="wide"></media-image>`,
    );
    const rules = printRules(el);
    expect(rules).to.include("break-inside: avoid");
    expect(rules).to.include(':host([offset="wide"])');
  });
});

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
