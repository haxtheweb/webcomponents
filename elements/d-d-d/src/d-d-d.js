/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full details.
 */
import { LitElement } from "lit";
import { SimpleColorsSuper } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { DDDReset, DDDAllStyles, DDDFonts } from "./lib/DDDStyles.js";

/**
 * `d-d-d`
 * `design, develop, destroy the competition`
 * @demo demo/index.html
 */

// call this to load all the fonts that are official
export function loadDDDFonts() {
  if (
    globalThis &&
    globalThis.document &&
    !globalThis.document.querySelector('[data-ddd="font"]')
  ) {
    DDDFonts.forEach((font) => {
      const link = globalThis.document.createElement("link");
      link.setAttribute("href", font);
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("fetchpriority", "low");
      link.setAttribute("data-ddd", "font");
      globalThis.document.head.appendChild(link);
    });
  }
}

// super class so we can mix styles into other things more easily
export const DDDSuper = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      globalThis.DDDSharedStyles.requestAvailability();
    }
    /**
     * LitElement style callback
     */
    static get styles() {
      // support for using in other classes
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [styles, DDDReset];
    }
  };
};

// autoloads fonts and gives it a tag name; this is useful
class DDD extends DDDSuper(SimpleColorsSuper(LitElement)) {
  constructor() {
    super();
  }
  static get tag() {
    return "d-d-d";
  }
}

globalThis.customElements.define(DDD.tag, DDD);
export { DDD };

/**
 * Checks to see if there is an instance available, and if not appends one.
 * then it injects the styles into the global document scope so that they can be used anywhere
 */
globalThis.DDDSharedStyles = globalThis.DDDSharedStyles || {};
globalThis.DDDSharedStyles.requestAvailability = () => {
  if (globalThis.DDDSharedStyles.instance == null) {
    // convert css into text content of arrays mashed together
    // this way we can inject it into a global style sheet
    let globalStyles = DDDAllStyles.map((st) =>
      st.cssText ? st.cssText : "",
    ).join("");
    const adoptableDDD = new CSSStyleSheet();
    adoptableDDD.replaceSync(globalStyles);
    // THIS FLAG MAKES HAX LOAD IT IN ITS SHADOW ROOT!!!!
    adoptableDDD.hax = true;
    // Combine the existing adopted sheets if we need to but these will work everywhere
    // and are very fast
    globalThis.document.adoptedStyleSheets = [
      ...globalThis.document.adoptedStyleSheets,
      adoptableDDD,
    ];
    loadDDDFonts();
    globalThis.DDDSharedStyles.instance = adoptableDDD;
  }
  return globalThis.DDDSharedStyles.instance;
};
// self-appending on call
export const DDDSharedStylesGlobal =
  globalThis.DDDSharedStyles.requestAvailability();

export { DDDFonts };
