import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import {
  I18NMixin,
  I18NManagerStore,
  releaseLocalization,
  restoreLocalization,
} from "../lib/I18NMixin.js";
import "../i18n-manager.js";

// Language switching with elements coming and going: mounted elements
// follow every switch, removed ones are released, and elements that come
// back (the HAX editor moves blocks by removing and re-adding them) catch up.
const NS = "i18n-switch-element";
const LOCALES = "/i18n-switch-fake/locales";

class I18nSwitchElement extends I18NMixin(LitElement) {
  static get tag() {
    return NS;
  }
  constructor() {
    super();
    this.t = { hello: "Hello" };
    this.registerLocalization({
      context: this,
      namespace: NS,
      localesPath: LOCALES,
      locales: ["es", "fr"],
    });
  }
  render() {
    return html`<span>${this.t.hello}</span>`;
  }
}
customElements.define(I18nSwitchElement.tag, I18nSwitchElement);

const registered = (el) =>
  I18NManagerStore.elements.filter((d) => d.context === el).length;

async function settle(els) {
  for (let i = 0; i < 5; i++) {
    await new Promise((r) => setTimeout(r, 0));
  }
  await Promise.all(els.map((el) => el.updateComplete));
}

async function switchTo(lang, els) {
  I18NManagerStore.lang = lang;
  await settle(els);
}

describe("I18NMixin registration follows the element lifecycle", () => {
  let savedLang;
  let savedTargets;
  let savedManifest;
  beforeEach(() => {
    savedLang = I18NManagerStore.lang;
    savedTargets = I18NManagerStore.fetchTargets;
    savedManifest = [
      I18NManagerStore.manifestLoaded,
      I18NManagerStore.translationManifest,
    ];
    // no network: the manifest and locale files are served from the caches
    I18NManagerStore.manifestLoaded = true;
    I18NManagerStore.translationManifest = { [NS]: ["es", "fr"] };
    I18NManagerStore.fetchTargets = {
      ...savedTargets,
      [`${LOCALES}/${NS}.es.json`]: { hello: "Hola" },
      [`${LOCALES}/${NS}.fr.json`]: { hello: "Bonjour" },
    };
  });
  afterEach(async () => {
    I18NManagerStore.lang = savedLang;
    await settle([]);
    I18NManagerStore.fetchTargets = savedTargets;
    [I18NManagerStore.manifestLoaded, I18NManagerStore.translationManifest] =
      savedManifest;
  });

  it("releases removed elements and keeps translating mounted ones", async () => {
    const wrap = await fixture(
      html`<div>
        <i18n-switch-element></i18n-switch-element>
        <i18n-switch-element></i18n-switch-element>
        <i18n-switch-element></i18n-switch-element>
      </div>`,
    );
    const els = [...wrap.querySelectorAll(NS)];
    els.forEach((el) => expect(registered(el)).to.equal(1));

    await switchTo("es", els);
    els.forEach((el) => expect(el.t.hello).to.equal("Hola"));

    const [gone, ...kept] = els;
    gone.remove();
    expect(registered(gone)).to.equal(0);

    await switchTo("fr", kept);
    kept.forEach((el) => expect(el.t.hello).to.equal("Bonjour"));
    // released: the manager no longer reaches it
    expect(gone.t.hello).to.equal("Hola");
    kept.forEach((el) => expect(registered(el)).to.equal(1));
  });

  it("re-registers on reconnect and catches up on a language change made while away", async () => {
    const wrap = await fixture(
      html`<div>
        <i18n-switch-element></i18n-switch-element>
      </div>`,
    );
    const el = wrap.querySelector(NS);
    await switchTo("es", [el]);
    expect(el.t.hello).to.equal("Hola");

    el.remove();
    await switchTo("fr", []);
    expect(el.t.hello).to.equal("Hola");

    wrap.appendChild(el);
    expect(registered(el)).to.equal(1);
    await settle([el]);
    expect(el.t.hello).to.equal("Bonjour");
    expect(el.shadowRoot.textContent).to.contain("Bonjour");

    // still follows later switches, including back to the English defaults
    await switchTo("es", [el]);
    expect(el.t.hello).to.equal("Hola");
    el.remove();
    await switchTo("en", []);
    wrap.appendChild(el);
    await settle([el]);
    expect(el.t.hello).to.equal("Hello");
  });

  it("a move within the page keeps a single registration and its strings", async () => {
    const wrap = await fixture(
      html`<div>
        <p id="a"></p>
        <p id="b"><i18n-switch-element></i18n-switch-element></p>
      </div>`,
    );
    const el = wrap.querySelector(NS);
    await switchTo("es", [el]);
    // a same-tick move fires disconnected then connected
    wrap.querySelector("#a").appendChild(el);
    expect(registered(el)).to.equal(1);
    await settle([el]);
    expect(el.t.hello).to.equal("Hola");
    await switchTo("fr", [el]);
    expect(el.t.hello).to.equal("Bonjour");
  });
});

// elements that register with the manager directly (not through I18NMixin)
class DirectI18nElement extends LitElement {
  constructor() {
    super();
    this.t = { hello: "Hello" };
    I18NManagerStore.registerLocalization({
      context: this,
      namespace: NS,
      localesPath: LOCALES,
      locales: ["es", "fr"],
    });
  }
  connectedCallback() {
    super.connectedCallback();
    restoreLocalization(this);
  }
  disconnectedCallback() {
    releaseLocalization(this);
    super.disconnectedCallback();
  }
}
customElements.define("i18n-direct-element", DirectI18nElement);

describe("releaseLocalization / restoreLocalization", () => {
  it("release on removal and register again on reconnect", async () => {
    const wrap = await fixture(
      html`<div><i18n-direct-element></i18n-direct-element></div>`,
    );
    const el = wrap.querySelector("i18n-direct-element");
    expect(registered(el)).to.equal(1);
    el.remove();
    expect(registered(el)).to.equal(0);
    wrap.appendChild(el);
    expect(registered(el)).to.equal(1);
    // a second connect without a disconnect does not register twice
    restoreLocalization(el);
    expect(registered(el)).to.equal(1);
  });
});
