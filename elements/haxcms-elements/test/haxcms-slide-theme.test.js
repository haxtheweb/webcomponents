// Tests for the haxcms-slide-theme lifecycle wiring.
// Issue 3106: this theme's constructor used to reassign
// this.__disposer = [] right after super(), orphaning the three
// constructor-time autoruns pushed by HAXCMSLitElementTheme
// (editMode/trayStatus/activeItemContent) so disconnectedCallback could
// never dispose them (zombie autoruns on every removed theme).
import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/themes/haxcms-slide-theme.js";

const flush = async (el) => {
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
};

describe("haxcms-slide-theme autorun disposal (issue 3106)", () => {
  let savedEditMode;
  let savedManifest;
  before(() => {
    savedEditMode = store.editMode;
    savedManifest = store.manifest;
    store.editMode = false;
    // the connectedCallback autorun reads store.routerManifest.items.length
    // (a computed derived from store.manifest) so give the bare fixture an
    // empty manifest to render against
    store.manifest = {
      title: "Slide test",
      metadata: { site: { name: "slide-test" }, theme: { variables: {} } },
      items: [],
    };
  });
  after(() => {
    store.editMode = savedEditMode;
    store.manifest = savedManifest;
  });

  it("retains the constructor-time autoruns in __disposer", () => {
    // createElement runs the constructor without connecting: the three
    // constructor-time autoruns pushed by HAXCMSLitElementTheme
    // (editMode / trayStatus / activeItemContent) must survive in
    // __disposer (the constructor reassignment used to orphan them)
    const detached = globalThis.document.createElement("haxcms-slide-theme");
    expect(Array.isArray(detached.__disposer)).to.equal(true);
    expect(detached.__disposer.length).to.equal(3);
    // dispose them here so this never-connected element does not leak
    // live reactions (including its wiring watchdog) into the suite
    detached.__disposer.forEach((disposer) => {
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    });
    detached.__disposer = [];
    if (
      detached.HAXCMSThemeWiring &&
      detached.HAXCMSThemeWiring.disposeDisposers
    ) {
      detached.HAXCMSThemeWiring.disposeDisposers();
    }
  });

  it("disposes every autorun on disconnect so removed themes stop reacting", async () => {
    const el = await fixture(html`<haxcms-slide-theme></haxcms-slide-theme>`);
    await flush(el);
    expect(el.__disposer.length).to.be.at.least(3);
    el.remove();
    // HAXCMSTheme.disconnectedCallback ran disposeDisposers()
    expect(el.__disposer.length).to.equal(0);
    // the wiring instance's watchdog autorun is disposed too (issue 3106)
    expect(el.HAXCMSThemeWiring.__disposer.length).to.equal(0);
    // no zombie reaction: flipping the store no longer reaches the
    // removed element
    const before = el.editMode;
    store.editMode = !before;
    await flush(el);
    await new Promise((r) => setTimeout(r, 80));
    expect(el.editMode).to.equal(before);
    store.editMode = before;
  });
});
