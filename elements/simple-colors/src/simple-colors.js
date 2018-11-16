/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
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
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
//import { SimpleColorsManager } from "./lib/simple-colors-manager.js"; //import the shared styles
import { SimpleColorsManager } from "./lib/simple-colors-shared-styles.js"; //import the shared styles

export class SimpleColors extends PolymerElement {
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
        value: null,
        reflectToAttribute: true,
        observer: false
      },
      colors: {
        name: "colors",
        type: "Object",
        value: {},
        reflectToAttribute: false,
        observer: false
      }
    };
  }

  // render function
  static get template() {
    return html`<style is="custom-style" include="simple-colors-shared-styles"></style>`;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    SimpleColorsManager.requestAvailability();
    this.set("colors", SimpleColorsManager.colors);
    //console.log(this.colors);
    this.getContrasts("--simple-colors-default-theme-accent-5");
    this.getContrasts("--simple-colors-dark-theme-grey-2", false);
    this.getContrasts("--simple-colors-dark-theme-red-11", true);
    this.getContrasts("--simple-colors-dark-theme-grey-1", true);
    super.connectedCallback();
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  getContrasts(variable, large) {
    large = large !== undefined && large !== null ? large : false;
    let details = variable.replace("--", "").split("-"),
      theme = details[2],
      color = details[4],
      level = details[5];
    let makeColor = function(theme, color, level) {
      return "--simple-colors-" + [theme, "theme", color, level].join("-");
    };
    console.log(
      variable,
      large,
      theme,
      color,
      level,
      makeColor(theme, color, level)
    );
  }
}
customElements.define(SimpleColors.is, SimpleColors);
