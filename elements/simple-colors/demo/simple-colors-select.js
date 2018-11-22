/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";

export { SimpleColorsSelect };
/**
 * `simple-colors-select`
 * `a seclect element for changing simple-colors attributes`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleColorsSelect extends PolymerElement {
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
</style>
<select id="accent" on-change="_handleSelectChange" aria-label="[[label]]">
  <option value="">[[option.name]]</option>
  <option hidden$="[[!inherit]]" value="[[_convertAttrToProp(attr)]]">[[_getOption(attr,option.name)]]</option>
  <template is="dom-repeat" items="[[options]]" as="option">
    <option value="[[option.value]]">[[_getOption(attr,option.name)]]</option>
  </template>
</select>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * the name of the attribute `<select>`
       */
      attr: {
        name: "attr",
        type: "String",
        value: null,
        reflectToAttribute: true,
        observer: false
      },
      /**
       * Value of the `<select>`
       */
      value: {
        name: "value",
        type: "String",
        value: null,
        reflectToAttribute: true,
        observer: false
      },
      /**
       * Aria-label for the `<select>`
       */
      label: {
        name: "label",
        type: "String",
        value: null,
        reflectToAttribute: true,
        observer: false
      },
      /**
       * Show the option as code?
       */
      asCode: {
        name: "asCode",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
      },
      /**
       * Include an option to inherit selection from a parent?
       */
      inherit: {
        name: "inherit",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
      },
      /**
       * the options array, eg.: `[ {"name": OPTIONNAME, "value": OPTIONVALUE }, ...]`
       */
      options: {
        name: "options",
        type: "Array",
        value: [],
        reflectToAttribute: false,
        observer: false
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-select";
  }

  /**
   * determines if the element can inherit attirbutes from a parent
   *
   * @param {boolean} the element's inherit property
   */
  _canInherit(inherit) {
    console.log(inherit !== "false", inherit !== false);
    return inherit !== "false" && inherit !== false;
  }

  /**
   * returns the property name for an attribute
   *
   * @param {string} the attribute string to be converted
   */
  _convertAttrToProp(attr) {
    return attr.replace(/-([a-z])/g, function(g) {
      return g[1].toUpperCase();
    });
  }

  /**
   * gets the `<option>` text
   *
   * @param {String} the attr that will be set
   * @param {String} the value that will be assigned to the attribute
   */
  _getOption(attr, val) {
    if (val === "") {
      return this.asCode !== false ? "no " + attr + " set" : "inherit " + attr;
    } else if (val === prop) {
      return this.asCode !== false
        ? attr + '$="[[' + prop + ']]"'
        : "inherit " + attr;
    } else {
      return this.asCode !== false ? attr + '="' + val + '"' : val;
    }
  }

  /**
   * fired when select changes
   *
   * @event change
   * @param {object} the event that fires
   */
  _handleSelectChange(e) {
    this.dispatchEvent(
      new CustomEvent("simple-colors-select-change", { detail: e.path[0] })
    );
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
window.customElements.define(SimpleColorsSelect.tag, SimpleColorsSelect);
