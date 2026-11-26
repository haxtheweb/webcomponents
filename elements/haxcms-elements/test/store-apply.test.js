// haxtheweb/issues#3431: the first value an element reads from the site
// store lands at once, so the element's first render (and a server render,
// which never runs a microtask) already has the site's data; later changes
// still wait a microtask as before.
import { expect, fixture, html } from "@open-wc/testing";
import { autorun, observable, runInAction } from "mobx";
import { applyFromStore } from "../lib/core/utils/storeApply.js";
import { store } from "../lib/core/haxcms-site-store.js";
import { HAXCMSLitElementTheme } from "../lib/core/HAXCMSLitElementTheme.js";
import "../lib/ui-components/site/site-title.js";

class StoreApplyTheme extends HAXCMSLitElementTheme {
  constructor() {
    super();
    this.firstRender = null;
  }
  update(changed) {
    if (this.firstRender === null) {
      this.firstRender = {
        activeItemContent: this.activeItemContent,
        trayStatus: this.trayStatus,
      };
    }
    super.update(changed);
  }
}
customElements.define("store-apply-theme", StoreApplyTheme);

describe("applyFromStore", () => {
  it("applies the first run at once and defers later runs", async () => {
    const box = observable({ value: "one" });
    const seen = [];
    const dispose = autorun((reaction) => {
      const value = box.value;
      applyFromStore(reaction, () => seen.push(value));
    });
    expect(seen).to.deep.equal(["one"]);
    runInAction(() => {
      box.value = "two";
    });
    expect(seen).to.deep.equal(["one"]);
    await Promise.resolve();
    expect(seen).to.deep.equal(["one", "two"]);
    dispose();
  });

  it("does not subscribe to what the apply reads", () => {
    const box = observable({ value: "a", other: 1 });
    let runs = 0;
    const dispose = autorun((reaction) => {
      runs++;
      const value = box.value;
      applyFromStore(reaction, () => box.other + value);
    });
    runInAction(() => {
      box.other = 2;
    });
    expect(runs).to.equal(1);
    dispose();
  });

  it("without a reaction it waits a microtask", async () => {
    let ran = false;
    applyFromStore(null, () => {
      ran = true;
    });
    expect(ran).to.equal(false);
    await Promise.resolve();
    expect(ran).to.equal(true);
  });
});

describe("store values on first render", () => {
  let saved;
  beforeEach(() => {
    saved = {
      manifest: store.manifest,
      activeItemContent: store.activeItemContent,
      trayStatus: store.trayStatus,
    };
    store.manifest = {
      id: "s",
      title: "Store apply site",
      metadata: { platform: {}, theme: { variables: {} }, site: {} },
      items: [],
    };
    store.activeItemContent = "<p>first</p>";
    store.trayStatus = "collapsed";
  });
  afterEach(() => {
    store.manifest = saved.manifest;
    store.activeItemContent = saved.activeItemContent;
    store.trayStatus = saved.trayStatus;
  });

  // the theme wiring subscribes in connectedCallback, after Lit queued the
  // first render; deferred, that render had none of the store's values
  it("a theme's first render has the store's values", async () => {
    const host = await fixture(html`<div></div>`);
    const el = document.createElement("store-apply-theme");
    host.appendChild(el);
    expect(el.activeItemContent).to.equal("<p>first</p>");
    expect(el.trayStatus).to.equal("collapsed");
    await el.updateComplete;
    expect(el.firstRender).to.deep.equal({
      activeItemContent: "<p>first</p>",
      trayStatus: "collapsed",
    });
  });

  // a server render constructs the element and renders it with no
  // microtask in between
  it("site-title has the title as soon as it is constructed", () => {
    const el = document.createElement("site-title");
    expect(el.siteTitle).to.equal(store.siteTitle);
    expect(el.siteTitle).to.equal("Store apply site");
  });
});
