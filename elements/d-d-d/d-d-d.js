/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full details.
 */
import { LitElement } from "lit";
import { SimpleColorsSuper } from "@haxtheweb/simple-colors/simple-colors.js";
import {
  DDDReset,
  DDDAllStyles,
  DDDFonts,
  DDDPulseEffect,
  DDDAnimations,
} from "./lib/DDDStyles.js";

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

export function dddCSSFeatureDetection() {
  // check for css feature support
  if (!CSS.supports("initial-letter", "1")) {
    console.warn("CSS feature: initial-letter not supported");
    console.warn("Adding dropCap-noSupport class");
    document.body.classList.add("dropCap-noSupport");
  }
}

// will have just pulse effect

export const DDDPulseEffectSuper = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.dataPulse = null;
      this.__abortController = new AbortController();
    }

    static get properties() {
      return {
        ...super.properties,
        dataPulse: { type: String, reflect: true, attribute: "data-pulse" },
      };
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
      return [styles, DDDPulseEffect, DDDAnimations];
    }

    removePulseEffect(e) {
      this.dataPulse = null;
    }

    togglePulseEffect(status) {
      // apply the effect or whatever
      if (status) {
        this.__abortController = new AbortController();
        this.addEventListener("mouseenter", this.removePulseEffect, {
          signal: this.__abortController.signal,
        });
      } else {
        this.removeEventListener("mouseenter", this.removePulseEffect);
        this.__abortController.abort();
      }
    }

    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      if (changedProperties.has("dataPulse")) {
        if (this.dataPulse !== null) {
          this.togglePulseEffect(true);
        } else {
          this.togglePulseEffect(false);
        }
      }
    }
  };
};

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
    globalThis.document.onload = dddCSSFeatureDetection();
    globalThis.DDDSharedStyles.instance = adoptableDDD;
  }
  return globalThis.DDDSharedStyles.instance;
};
// self-appending on call
export const DDDSharedStylesGlobal =
  globalThis.DDDSharedStyles.requestAvailability();

export { DDDFonts };
