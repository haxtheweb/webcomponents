/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimplePickerBehaviors } from "@lrnwebcomponents/simple-picker/simple-picker.js";
import { SimpleEmojiList } from "@lrnwebcomponents/simple-emoji-list/simple-emoji-list.js";

/**
 * `simple-emoji-picker`
 * @element simple-emoji-picker
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/index.html
 */
class SimpleEmojiPicker extends SimplePickerBehaviors(LitElement) {
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
       * emoji types to include
       */
      emojiTypes: {
        name: "emojiTypes",
        type: Array,
        attribute: "emoji-types",
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-emoji-picker";
  }

  constructor() {
    super();
    this.emojiTypes = [
      "emotions",
      "people",
      "nature",
      "food",
      "travel",
      "activities",
      "objects",
      "symbols",
      "flags",
    ];
    this.icon = "editor:insert-emoticon";
    this.label = "Emoji";
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
    this.emojiTypes.forEach((type) =>
      window.SimplePickerEmojis[type].forEach((emoji) => optData.push(emoji))
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
window.simplePickerEmojisByCategory = () => {
  let obj = {};
  (SimpleEmojiList || []).forEach((emoji) => {
    let emojitype = emoji.type || "";
    obj[emojitype] = obj[emojitype] || [];
    obj[emojitype].push({
      value: emoji.character,
      alt: emoji.character,
      description: emoji.description,
    });
  });
  return obj;
};
window.SimplePickerEmojis =
  window.SimplePickerEmojis || window.simplePickerEmojisByCategory();

window.customElements.define(SimpleEmojiPicker.tag, SimpleEmojiPicker);
export { SimpleEmojiPicker };
