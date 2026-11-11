import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { LitElement } from "lit";
import { I18NMixin, I18NManagerStore } from "../lib/I18NMixin.js";
import "../i18n-manager.js";

// The manager's registry used to keep every element that ever registered,
// so removed elements (and everything they referenced) stayed alive for the
// life of the page. These tests pin the release-on-disconnect contract.

class LifecycleI18nElement extends I18NMixin(LitElement) {
  static get tag() {
    return "lifecycle-i18n-element";
  }
  constructor() {
    super();
    this.t = { hello: "Hello" };
    this.registerLocalization({
      context: this,
      namespace: "lifecycle-i18n-element",
      localesPath: "/locales",
      locales: ["es"],
    });
  }
}
customElements.define(LifecycleI18nElement.tag, LifecycleI18nElement);

// vanilla element: no Lit lifecycle above the mixin
class LifecycleVanillaElement extends I18NMixin(HTMLElement) {
  static get tag() {
    return "lifecycle-vanilla-element";
  }
  constructor() {
    super();
    this.t = { hi: "Hi" };
    this.registerLocalization({
      context: this,
      namespace: "lifecycle-vanilla-element",
      localesPath: "/locales",
      locales: [],
    });
  }
  render() {}
}
customElements.define(LifecycleVanillaElement.tag, LifecycleVanillaElement);

const registered = (el) =>
  I18NManagerStore.elements.filter((e) => e.context === el).length;

describe("i18n-manager registration lifecycle", () => {
  let savedLang;
  beforeEach(() => {
    savedLang = I18NManagerStore.lang;
  });
  afterEach(() => {
    I18NManagerStore.lang = savedLang;
  });

  it("releases an element's registration when it is removed", async () => {
    const el = await fixture(
      html`<lifecycle-i18n-element></lifecycle-i18n-element>`,
    );
    expect(registered(el)).to.equal(1);
    el.remove();
    expect(registered(el)).to.equal(0);
  });

  it("does not grow the registry over many add/remove cycles", async () => {
    const host = await fixture(html`<div></div>`);
    const before = I18NManagerStore.elements.length;
    for (let i = 0; i < 50; i++) {
      const el = document.createElement(LifecycleI18nElement.tag);
      host.appendChild(el);
      await el.updateComplete;
      el.remove();
    }
    expect(I18NManagerStore.elements.length).to.equal(before);
  });

  it("registers again when moved or re-added, once", async () => {
    const host = await fixture(
      html`<div><span id="a"></span><span id="b"></span></div>`,
    );
    const el = document.createElement(LifecycleI18nElement.tag);
    host.querySelector("#a").appendChild(el);
    host.querySelector("#b").appendChild(el);
    expect(registered(el)).to.equal(1);
    el.remove();
    host.appendChild(el);
    expect(registered(el)).to.equal(1);
  });

  it("keeps the English defaults in _t across a re-registration", async () => {
    const host = await fixture(html`<div></div>`);
    const el = document.createElement(LifecycleI18nElement.tag);
    host.appendChild(el);
    // simulate a translation having been applied
    el.t = { hello: "Hola" };
    el.remove();
    host.appendChild(el);
    expect(el._t).to.deep.equal({ hello: "Hello" });
  });

  it("restores English text if the language went back to English while removed", async () => {
    const host = await fixture(html`<div></div>`);
    I18NManagerStore.lang = "es";
    const el = document.createElement(LifecycleI18nElement.tag);
    host.appendChild(el);
    el.t = { hello: "Hola" };
    el.remove();
    I18NManagerStore.lang = "en";
    host.appendChild(el);
    expect(el.t).to.deep.equal({ hello: "Hello" });
  });

  it("works for elements without a Lit lifecycle", async () => {
    const host = await fixture(html`<div></div>`);
    const el = document.createElement(LifecycleVanillaElement.tag);
    host.appendChild(el);
    expect(registered(el)).to.equal(1);
    el.remove();
    expect(registered(el)).to.equal(0);
    host.appendChild(el);
    expect(registered(el)).to.equal(1);
  });

  it("prunes mixin elements that were registered but never connected", () => {
    const orphans = [];
    for (let i = 0; i < 5; i++) {
      orphans.push(document.createElement(LifecycleI18nElement.tag));
    }
    orphans.forEach((o) => expect(registered(o)).to.equal(1));
    I18NManagerStore.pruneDisconnected();
    orphans.forEach((o) => expect(registered(o)).to.equal(0));
  });

  it("sweeps never-connected elements on its own as registrations pile up", () => {
    const before = I18NManagerStore.elements.length;
    for (let i = 0; i < 250; i++) {
      document.createElement(LifecycleI18nElement.tag);
    }
    // without the periodic sweep this would be before + 250
    expect(I18NManagerStore.elements.length).to.be.below(before + 100);
  });

  it("never prunes registrations that are not mixin-managed", async () => {
    const context = { t: { a: "A" }, requestUpdate() {} };
    I18NManagerStore.registerLocalization({
      context,
      namespace: "plain-object-context",
      localesPath: "/locales",
      locales: [],
    });
    const node = document.createElement("div");
    I18NManagerStore.registerLocalization({
      context: node,
      namespace: "plain-node-context",
      localesPath: "/locales",
      locales: [],
    });
    I18NManagerStore.pruneDisconnected();
    expect(
      I18NManagerStore.elements.some((e) => e.context === context),
    ).to.equal(true);
    expect(I18NManagerStore.elements.some((e) => e.context === node)).to.equal(
      true,
    );
    I18NManagerStore.deregisterLocalization(context);
    I18NManagerStore.deregisterLocalization(node);
    await aTimeout(0);
  });

  it("deregisterLocalization ignores empty input", () => {
    const before = I18NManagerStore.elements.length;
    I18NManagerStore.deregisterLocalization(null);
    I18NManagerStore.deregisterLocalization(undefined);
    expect(I18NManagerStore.elements.length).to.equal(before);
  });
});
