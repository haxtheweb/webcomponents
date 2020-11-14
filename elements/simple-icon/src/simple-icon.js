/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { svg, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SimpleIconsetStore } from "./lib/simple-iconset.js";
/**
 * `simple-icon`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @demo demo/button.html Button
 * @element simple-icon
 */
class SimpleIcon extends SimpleColors {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-icon";
  }
  static get styles() {
    return [
      ...super.styles,
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
        }
        image {
          height: var(--simple-icon-height, 24px);
          width: var(--simple-icon-width, 24px);
        }
        feFlood {
          flood-color: var(
            --simple-icon-color,
            var(--simple-colors-default-theme-accent-8, #000000)
          );
        }
        feFlood.contrast-1 {
          flood-color: var(
            --simple-icon-color,
            var(--simple-colors-default-theme-accent-9, #000000)
          );
        }
        feFlood.contrast-2 {
          flood-color: var(
            --simple-icon-color,
            var(--simple-colors-default-theme-accent-10, #000000)
          );
        }
        feFlood.contrast-3 {
          flood-color: var(
            --simple-icon-color,
            var(--simple-colors-default-theme-accent-11, #000000)
          );
        }
        feFlood.contrast-4 {
          flood-color: var(
            --simple-icon-color,
            var(--simple-colors-default-theme-accent-12, #000000)
          );
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
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter
          color-interpolation-filters="sRGB"
          x="0"
          y="0"
          height="100%"
          width="100%"
        >
          ${
            !this.noColorize
              ? svg`<feFlood class="contrast-${this.contrast}" result="COLOR" />`
              : ``
          }
          <feComposite operator="in" in="COLOR" in2="SourceAlpha" />
        </filter>
        <image
          xlink:href=""
          width="100%"
          height="100%"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
        ></image>
      </svg>
    `;
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
      contrast: {
        type: Number,
        attribute: "contrast",
        reflect: true,
      },
    };
  }
  constructor() {
    super();
    this.contrast = 0;
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
}
customElements.define(SimpleIcon.tag, SimpleIcon);
export { SimpleIcon };
