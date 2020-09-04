/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./lib/simple-iconset.js";
/**
 * `simple-icon`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
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
        feFlood {
          flood-color: var(--simple-colors-default-theme-accent-8, #000000);
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter
          color-interpolation-filters="sRGB"
          x="0"
          y="0"
          height="100%"
          width="100%"
        >
          <feFlood result="COLOR" />
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
        type: String
      },
      icon: {
        type: String
      }
    };
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    const randomId =
      "f-" +
      Math.random()
        .toString()
        .slice(2, 10);
    this.shadowRoot.querySelector("image").style.filter = `url(#${randomId})`;
    this.shadowRoot.querySelector("filter").setAttribute("id", randomId);
  }
  /**
   * Set the src by the icon property
   */
  setSrcByIcon(context) {
    this.src = window.SimpleIconset.requestAvailability().getIcon(
      this.icon, context
    );
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
            .setAttribute("xlink:href", this[propName]);
        }
      }
    });
  }
}
customElements.define(SimpleIcon.tag, SimpleIcon);
export { SimpleIcon };
