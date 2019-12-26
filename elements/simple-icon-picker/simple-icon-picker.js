/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimplePicker } from "@lrnwebcomponents/simple-picker/simple-picker.js";
import { IronMeta } from "@polymer/iron-meta/iron-meta.js";

/**
 * `simple-icon-picker`
 * @customElement simple-icon-picker
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/index.html
 */
class SimpleIconPicker extends SimplePicker {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host(simple-icon-picker) #collapse {
          width: 300px;
        }
        :host(simple-icon-picker) .row {
          justify-content: flex-start;
        }
        :host(simple-icon-picker) simple-picker-option {
          flex: 0 0 auto;
        }
      `
    ];
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Allow a null option to be selected?
       */
      allowNull: {
        name: "allowNull",
        type: Boolean
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
        type: Array
      },

      /**
       * The value of the option.
       */
      value: {
        name: "value",
        type: String,
        reflect: true
      },

      /**
       * the maximum number of options per row
       */
      optionsPerRow: {
        name: "optionsPerRow",
        type: Number
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
        type: Array
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
  constructor() {
    super();
    this.hideOptionLabels = true;
    this.allowNull = false;
    this.icons = [];
    this.value = null;
    this.options = [];
    this.optionsPerRow = 10;
  }
  /**
   * LitElement life cycle - property changed callback
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (
        ["optionsPerRow", "icons", "allowNull", "__iconList"].includes(propName)
      ) {
        this._getOptions(this[propName], oldValue);
      }
      if (propName == "value") {
        /**
         * fires when value changes
         * @event value-changed
         */
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  /**
   * LitElement life cycle - ready callback
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
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
      this._setSelectedOption();
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
  _getOptions() {
    let icons =
        typeof this.icons === "string" ? JSON.parse(this.icons) : this.icons,
      collapse = this.shadowRoot.querySelector("#collapse"),
      cols = this.optionsPerRow;
    if (icons.length === 0 && this.__iconList && this.__iconList.length > 0)
      icons = this.__iconList;
    let options =
        this.allowNull === false ? [] : [[{ alt: "null", value: null }]],
      h = this.allowNull === false ? 0 : 1;
    cols =
      Math.sqrt(icons.length + h) <= this.optionsPerRow
        ? Math.ceil(Math.sqrt(icons.length + h))
        : this.optionsPerRow;
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
    this.options = options;
  }
  /**
   * Don't set the selection option until there are options rendered
   */
  _setSelectedOption() {
    if (this.options.length > 1) super._setSelectedOption();
  }
}
window.customElements.define(SimpleIconPicker.tag, SimpleIconPicker);
export { SimpleIconPicker };
