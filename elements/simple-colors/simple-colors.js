/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColorsManager } from "./lib/simple-colors-shared-styles.js"; //import the shared styles

export { SimpleColors };
/**
 * `simple-colors`
 * `extend elements with simple-colors to give them the color-management properties and utilities `
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class SimpleColors extends PolymerElement {
  static get is() {
    return "simple-colors";
  }

  static get properties() {
    return {
      accentColor: {
        name: "accentColor",
        type: "String",
        value: "grey",
        reflectToAttribute: true,
        observer: false
      },
      dark: {
        name: "dark",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
      },
      colors: {
        name: "colors",
        type: "Object",
        value: null,
        reflectToAttribute: false,
        observer: false
      },
      __wcagContrast: {
        name: "__wcagContrast",
        type: "Object",
        value: null,
        reflectToAttribute: false,
        observer: false
      },
      __sharedStyles: {
        name: "__sharedStyles",
        type: "String",
        computed: "_getSharedStyles(colors)",
        reflectToAttribute: false,
        observer: false
      }
    };
  }

  // render function
  static get template() {
    return html`<style is="custom-style" include="simple-colors-shared-styles"></style>
  <slot></slot>`;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    SimpleColorsManager.requestAvailability();
    this.set("colors", SimpleColorsManager.colors);
    this.set("__wcagContrast", SimpleColorsManager.wcagContrast);
    this.getContrasts("--simple-colors-default-theme-accent-5");
    this.getContrasts("--simple-colors-dark-theme-grey-2", false);
    this.getContrasts("--simple-colors-dark-theme-red-11", true);
    this.getContrasts("--simple-colors-dark-theme-grey-1", true);
    super.connectedCallback();
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  _getSharedStyles(colors) {
    let addLevels = function(color1, theme1, color2, invert) {
        let levels = this.colors[color2],
          str = [];
        for (let i = 0; i < levels.length; i++) {
          let index = invert ? 11 - i : i;
          str.push(
            "--simple-colors-" +
              theme +
              "-theme-" +
              color1 +
              "-" +
              (i + 1) +
              ":" +
              this.colors[color2][index] +
              ";"
          );
        }
        return str.join("");
      },
      addColors = function(isTheme) {
        let str = isTheme ? ["<style>"] : [""];
        for (let color in this.colors) {
        }
      };
    if (colors !== null) {
    }
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  getContrasts(variable, large) {
    large = large !== undefined && large !== null ? large : false;
    let contrasts = [],
      details = variable.replace("--", "").split("-"),
      theme = details[2],
      grey = details[4] === "grey";
    for (let color in this.colors) {
      let wcag =
          this.colors[color] === "grey" || grey
            ? this.__wcagContrast.colorOnColor
            : this.__wcagContrast.greyOnColor,
        largeOrSmall = large ? wcag.large : wcag.small,
        colorLevel = largeOrSmall[details[5] - 1],
        min = colorLevel.minLevelContrast - 1,
        max = colorLevel.maxLevelContrast - 1;
      for (let i = min; i <= max; i++) {
        contrasts.push({
          color: "--simple-colors-" + [theme, "theme", color, i + 1].join("-"),
          hex: this.colors[color][i]
        });
      }
    }
    return contrasts;
  }
}
customElements.define(SimpleColors.is, SimpleColors);
