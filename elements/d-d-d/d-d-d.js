/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full details.
 */
import { LitElement, css, html } from "lit";
import { SimpleColorsSuper } from "@haxtheweb/simple-colors/simple-colors.js";
import {
  DDDReset,
  DDDAllStyles,
  DDDFonts,
  DDDPulseEffect,
  DDDAnimations,
  DDDDataAttributes,
  ApplicationAttributeData,
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
    globalThis.document.body.classList.add("dropCap-noSupport");
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
      this.isSafari = globalThis.safari !== undefined;
      globalThis.DDDSharedStyles.requestAvailability();
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
  if (
    globalThis.DDDSharedStyles.instance == null &&
    globalThis.document &&
    globalThis.document.head
  ) {
    // convert css into text content of arrays mashed together
    // this way we can inject it into a global style sheet
    let globalStyles = DDDAllStyles.map((st) =>
      st.cssText ? st.cssText : "",
    ).join("");
    try {
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
    } catch (e) {
      const oldStyleSafariBs = globalThis.document.createElement("style");
      oldStyleSafariBs.innerHTML = globalStyles;
      globalThis.document.head.appendChild(oldStyleSafariBs);
      loadDDDFonts();
      globalThis.document.onload = dddCSSFeatureDetection();
      globalThis.DDDSharedStyles.instance = oldStyleSafariBs;
    }
  }
  return globalThis.DDDSharedStyles.instance;
};
// self-appending on call
export const DDDSharedStylesGlobal =
  globalThis.DDDSharedStyles.requestAvailability();

export { DDDFonts };

export class DDDSample extends DDDSuper(LitElement) {
  constructor() {
    super();
    this.type = null;
    this.option = 0;
  }

  static get styles() {
    return [
      super.styles,
      ...DDDDataAttributes,
      css`
        :host {
          display: flex;
          min-height: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-1) 0;
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          line-height: normal;
        }
        :host([type="accent"]:hover),
        :host([type="primary"]:hover) {
          color: black;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-limestoneGray)
          );
        }

        :host([type="accent"]) .sample,
        :host([type="primary"]) .sample {
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-xs);
          box-shadow: var(--ddd-boxShadow-sm);
          height: var(--ddd-spacing-4);
          width: var(--ddd-spacing-8);
          display: inline-block;
        }

        :host([type="border"]) .sample,
        :host([type="border-radius"]) .sample,
        :host([type="box-shadow"]) .sample {
          --ddd-theme-primary: var(--ddd-sample-theme-primary, black);
          --ddd-theme-accent: var(
            --ddd-sample-theme-accent,
            var(--ddd-accent-3)
          );
          background-color: var(--ddd-theme-accent);
          border-color: var(--ddd-theme-primary);
          height: var(--ddd-spacing-4);
          width: var(--ddd-spacing-8);
          display: inline-block;
        }
        :host([type="border"]) .sample {
          height: calc(var(--ddd-spacing-4) - var(--ddd-theme-border-size));
          width: calc(var(--ddd-spacing-8) - var(--ddd-theme-border-size));
        }
        :host([type="border-radius"]) .sample {
          border: var(--ddd-border-lg);
          height: var(--ddd-spacing-8);
          width: var(--ddd-spacing-8);
          border-color: var(--ddd-theme-primary);
          clip-path: polygon(50% 0, 0 50%, 0 0, 0 0);
          transform: scale(4);
          padding: 0;
          margin-left: 64px;
          margin-top: 64px;
        }
        :host([type="box-shadow"]) .sample {
          border: var(--ddd-border-sm);
          border-color: var(--ddd-theme-primary);
          margin: 0 12px 12px 12px;
        }

        :host([type="accent"]:hover) .sample,
        :host([type="primary"]:hover) .sample {
          border-color: black;
        }
        :host([type="border"]) .label,
        :host([type="box-shadow"]) .label,
        :host([type="accent"]) .label,
        :host([type="primary"]) .label,
        :host([type="margin"]) .label,
        :host([type="padding"]) .label {
          font-size: var(--ddd-font-size-4xs);
          margin-left: var(--ddd-spacing-3);
          display: inline-block;
          vertical-align: top;
        }
        :host([type="border-radius"]) .label {
          margin-left: calc(-1 * var(--ddd-spacing-5));
          display: inline-block;
          vertical-align: top;
          height: var(--ddd-spacing-20);
          line-height: var(--ddd-spacing-20);
        }

        :host([type="margin"]) .label,
        :host([type="padding"]) .label {
          font-weight: var(--ddd-font-weight-bold);
        }
        :host([type="accent"]) .sample {
          background-color: var(--ddd-theme-accent);
        }
        :host([type="primary"]) .sample {
          background-color: var(--ddd-theme-primary);
        }

        :host([type="margin"]) .sample[data-margin],
        :host([type="padding"]) .sample {
          display: inline-block;
          height: var(--ddd-spacing-6);
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          background-color: var(--ddd-primary-2);
          margin: 0;
        }

        /* design treatments may require display block */
        :host([type="design-treatment"]) .label {
          display: block;
          font-weight: bold;
          --ddd-theme-primary: var(
            --ddd-sample-theme-primary,
            var(--ddd-primary-16)
          );
          min-height: calc(
            (var(--initialLetter) / 3 * var(--ddd-theme-body-font-size) * 1.5) +
              20px
          );
        }

        /** TODO this needs to be set via some kind of similar ddd-samples global in order to work for the bg option */
        :host([type="design-treatment"][option="bg"]) .label {
          color: var(--ddd-theme-bgContrast);
        }

        :host([type="font-weight"]) .label,
        :host([type="font-family"]) .label {
          font-size: var(--ddd-font-size-s);
        }

        /* @hack just for the docs bc we can't visualize margins */
        [data-margin="center"] {
          margin-left: auto;
          margin-right: auto;
        }
        [data-margin="xs"] {
          padding: var(--ddd-spacing-2);
        }
        [data-margin="s"] {
          padding: var(--ddd-spacing-4);
        }
        [data-margin="m"] {
          padding: var(--ddd-spacing-8);
        }
        [data-margin="l"] {
          padding: var(--ddd-spacing-12);
        }
        [data-margin="xl"] {
          padding: var(--ddd-spacing-16);
        }

        /* @hack from normal presentation so that it renders nicely here */
        [data-instructional-action]::before {
          padding: 6px 0 0;
          margin: 8px 16px 0 0;
        }

        /* @hack so that we reduce the size of the drop cap or it'll be ridiculous */
        :host([type="design-treatment"])
          .label[data-design-treatment^="dropCap"]::first-letter {
          -webkit-initial-letter: calc(var(--initialLetter) / 3);
          initial-letter: calc(var(--initialLetter) / 3);
        }
        /* @hack so we can see fonts relative to each other, not exact size */
        :host([type="font-size"]) span ::slotted(*) {
          font-size: var(--ddd-font-size-xs);
        }
        :host([type="font-size"]) .label {
          font-size: 0.8em;
        }
        :host([option^="type"]) .label {
          font-size: 0.5em;
        }
        :host([option^="type"]) .label::after {
          content: " (50% scale)";
          font-size: var(--ddd-font-size-4xs);
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("type") && this.shadowRoot) {
      let span;
      // accent, primary, spacing
      if (
        [
          "accent",
          "primary",
          "padding",
          "margin",
          "border-radius",
          "box-shadow",
          "border",
        ].includes(this.type)
      ) {
        span = this.shadowRoot.querySelector("span.sample");
      } else if (this.type === "font-size") {
        span = this.shadowRoot.querySelector("div.wrapper");
      } else {
        span = this.shadowRoot.querySelector("span.label");
      }
      for (let i in ApplicationAttributeData) {
        span.removeAttribute(`data-${i}`);
      }
      // delay to ensure prev executes in order
      setTimeout(() => {
        span.setAttribute(`data-${this.type}`, this.option);
      }, 0);
    }
    if (changedProperties.has("option") && this.shadowRoot && this.type) {
      let span = this.shadowRoot.querySelector(`span[data-${this.type}]`);
      if (span) {
        span.setAttribute(`data-${this.type}`, this.option);
      }
    }
  }

  render() {
    return html`
      <div class="wrapper">
        <span class="sample"></span
        ><span class="label"
          >${ApplicationAttributeData[this.type][this.option]}<slot></slot
        ></span>
      </div>
    `;
  }

  static get properties() {
    return {
      type: { type: String, reflect: true },
      option: { type: String },
    };
  }

  static get tag() {
    return "d-d-d-sample";
  }
}

globalThis.customElements.define(DDDSample.tag, DDDSample);
