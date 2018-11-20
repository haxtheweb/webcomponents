/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";

import { SimpleColors } from "../simple-colors.js"; //import the shared styles
import "./simple-colors-demo-child.js";

export { SimpleColorsDemo };
/**
 * `simple-colors-demo`
 * `an example of how to extend simple-colors within a custom element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @see "./simple-colors-demo.js"
 * @see "../simple-colors.js"
 * @demo demo/index.html
 */
class SimpleColorsDemo extends SimpleColors {
  // render function
  static get template() {
    return html`
<style>
:host {
  display: inline;
}
:host([hidden]){
  display: none;
}
select {
  font-family: monospace;
}
</style>
<select id="accent" on-change="_handleSelectChange" aria-label="[[accentLabel]]">
  <option>--- (accent not specified) ---</option>
  <template is="dom-repeat" items="[[_toArray(colors)]]" as="color">
    <option value="[[color.name]]">accent-color="[[color.name]]"</option>
  </template>
</select> 
<select id="dark" on-change="_handleSelectChange" aria-label="[[darkLabel]]">
  <option value="false">--- (dark not specified) ---</option>
  <option value="dark">dark="dark"</option>
</select>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * sets the label for the accent-color <select>
       */
      accentLabel: {
        name: "accentLabel",
        type: "String",
        value: "accent-color property",
        reflectToAttribute: true,
        observer: false
      },
      /**
       * sets the label for the dark <select>
       */
      darkLabel: {
        name: "darkLabel",
        type: "String",
        value: "dark property",
        reflectToAttribute: true,
        observer: false
      },
      /**
       * used to escape the opening brackets in the template
       */
      __open: {
        name: "open",
        type: "String",
        value: '$="[[',
        reflectToAttribute: false,
        observer: false
      },
      /**
       * used to escape the closing brackets in the template
       */
      __close: {
        name: "open",
        type: "String",
        value: ']]"',
        reflectToAttribute: false,
        observer: false
      }
    };
  }

  /**
   * gets simple-colors behaviors
   */
  static get behaviors() {
    return [SimpleColors];
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-demo";
  }

  /**
   * determines if a given <option> is selected based on the option's value and this element's accent-color
   *
   * @param {String} the option's value
   */
  _accentSelected(option) {
    return this.accentColor === option ? "selected" : "";
  }

  /**
   * handles when the on-change event for <select>
   *
   * @param {object} the event that fires
   */
  _handleSelectChange(e) {
    if (e.path[0].id === "accent") {
      this.accentColor = e.path[0].value;
    } else if (e.path[0].id === "dark") {
      this.dark = e.path[0].value !== "false";
    }
  }

  /**
   * converts an object into an array
   *
   * @param {object} the object to convert
   */
  _toArray(obj) {
    return Object.keys(obj).map(function(key) {
      return {
        name: key,
        value: obj[key]
      };
    });
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleColorsDemo.tag, SimpleColorsDemo);
