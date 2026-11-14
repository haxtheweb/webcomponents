/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, css } from "lit";
import { SimpleColorsSuper } from "@haxtheweb/simple-colors/simple-colors.js";
import {
  DDDReset,
  DDDAllStyles,
  DDDFonts,
  DDDPulseEffect,
  DDDAnimations,
  HAXOptionSampleFactory,
} from "./lib/DDDStyles.js";
import { DesignSystemManager } from "./lib/DesignSystemManager.js";

/**
 * `d-d-d`
 * `design, develop, deliver`
 * @demo demo/index.html
 * @demo demo/ddd-next.html Blocks under each design system
 */

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

    removePulseEffect(_e) {
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
      this.isSafari = globalThis.safari !== undefined;
      // DesignSystemManager is undefined without a document.body (e.g. Lit SSR)
      if (DesignSystemManager && !DesignSystemManager.systems.ddd) {
        DesignSystemManager.addDesignSystem({
          name: "ddd",
          styles: DDDAllStyles,
          fonts: DDDFonts,
          integrations: {
            hax: {
              importer: () =>
                import("@haxtheweb/d-d-d/lib/DDDStyleGuideAuthoring.js"),
              exportName: "registerDDDStyleGuideAuthoring",
              shouldLoad: (context) =>
                !!context &&
                !!context.editMode &&
                context.isAuthenticated !== false,
              options: {
                HAXOptionSampleFactory,
              },
            },
          },
          onload: () => {
            // check for css feature support
            if (!CSS.supports("initial-letter", "1")) {
              console.warn("CSS feature: initial-letter not supported");
              console.warn("Adding dropCap-noSupport class");
              globalThis.document.body.classList.add("dropCap-noSupport");
            }
          },
          hax: true,
        });
        DesignSystemManager.active = "ddd";
      }
    }
    static get properties() {
      return {
        ...super.properties,
        isSafari: { type: Boolean, reflect: true, attribute: "is-safari" },
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
      return [
        styles,
        DDDReset,
        css`
          /* :host too: * only matches inside the shadow root, so a
             transition on the element itself escaped the stop */
          @media (prefers-reduced-motion: reduce) {
            :host,
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              transition-delay: 0ms !important;
              scroll-behavior: auto !important;
            }
          }
        `,
      ];
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

export { DDDFonts };

// DDD Atomic Design pattern library -> HAX stax rail activation.
// DISABLED for now: the publish-into-stax wiring exists in
// lib/DDDPatternStax.js (see DDDPatternLibrary.js), but we are not
// populating the stax rail yet. The next step is designing the page-level
// compositions to turn into patterns before re-enabling this.
// Follow-up: https://github.com/haxtheweb/issues/issues/3040
// (parent: https://github.com/haxtheweb/issues/issues/3039)
//
// To re-enable, lazy-load and call activateDDDPatternStax() only when the
// HAX editor is available so sites that just use DDD variables don't pay
// the registry cost, e.g.:
//   import("./lib/DDDPatternStax.js").then(
//     ({ activateDDDPatternStax }) => activateDDDPatternStax(),
//     () => {},
//   );
// gated on globalThis.HaxStore / the "hax-store-ready" event.
