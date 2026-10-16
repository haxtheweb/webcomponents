import { expect } from "@open-wc/testing";

import { HAXStore } from "../lib/hax-store.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// central registration of <tag>.haxProperties locales for blocks whose
// haxProperties point at <package>/lib/<tag>.haxProperties.json
const LIB_TAG = "i18n-lib-schema-probe";
const INLINE_TAG = "i18n-inline-schema-probe";
const OTHER_PATH_TAG = "i18n-other-path-probe";
const BASE = "https://cdn.example.com/elements/probe-pkg";

if (!globalThis.customElements.get(LIB_TAG)) {
  globalThis.customElements.define(
    LIB_TAG,
    class extends HTMLElement {
      static get haxProperties() {
        return `${BASE}/lib/${LIB_TAG}.haxProperties.json`;
      }
    },
  );
}
if (!globalThis.customElements.get(INLINE_TAG)) {
  globalThis.customElements.define(
    INLINE_TAG,
    class extends HTMLElement {
      static get haxProperties() {
        return { gizmo: { title: "Inline" } };
      }
    },
  );
}
if (!globalThis.customElements.get(OTHER_PATH_TAG)) {
  globalThis.customElements.define(
    OTHER_PATH_TAG,
    class extends HTMLElement {
      static get haxProperties() {
        return `${BASE}/schemas/${OTHER_PATH_TAG}.json`;
      }
    },
  );
}

function registered(tag) {
  return I18NManagerStore.elements.filter(
    (el) => el.namespace === `${tag}.haxProperties`,
  );
}
function forget(tag) {
  I18NManagerStore.elements = I18NManagerStore.elements.filter(
    (el) => el.namespace !== `${tag}.haxProperties`,
  );
}

describe("hax-store _registerHaxPropertiesLocales", () => {
  afterEach(() => {
    [LIB_TAG, INLINE_TAG, OTHER_PATH_TAG].forEach(forget);
  });

  it("registers the namespace with the package locales folder", () => {
    HAXStore._registerHaxPropertiesLocales(LIB_TAG);
    const found = registered(LIB_TAG);
    expect(found.length).to.equal(1);
    expect(found[0].localesPath).to.equal(`${BASE}/locales`);
  });

  it("does not register twice", () => {
    HAXStore._registerHaxPropertiesLocales(LIB_TAG);
    HAXStore._registerHaxPropertiesLocales(LIB_TAG);
    expect(registered(LIB_TAG).length).to.equal(1);
  });

  it("leaves an existing registration alone", () => {
    I18NManagerStore.registerLocalization({
      namespace: `${LIB_TAG}.haxProperties`,
      localesPath: "https://elsewhere.example.com/locales",
    });
    HAXStore._registerHaxPropertiesLocales(LIB_TAG);
    const found = registered(LIB_TAG);
    expect(found.length).to.equal(1);
    expect(found[0].localesPath).to.equal(
      "https://elsewhere.example.com/locales",
    );
  });

  it("skips inline haxProperties objects", () => {
    HAXStore._registerHaxPropertiesLocales(INLINE_TAG);
    expect(registered(INLINE_TAG).length).to.equal(0);
  });

  it("skips schema URLs outside <package>/lib/<tag>.haxProperties.json", () => {
    HAXStore._registerHaxPropertiesLocales(OTHER_PATH_TAG);
    expect(registered(OTHER_PATH_TAG).length).to.equal(0);
  });

  it("ignores tags that are not defined", () => {
    expect(() =>
      HAXStore._registerHaxPropertiesLocales("not-a-defined-probe"),
    ).to.not.throw();
    expect(registered("not-a-defined-probe").length).to.equal(0);
  });
});
