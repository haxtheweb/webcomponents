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
 * @see "./simple-colors-select.js"
 * @see "../simple-colors.js"
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
select {
  font-family: monospace;
}
</style>
<select id="accent" on-change="_handleSelectChange" aria-label="[[accentLabel]]">
  <template is="dom-repeat" items="[[options.accent]]" as="option">
    <option value="[[option.value]]">[[option.name]]</option>
  </template>
</select> 
<select id="dark" on-change="_handleSelectChange" aria-label="[[darkLabel]]">
  <template is="dom-repeat" items="[[options.dark]]" as="option">
    <option value="[[option.value]]">[[option.name]]</option>
  </template>
</select>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /** 
       * the value of the accent-color `<select>`
       */
      accentColor: {
        name: "accentColor",
        type: "String",
        value: "grey",
        reflectToAttribute: true,
        observer: false
      },
      /**
       * sets the label for the accent-color <select>
       */
      accentLabel: {
        name: "accentLabel",
        type: "String",
        value: "accent-color",
        reflectToAttribute: true,
        observer: false
      },
      /**
       * Show the option as code? 
       */
      asCode: {
        name: "nested",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
      },
      /**
       * the colors object, eg.:
`{
    "grey": [ "#ffffff", "#eeeeee", ... "#111111","#000000" ],
    "red": [ "#ffdddd", "#ffaeae", ... "#520000", "#3f0000" ],
    ...
  }`
       */
      colors: {
        name: "colors",
        type: "String",
        value: null,
        reflectToAttribute: false,
        observer: false
      },
      /**
       * the value of the dark `<select>`
       */
      dark: {
        name: "dark",
        type: "String",
        value: "false",
        reflectToAttribute: true,
        observer: false
      },
      /**
       * sets the label for the dark <select>
       */
      darkLabel: {
        name: "darkLabel",
        type: "String",
        value: "dark",
        reflectToAttribute: true,
        observer: false
      },
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
       * the colors object, eg.:
`{
    "grey": [ "#ffffff", "#eeeeee", ... "#111111","#000000" ],
    "red": [ "#ffdddd", "#ffaeae", ... "#520000", "#3f0000" ],
    ...
  }`
       */
      options: {
        name: "options",
        type: "Array",
        computed: '_getOptions(colors)',
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
   * determines if a given `<option>` is selected based on the option's value and this element's accent-color
   *
   * @param {String} the option's value
   */
  _accentSelected(option) {
    return this.accentColor === option ? "selected" : "";
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
  _getOption(attr,val) {
    if(val === "parent"){
      if (this.asCode !== false) {
        return attr+'$="[['+attr.replace(/-([a-z])/g, function(g) {
          return g[1].toUpperCase();
        })+']]"' ;
      } else { 
        return 'inherit '+attr; 
      }
    } else {
      if (this.asCode !== false) {
        return attr+'="'+val+'"';
      } else {
        return val;
      }
    }
  }

  /**
   * gets options for the selectors
   *
   * @param {object} the object to convert
   */
  _getOptions(obj) {
    let colors = JSON.parse(obj), options = { "dark": [], "accent": [] };
    options.dark.push({ "name": "", "value": "" });
    if(this.inherit !== false) options.dark.push({ "name": this._getOption("dark","parent"), "value": "parent" });
    options.dark.push({ "name": this._getOption("dark","dark"), "value": "dark" });
    options.accent.push({ "name": "", "value": "" });
    if(this.inherit !== false) options.accent.push({ "name": this._getOption("accent-color","parent"), "value": "parent" });
    for(let key in colors){
      options.accent.push({"name": this._getOption("accent-color",key), "value": key});
    }
    return options;
  }
  
  /**
   * fired when select changes
   *
   * @event change
   * @param {object} the event that fires
   */
  _handleSelectChange(e) {
    let val = e.path[0].value !== null ? e.path[0].value : '';
    if (e.path[0].id === "accent") {
      this.accentColor = val;
      this.dispatchEvent(new CustomEvent("accent-change"));
    } else if (e.path[0].id === "dark") {
      this.dark = val;
      this.dispatchEvent(new CustomEvent("dark-change"));
    }
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
