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
  constructor() {
    super();
    window.SimpleIconset.requestAvailability();
  }
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
        }
        svg {
          color: var(--simple-colors-default-theme-accent-1, #000000);
        }
      `]
  }
  // render function
  render() {
      return html`
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%">
          <feFlood result="COLOR" />
          <feComposite operator="in" in="COLOR" in2="SourceAlpha" />
        </filter>
        <image xlink:href="${this.src}" width="100%" height="100%"></image>
      </svg>`;
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
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        if (propName == 'icon') {
          // look this up in the registry
        }
      });
    }
  }
  customElements.define(SimpleIcon.tag, SimpleIcon);
  export { SimpleIcon };
  