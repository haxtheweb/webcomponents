/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimplePicker } from "@lrnwebcomponents/simple-picker/simple-picker.js";
import { IronMeta } from "@polymer/iron-meta/iron-meta.js";

/**
 * `simple-icon-picker`
 * `Uses simple-picker to create an icon picker`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleIconPicker extends SimplePicker {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          --simple-picker-option-size: 24px;
          --simple-picker-collapse: {
            width: 360px;
            height: 300px;
            max-height: 300px;
            overflow: scroll;
          }
          --simple-picker-row: {
            justify-content: flex-start;
          }
          --simple-picker-option: {
            flex: 0 0 auto;
          }
        }

        :host([hidden]) {
          display: none;
        }
      </style>
      <simple-picker
        aria-labelledby$="[[ariaLabelledby]]"
        disabled$="[[disabled]]"
        expanded$="[[expanded]]"
        hide-option-labels
        label$="[[label]]"
        on-change="_handleChange"
        on-collapse="_handleCollapse"
        on-expand="_handleExpand"
        on-option-focus="_handleOptionFocus"
        options="[[options]]"
        value$="{{value}}"
      >
      </simple-picker>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Allow a null option to be selected?
       */
      allowNull: {
        name: "allowNull",
        type: "Boolean",
        value: false
      },

      /**
       * Icon picker should not have visible icon labels.
       */
      hideOptionLabels: {
        name: "hideOptionLabels",
        type: "Boolean",
        value: true,
        "read-only": true
      },

      /**
    * An array of icons by name: ```
[
  "editor:format-paint",
  "content-copy",
  "av:volume-off"
  
]```
  */
      icons: {
        name: "icons",
        type: "Array",
        value: []
      },

      /**
    * An array of options for the picker, eg.: ```
[
  {
    "icon": "editor:format-paint",      //Optional. Used if the picker is used as an icon picker.
    "alt": "Blue",                      //Required for accessibility. Alt text description of the choice.
    "style": "background-color: blue;", //Optional. Used to set an option's style.
    ...                                 //Optional. Any other properties that should be captured as part of the selected option's value
  },...
]```
    */
      options: {
        name: "options",
        type: "Array",
        computed: "_getOptions(icons,__iconList,allowNull)"
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
      },

      /**
    * An array of icons by name: ```
[
  "editor:format-paint",
  "content-copy",
  "av:volume-off"
  
]```
  */
      __iconList: {
        name: "__iconList",
        type: "Array",
        "read-only": true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-icon-picker";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    const iconSets = new IronMeta({ type: "iconset" });
    if (
      this.icons.length === 0 &&
      typeof iconSets !== typeof undefined &&
      iconSets.list &&
      iconSets.list.length
    ) {
      var iconList = [];
      iconSets.list.forEach(function(item) {
        item.getIconNames().forEach(icon => {
          iconList.push(icon);
        });
      });
      this.__iconList = iconList;
    }
  }

  /**
   * gets a list of icons and load them in a format
   * that the simple-picker can take;
   * if no icons are provided, loads a list from iron-meta
   *
   * @param {array} a list of custom icons for the picker
   * @param {array} default list of icons for the picker
   * @param {boolean} allow a null value for the picker
   *
   */
  _getOptions(icons = [], __iconList = [], allowNull = false) {
    if (icons.length === 0) icons = __iconList;
    let options = allowNull === false ? [] : [[{ alt: "null", value: null }]],
      h = allowNull === false ? 0 : 1,
      cols =
        Math.sqrt(icons.length + h) < 16
          ? Math.ceil(Math.sqrt(icons.length + h))
          : 15;
    for (let i = 0; i < icons.length; i++) {
      let j = h + i,
        row = Math.floor(j / cols),
        col = j - row * cols;
      if (options[row] === undefined || options[row] === null)
        options[row] = [];
      options[row][col] = {
        alt: icons[i],
        icon: icons[i],
        value: icons[i]
      };
    }
    return options;
  }

  /**
   * handles when the picker's value changes
   */
  _handleChange(e) {
    this.value = e.detail.value;
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, detail: this })
    );
  }

  /**
   * handles when the picker collapses
   */
  _handleCollapse(e) {
    this.dispatchEvent(new CustomEvent("collapse", { detail: this }));
  }

  /**
   * handles when the picker expands
   */
  _handleExpand(e) {
    this.dispatchEvent(new CustomEvent("expand", { detail: this }));
  }

  /**
   * handles when the picker's focus changes
   */
  _handleOptionFocus(e) {
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleIconPicker.tag, SimpleIconPicker);
export { SimpleIconPicker };
