/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full details.
 */
import { LitElement, css } from "lit";
import { SimpleColorsSuper } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { DDDReset, DDDVariables } from "./lib/DDDStyles.js";

/**
 * `d-d-d`
 * `design, develop, destroy the competition`
 * @demo demo/index.html
 */

export const DDDFonts = [
  "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&display=swap",
  "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap",
  "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap",
];

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
  return class extends SimpleColorsSuper(SuperClass) {
    constructor() {
      super();
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
      return [styles, DDDVariables, DDDReset];
    }
  };
};

// autoloads fonts and gives it a tag name; this is useful
class DDD extends DDDSuper(LitElement) {
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
  if (globalThis.DDDSharedStyles.instance == null && globalThis.document) {
    // convert css into text content of arrays mashed together
    // this way we can inject it into a global style sheet
    let globalStyles = DDD.styles
      .map((st) => (st.cssText ? st.cssText : ""))
      .join("");
    globalThis.DDDSharedStyles.instance =
      globalThis.document.createElement("style");
    // marker for debugging to make it easier to find
    globalThis.DDDSharedStyles.instance.setAttribute(
      "data-ddd",
      "global-styles",
    );
    globalThis.DDDSharedStyles.instance.innerHTML = `${globalStyles}`;
    loadDDDFonts();
    globalThis.document.body.appendChild(globalThis.DDDSharedStyles.instance);
  }
  return globalThis.DDDSharedStyles.instance;
};
// self-appending on call
export const DDDSharedStylesGlobal =
  globalThis.DDDSharedStyles.requestAvailability();
