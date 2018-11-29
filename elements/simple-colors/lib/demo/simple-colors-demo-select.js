/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import { SimpleColors } from "../../simple-colors.js";

export { SimpleColorsDemoSelect };
/**
 * `simple-colors-select`
 * `a select element for changing simple-colors attributes in demos`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @see "../../simple-colors.js"
 */
class SimpleColorsDemoSelect extends SimpleColors {
  // render function
  static get template() {
    return html`
<style>
:host {
  display: inline-block;
}
:host([hidden]){
  display: none;
}
:host, 
:host label, 
:host select, 
:host option {
  font-family: monospace;
}
</style>
<slot name="prefix"></slot><select id="accent" on-change="_handleSelectChange">
  <template is="dom-repeat" items="[[_getOptions(options)]]" as="option">
    <option value="[[option.value]]" selected$="[[_optionSelected(option.name,value)]]">[[option.name]]</option>
  </template>
</select><slot name="suffix"></slot>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Can the element inherit attributes from a parent?
       */
      inherit: {
        name: "inherit",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
      },

      /**
       * the `<label>` for the `<select>`
       */
      label: {
        name: "label",
        type: "String",
        value: null,
        reflectToAttribute: true,
        observer: false
      },

      /**
       * the options array, eg.: `[ {"name": "dark", "value": "true"}, ...]`
       */
      options: {
        name: "options",
        type: "Array",
        value: null,
        reflectToAttribute: false,
        observer: false
      },

      /**
       * the value of the `<select>`
       */
      value: {
        name: "value",
        type: "String",
        value: null,
        reflectToAttribute: true,
        observer: false
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-demo-select";
  }

  /**
   * determines if a given <option> is selected based on the option's value and this element's accent-color
   *
   * @param {String} the option's value
   * @param {String} the property's value
   */
  _optionSelected(option, prop) {
    return prop === option ? true : false;
  }

  /**
   * determines if the element can inherit attirbutes from a parent
   *
   * @param {boolean} the element's inherit property
   */
  _canInherit(inherit) {
    return inherit !== "false" && inherit !== false;
  }

  /**
   * gets the `<option>` text
   *
   * @param {String} the attr that will be set
   * @param {String} the value that will be assigned to the attribute
   */
  _getOption(attr, val) {
    if (val === "parent") {
      return (
        "[[" +
        attr.replace(/-([a-z])/g, function(g) {
          return g[1].toUpperCase();
        }) +
        "]]"
      );
    } else {
      return val;
    }
  }

  /**
   * gets options for the selectors
   *
   * @param {object} the options object to convert
   */
  _getOptions(options) {
    let arr = JSON.parse(options),
      opts = [];
    if (this.inherit !== false) opts.push({ name: "", value: "" });
    if (this.inherit !== false)
      opts.push({
        name: this._getOption(this.label, "parent"),
        value: "parent"
      });
    for (let i = 0; i < arr.length; i++) {
      opts.push({ name: this._getOption(this.label, arr[i]), value: arr[i] });
    }
    return opts;
  }

  /**
   * fired when select changes
   *
   * @event change
   * @param {object} the event that fires
   */
  _handleSelectChange(e) {
    this.value = e.path[0].value !== null ? e.path[0].value : "";
    this.dispatchEvent(
      new CustomEvent(this.label + "-change", { detail: this })
    );
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
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
window.customElements.define(
  SimpleColorsDemoSelect.tag,
  SimpleColorsDemoSelect
);
