/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { SimplePicker } from "@lrnwebcomponents/simple-picker/simple-picker.js";
import { IronMeta } from "@polymer/iron-meta/iron-meta.js";

/**
 * `simple-icon-picker`
 * @element simple-icon-picker
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/index.html
 */
class SimpleIconPicker extends SimplePicker {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * Allow a null option to be selected?
       */
      allowNull: {
        type: Boolean,
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
        type: Array,
      },

      /**
       * The value of the option.
       */
      value: {
        type: String,
        reflect: true,
      },

      /**
       * the maximum number of options per row
       */
      optionsPerRow: {
        type: Number,
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
        type: Array,
      },
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
        clearTimeout(this.__rebuild);
        this.__rebuild = setTimeout(() => {
          setTimeout(() => {
            this._getOptions();
          }, 100);
        }, 0);
      }
      if (propName == "value") {
        /**
         * fires when value changes
         * @event value-changed
         */
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            detail: {
              value: this[propName],
            },
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
    // @todo replace this with the metadata.js method that's in the works
    // for discovering what icons exist and using tooling to access this as
    // opposed to the overly bloated / aggressive method of polymer
    const iconSets = new IronMeta({ type: "iconset" });
    if (
      this.icons.length === 0 &&
      typeof iconSets !== typeof undefined &&
      iconSets.list &&
      iconSets.list.length
    ) {
      var iconList = [];
      iconSets.list.forEach(function (item) {
        item.getIconNames().forEach((icon) => {
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
        value: icons[i],
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
