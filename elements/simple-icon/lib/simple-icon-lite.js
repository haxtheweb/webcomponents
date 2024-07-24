/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, svg, css, LitElement } from "lit";
import { SimpleIconsetStore } from "./simple-iconset.js";

export const SimpleIconBehaviors = function (SuperClass) {
  return class extends SuperClass {
    static get styles() {
      return [
        ...[super.styles || []],
        css`
          :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: relative;
            vertical-align: middle;
            height: var(--simple-icon-height, 24px);
            width: var(--simple-icon-width, 24px);
            color: var(--simple-icon-color, currentColor);
          }
          :host([dir="rtl"]) svg {
            direction: rtl;
          }
          :host([hidden]) {
            display: none;
          }
          #svg-polyfill {
            background-color: var(--simple-icon-color, currentColor);
            height: var(--simple-icon-height, 24px);
            width: var(--simple-icon-width, 24px);
          }
          svg {
            height: var(--simple-icon-height, 24px);
            width: var(--simple-icon-width, 24px);
            max-height: var(--simple-icon-height, 24px);
            max-width: var(--simple-icon-width, 24px);
            filter: var(--simple-icon-color, initial);
            pointer-events: none;
          }
          feFlood {
            flood-color: var(--simple-icon-color, currentColor);
          }
        `,
      ];
    }
    // render function
    render() {
      return this.useSafariPolyfill
        ? html`
            <div
              id="svg-polyfill"
              style="mask:${this.safariMask};-webkit-mask:${this.safariMask}"
            ></div>
          `
        : svg`
        <svg xmlns="http://www.w3.org/2000/svg" part="simple-icon-svg" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
          <filter
            color-interpolation-filters="sRGB"
            x="0"
            y="0"
            height="24px"
            width="24px"
          >
            ${this.feFlood}
            <feComposite operator="in" in="COLOR" in2="SourceAlpha" />
          </filter>
          <image
            xlink:href=""
            width="24px"
            height="24px"
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
          ></image>
        </svg>
      `;
    }

    get feFlood() {
      return !this.noColorize ? svg`<feFlood result="COLOR"/>` : ``;
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        dir: {
          type: String,
          reflect: true,
        },
        src: {
          type: String,
        },
        noColorize: {
          type: Boolean,
          attribute: "no-colorize",
        },
        icon: {
          type: String,
          attribute: "icon",
          reflect: true,
        },
      };
    }
    constructor() {
      super();
      this.noColorize = false;
      this.dir = this.documentDir;
    }
    get documentDir() {
      if (globalThis.document && globalThis.document.body) {
        return (
          globalThis.document.body.getAttribute("xml:dir") ||
          globalThis.document.body.getAttribute("dir") ||
          globalThis.document.documentElement.getAttribute("xml:dir") ||
          globalThis.document.documentElement.getAttribute("dir") ||
          "ltr"
        );
      }
      return "ltr";
    }
    get useSafariPolyfill() {
      return (
        globalThis.navigator &&
        globalThis.navigator.userAgent.indexOf("Safari") > -1
      );
    }
    get safariMask() {
      return this.src && this.useSafariPolyfill
        ? `url(${this.src}) no-repeat center / contain`
        : "";
    }
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      if (this.useSafariPolyfill) return;
      const randomId = "f-" + Math.random().toString().slice(2, 10);
      this.shadowRoot.querySelector("image").style.filter = `url(#${randomId})`;
      this.shadowRoot.querySelector("filter").setAttribute("id", randomId);
    }
    /**
     * Set the src by the icon property
     */
    setSrcByIcon(context) {
      this.src = SimpleIconsetStore.getIcon(this.icon, context);
      return this.src;
    }
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "icon") {
          if (this[propName]) {
            this.setSrcByIcon(this);
          } else {
            this.src = null;
          }
        }
        if (propName === "src") {
          // look this up in the registry
          if (this[propName] && !this.useSafariPolyfill) {
            this.shadowRoot
              .querySelector("image")
              .setAttribute("xlink:href", `${this[propName]}`);
          }
        }
      });
    }
  };
};
/**
 * `simple-icon-lite`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @extends LitElement
 * @extends SimpleIconBehaviors
 * @demo demo/lite.html
 * @demo demo/button-lite.html Button (Lite)
 * @element simple-icon-lite
 */
class SimpleIconLite extends SimpleIconBehaviors(LitElement) {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-icon-lite";
  }
}
customElements.define(SimpleIconLite.tag, SimpleIconLite);
export { SimpleIconLite };
