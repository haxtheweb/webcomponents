/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css } from "lit";
import { SimplePicker } from "@haxtheweb/simple-picker/simple-picker.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";

/**
 * `simple-icon-picker`
 * Uses simple-picker to create an icon picker
 * @element simple-icon-picker
 * @customElement
 *
 * @demo ./demo/index.html
 */
class SimpleIconPicker extends SimplePicker {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        simple-picker-option {
          --simple-picker-option-size: 32px;
        }
      `,
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

      includeSets: {
        type: Array,
        attribute: "include-sets",
      },
      excludeSets: {
        type: Array,
        attribute: "exclude-sets",
      },
      exclude: {
        type: Array,
        attribute: "exclude",
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
    this.allowNull = true; // default true because of how icon pickers tend to be leveraged
    this.icons = [];
    this.value = null;
    this.options = [];
    this.optionsPerRow = 6;
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
          this._getOptions();
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
          }),
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
  }
  /**
   * gets icons that are registered in SimpleIconsetStore and filters based on include/exclude lists
   *
   * @returns {array}
   * @memberof SimpleIconPicker
   */
  _getStoredIcons() {
    let icons =
        SimpleIconsetStore && SimpleIconsetStore.iconlist
          ? SimpleIconsetStore.iconlist
          : [],
      includeSets =
        this.includeSets && this.includeSets.length > 0
          ? typeof this.includeSets !== typeof []
            ? JSON.parse(this.includeSets)
            : this.includeSets
          : false,
      excludeSets =
        this.excludeSets && this.excludeSets.length > 0
          ? typeof this.excludeSets !== typeof []
            ? JSON.parse(this.excludeSets)
            : this.excludeSets
          : false,
      exclude =
        this.exclude && this.exclude.length > 0
          ? typeof this.exclude !== typeof []
            ? JSON.parse(this.exclude)
            : this.exclude
          : false;
    if (includeSets || excludeSets || exclude)
      icons = icons.filter((icon) => {
        let prefix = icon,
          iconname = icon,
          include = true;
        (prefix = prefix.replace(/:.*/, "")), iconname.replace("icons:", "");
        if (
          exclude &&
          (exclude.includes(icon) || exclude.includes(`icons:${iconname}`))
        )
          include = false;
        if (includeSets && !includeSets.includes(prefix)) include = false;
        if (excludeSets && excludeSets.includes(prefix)) include = false;
        return include;
      });
    return icons;
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
    if (icons.length === 0) icons = this._getStoredIcons();
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
customElements.define(SimpleIconPicker.tag, SimpleIconPicker);
export { SimpleIconPicker };
