/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimplePickerBehaviors } from "@lrnwebcomponents/simple-picker/simple-picker.js";
import { SimpleSymbolList } from "@lrnwebcomponents/simple-symbol-list/simple-symbol-list.js";

/**
 * `simple-symbol-picker`
 * @element simple-symbol-picker
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/index.html
 */
class SimpleSymbolPicker extends SimplePickerBehaviors(LitElement) {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        simple-picker-option {
          justify-content: space-around;
        }
        #icon {
          margin-left: calc(-0.125 * var(--simple-picker-icon-size, 16px));
        }
      `,
    ];
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Symbol types to include
       */
      symbolTypes: {
        name: "symbolTypes",
        type: Array,
        attribute: "symbol-types",
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-symbol-picker";
  }

  constructor() {
    super();
    this.icon = "editor:functions";
    this.label = "Symbol";
    this.symbolTypes = ["symbols", "math", "characters", "greek", "misc"];
    this.titleAsHtml = true;
  }
  /**
   * LitElement life cycle - ready callback
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    let optData = [{ alt: null, icon: this.icon, value: null }];
    this.symbolTypes.forEach((type) =>
      window.SimplePickerSymbols[type].forEach((symbol) => optData.push(symbol))
    );
    optData = this._setPickerOptions(optData);
    this.options = optData;
  }

  /**
   * gets a list of icons and load them in a format
   * that simple-picker can take;
   * if no icons are provided, loads a list from iron-meta
   *
   * @param {array} a list of custom icons for picker
   * @returns {array}
   */
  _setPickerOptions(options = this.options || []) {
    let items = [],
      cols =
        Math.sqrt(options.length) < 11
          ? Math.ceil(Math.sqrt(options.length))
          : 10;
    options.forEach((option, i) => {
      let row = Math.floor(i / cols),
        col = i - row * cols;
      if (!items[row]) items[row] = [];
      items[row][col] = option;
    });
    return items;
  }
  /**
   * Don't set the selection option until there are options rendered
   */
  _setSelectedOption() {
    if (this.options.length > 1) super._setSelectedOption();
  }
}
window.simplePickerSymbolsByCategory = () => {
  let obj = {};
  (SimpleSymbolList || []).forEach((symbol) => {
    let symboltype = symbol.type || "";
    obj[symboltype] = obj[symboltype] || [];
    obj[symboltype].push({
      value: symbol.character,
      alt: symbol.character,
      description: symbol.description,
    });
  });
  return obj;
};
window.SimplePickerSymbols =
  window.SimplePickerSymbols || window.simplePickerSymbolsByCategory();

window.customElements.define(SimpleSymbolPicker.tag, SimpleSymbolPicker);
export { SimpleSymbolPicker };
