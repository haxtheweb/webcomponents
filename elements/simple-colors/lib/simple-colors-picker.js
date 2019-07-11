/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import { SimpleColors } from "../simple-colors.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";

/**
 * `simple-colors-inspector-select`
 * `a select element for changing simple-colors attributes in demos`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/picker.html demo
 * @see "../simple-colors.js"
 * @see "./demo/simple-colors-picker-demo.js"
 */
class SimpleColorsPicker extends SimpleColors {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          --simple-picker-selected-option-outline: 2px dashed black;
          --simple-picker-active-option-outline: 2px solid black;
        }
        :host([hidden]) {
          display: none;
        }
      </style>
      <simple-picker
        id="picker"
        aria-labelledby$="[[ariaLabelledby]]"
        block-label$="[[blockLabel]]"
        disabled$="[[disabled]]"
        expanded$="[[expanded]]"
        hide-option-labels$="[[shades]]"
        label$="[[label]]"
        on-change="_handleChange"
        on-collapse="_handleCollapse"
        on-expand="_handleExpand"
        on-option-focus="_handleOptionFocus"
        value$="{{value}}"
      >
      </simple-picker>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Optional. Sets the aria-labelledby attribute
       */
      ariaLabelledby: {
        name: "ariaLabelledby",
        type: String,
        value: null
      },

      /**
       * Display as a block
       */
      blockLabel: {
        name: "blockLabel",
        type: Boolean,
        value: false
      },

      /**
       * Is the picker disabled?
       */
      disabled: {
        name: "disabled",
        type: Boolean,
        value: false
      },

      /**
       * Is it expanded?
       */
      expanded: {
        name: "expanded",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Optional. The label for the picker input
       */
      label: {
        name: "label",
        type: String,
        value: null
      },

      /**
       * An array of options for the picker, eg.: `
[
  {
    "icon": "editor:format-paint",      //Optional. Used if the picker is used as an icon picker.
    "alt": "Blue",                      //Required for accessibility. Alt text description of the choice.
    "style": "background-color: blue;", //Optional. Used to set an option's style.
    ...                                 //Optional. Any other properties that should be captured as part of the selected option's value
  },...
]`
        */
      options: {
        name: "options",
        type: Array,
        computed: "_getOptions(colors,shades,dark)",
        reflectToAttribute: false,
        observer: false
      },

      /**
       * Show all shades instead of just main accent-colors
       */
      shades: {
        name: "shades",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * The value of the option.
       */
      value: {
        name: "label",
        type: "String",
        value: null,
        reflectToAttribute: true,
        notify: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-picker";
  }

  /**
   * gets the simple-colors behaviors
   */
  static get behaviors() {
    return [SimpleColors];
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * ready state
   */
  ready() {
    super.ready();
    this.__ready = true;
  }

  /**
   * gets options for the selectors
   *
   * @param {object} the options object to convert
   */
  _getOptions(colors, shades, dark) {
    let options = [[]],
      theme = dark !== false ? "dark" : "default";
    if (shades === false) {
      options = Object.keys(this.colors).map(key => {
        return [
          {
            alt: key,
            value: key
          }
        ];
      });
      options.unshift([
        {
          alt: "none",
          style: "background-color: var(--simple-picker-background-color,#ddd)",
          value: null
        }
      ]);
    } else {
      let colorNames = Object.keys(colors);
      for (let i = 0; i < colors[colorNames[0]].length; i++) {
        let shade = Object.keys(colors).map(key => {
          let name = key + "-" + (i + 1),
            cssvar = "--simple-colors-" + theme + "-theme-" + name;
          return {
            alt: name,
            style: "background-color: var(" + cssvar + ")",
            value: cssvar
          };
        });
        options.push(shade);
      }
    }
    this.$.picker.options = options;
  }

  /**
   * handles when the picker's value changes
   */
  _handleChange(e) {
    this.value = e.detail.value;
    if (this.__ready !== undefined)
      this.dispatchEvent(
        new CustomEvent("change", { bubbles: true, detail: this })
      );
  }

  /**
   * handles when the picker collapses
   */
  _handleCollapse(e) {
    if (this.__ready !== undefined)
      this.dispatchEvent(new CustomEvent("collapse", { detail: this }));
  }

  /**
   * handles when the picker expands
   */
  _handleExpand(e) {
    if (this.__ready !== undefined)
      this.dispatchEvent(new CustomEvent("expand", { detail: this }));
  }

  /**
   * handles when the picker's focus changes
   */
  _handleOptionFocus(e) {
    if (this.__ready !== undefined)
      this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}

export { SimpleColorsPicker };

window.customElements.define(SimpleColorsPicker.tag, SimpleColorsPicker);
