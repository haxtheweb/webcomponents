/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";

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
 * @see "./simple-colors-demo-child.js"
 * @see "../simple-colors.js"
 * @demo demo/extending.html
 */
class SimpleColorsDemo extends SimpleColors {
  // render function
  static get template() {
    return html`
<style is="custom-style" include="simple-colors">
:host {
  background-color: var(--simple-colors-default-theme-accent-1); 
  color: var(--simple-colors-default-theme-grey-12); 
  border: 1px solid var(--simple-colors-default-theme-accent-6);
  margin: 15px 0;
  padding: 15px;
  display: block;
}
:host([hidden]){
  display: none;
}
a, a[link] {
  color: var(--simple-colors-default-theme-blue-8); 
}
a[visited] {
  color: var(--simple-colors-default-theme-purple-8); 
}
select {
  font-family: monospace;
}
</style>

<p>
  <tt>
    &lt;simple-colors-demo
    <select id="paccent" on-change="_handleSelectChange" aria-label="parent's accent-color">
      <option>--- (accent not specified) ---</option>
      <template is="dom-repeat" items="[[_toArray(colors)]]" as="color">
        <option value="[[color.name]]">accent-color="[[color.name]]"</option>
      </template>
    </select> 
    <select id="pdark" on-change="_handleSelectChange" aria-label="parent's dark attribute">
      <option value="false">--- (dark not specified) ---</option>
      <option value="dark">dark="dark"</option>
    </select>&gt; 
  </tt>
</p>
<template is="dom-if" if="[[_isNested(nested)]]">
  <simple-colors-demo-child accent-color$="[[__accentColorChild]]" dark$="[[__darkChild]]">
    <tt>&lt;simple-colors-demo-child
      <select id="caccent" on-change="_handleSelectChange" aria-label="nested child's accent-color">
      <option value="false">--- (accent not specified) ---</option>
      <option value$="[[accentColor]]">accent-color[[__open]]accentColor[[__close]]</option>
      <template is="dom-repeat" items="[[_toArray(colors)]]" as="color">
        <option value="[[color.name]]">accent-color="[[color.name]]"</option>
      </template>
    </select> 
    <select id="cdark" on-change="_handleSelectChange" aria-label="nested child's dark attribute">
      <option value="false">--- (dark not specified) ---</option>
      <option value="parent">dark[[__open]]dark[[__close]]</option>
      <option value="dark">dark="dark"</option>
    </select>/&gt;</tt>
  </simple-colors-demo-child>
</template>

<p><tt>&lt;/simple-colors-demo&gt;</tt></p>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * show a nested child element in this custom element?
       */
      nested: {
        name: "nested",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
      },
      /**
       * sets the accent-color attribute of the nested child
       */
      __accentColorChild: {
        name: "__accentColorChild",
        type: "String",
        value: null,
        reflectToAttribute: false,
        observer: false
      },
      /**
       * stores the selection for mthe child's dark selector
       */
      __darkSelectorChild: {
        name: "__darkSelectorChild",
        type: "Boolean",
        value: false,
        reflectToAttribute: false,
        observer: false
      },
      /**
       * sets the dark attribute of the nested child
       */
      __darkChild: {
        name: "__darkChild",
        type: "Boolean",
        value: false,
        reflectToAttribute: false,
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
   * determines if the element is in nested mode
   *
   * @param {boolean} the element's nested property
   */
  _isNested(nested) {
    return nested !== "false" && nested !== false;
  }

  /**
   * handles when the on-change event for <select>
   *
   * @param {object} the event that fires
   */
  _handleSelectChange(e) {
    if (e.path[0].id === "paccent") {
      this.accentColor = e.path[0].value;
    } else if (e.path[0].id === "caccent") {
      this.__accentColorChild = e.path[0].value;
    } else if (e.path[0].id === "pdark") {
      this.dark = e.path[0].value !== "false";
    } else {
      this.__darkSelectorChild = e.path[0].value !== "false";
    }
    this.__darkChild =
      this.__darkSelectorChild === "parent"
        ? this.dark
        : this.__darkSelectorChild !== false;
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
