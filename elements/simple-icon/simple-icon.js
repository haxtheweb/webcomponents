/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { svg, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { SimpleIconBehaviors } from "./lib/simple-icon-lite.js";
/**
 * `simple-icon`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 * @customElement
 * @extends SimpleColors
 * @extends SimpleIconBehaviors
 * @demo demo/index.html
 * @demo demo/button.html Button
 * @demo demo/lite.html Lite
 * @demo demo/button-lite.html Button (Lite)
 * @demo demo/iconset.html Iconset Demo
 * @element simple-icon
 */
class SimpleIcon extends SimpleIconBehaviors(SimpleColors) {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-icon";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  static get styles() {
    return [
      super.styles,
      css`
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
      `,
    ];
  }
  get feFlood() {
    return !this.noColorize
      ? svg`<feFlood class="contrast-${this.contrast}" result="COLOR" />`
      : ``;
  }
  get useSafariPolyfill() {
    return false;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
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
  }
}
customElements.define(SimpleIcon.tag, SimpleIcon);
export { SimpleIcon };
