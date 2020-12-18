/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { svg, css, LitElement } from "lit-element/lit-element.js";
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
          }
          :host([hidden]) {
            display: none;
          }
          svg {
            height: var(--simple-icon-height, 24px);
            width: var(--simple-icon-width, 24px);
            max-height: var(--simple-icon-height, 24px);
            max-width: var(--simple-icon-width, 24px);
          }
          feFlood {
            flood-color: var(--simple-icon-color, currentColor);
          }
          svg {
            pointer-events: none;
          }
        `,
      ];
    }
    // render function
    render() {
      return svg`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
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
      return !this.noColorize ? svg`<feFlood result="COLOR" />` : ``;
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,
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
    }
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
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
        if (propName == "icon") {
          if (this[propName]) {
            this.setSrcByIcon(this);
          } else {
            this.src = null;
          }
        }
        if (propName == "src") {
          // look this up in the registry
          if (this[propName]) {
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
