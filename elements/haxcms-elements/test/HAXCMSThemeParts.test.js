import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { LitElement } from "lit";
import { getObserverTree, runInAction } from "mobx";
import { store } from "../lib/core/haxcms-site-store.js";
import { HAXCMSThemeParts } from "../lib/core/utils/HAXCMSThemeParts.js";

class ThemePartsProbe extends HAXCMSThemeParts(LitElement) {
  static get tag() {
    return "theme-parts-probe";
  }
  render() {
    return html`<span>probe</span>`;
  }
}
if (!globalThis.customElements.get(ThemePartsProbe.tag)) {
  globalThis.customElements.define(ThemePartsProbe.tag, ThemePartsProbe);
}

// how many reactions currently observe a store property
const observers = (prop) => {
  const tree = getObserverTree(store, prop);
  return tree.observers ? tree.observers.length : 0;
};
const settle = () => aTimeout(0);

describe("HAXCMSThemeParts", () => {
  let savedEdit;
  let savedDark;
  beforeEach(() => {
    savedEdit = store.editMode;
    savedDark = store.darkMode;
  });
  afterEach(() => {
    runInAction(() => {
      store.editMode = savedEdit;
      store.darkMode = savedDark;
    });
  });

  it("does not subscribe to the store until connected", () => {
    const beforeEdit = observers("editMode");
    const beforeDark = observers("darkMode");
    const el = document.createElement(ThemePartsProbe.tag);
    expect(el).to.be.instanceOf(ThemePartsProbe);
    expect(observers("editMode")).to.equal(beforeEdit);
    expect(observers("darkMode")).to.equal(beforeDark);
  });

  it("follows store.editMode and store.darkMode while connected", async () => {
    const el = await fixture(html`<theme-parts-probe></theme-parts-probe>`);
    runInAction(() => {
      store.editMode = true;
      store.darkMode = true;
    });
    await settle();
    expect(el.editMode).to.equal(true);
    expect(el.darkMode).to.equal(true);
    expect(el.dark).to.equal(true);
    expect(el.hasAttribute("edit-mode")).to.equal(true);
    runInAction(() => {
      store.editMode = false;
      store.darkMode = false;
    });
    await settle();
    expect(el.editMode).to.equal(false);
    expect(el.darkMode).to.equal(false);
  });

  it("releases its store subscriptions when disconnected", async () => {
    const baseEdit = observers("editMode");
    const baseDark = observers("darkMode");
    const host = await fixture(html`<div></div>`);
    for (let i = 0; i < 20; i++) {
      const el = document.createElement(ThemePartsProbe.tag);
      host.appendChild(el);
      await el.updateComplete;
      expect(observers("editMode")).to.equal(baseEdit + 1);
      el.remove();
    }
    expect(observers("editMode")).to.equal(baseEdit);
    expect(observers("darkMode")).to.equal(baseDark);
  });

  it("subscribes again when reconnected (blocks are moved in HAX)", async () => {
    const baseEdit = observers("editMode");
    const host = await fixture(
      html`<div><span id="a"></span><span id="b"></span></div>`,
    );
    const el = document.createElement(ThemePartsProbe.tag);
    host.querySelector("#a").appendChild(el);
    await el.updateComplete;
    // move it: disconnect + connect
    host.querySelector("#b").appendChild(el);
    await el.updateComplete;
    expect(observers("editMode")).to.equal(baseEdit + 1);
    runInAction(() => {
      store.editMode = true;
    });
    await settle();
    expect(el.editMode).to.equal(true);
    el.remove();
    expect(observers("editMode")).to.equal(baseEdit);
  });
});
