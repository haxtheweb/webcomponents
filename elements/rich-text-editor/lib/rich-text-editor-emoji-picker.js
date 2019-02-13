/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorPicker } from "./rich-text-editor-picker.js";
import "@polymer/iron-icons/editor-icons.js";
/**
 * `rich-text-editor-emoji-picker`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorEmojiPicker extends RichTextEditorPicker {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * An optional JSON file with default options.
       */
      optionsSrc: {
        name: "optionsSrc",
        type: "String",
        value: "data/emojis.js"
      },

      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */
      titleAsHtml: {
        name: "titleAsHtml",
        type: "Boolean",
        value: true,
        readOnly: true
      }
    };
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   *
   */
  static get tag() {
    return "rich-text-editor-emoji-picker";
  }

  /**
   * Handles default options loaded from an external js file
   */
  _setOptions() {
    this.set(
      "options",
      this._getPickerOptions(Object.keys(emojis), this.allowNull)
    );
  }

  /**
   * Converts option data to picker option data;
   * can be overridden in extended elements
   *
   * @param {object} data about the option
   * @returns {object} picker dato for the option
   */
  _getOptionData(option) {
    return {
      value: option,
      alt: option,
      icon: null,
      style: null
    };
  }
}
window.customElements.define(
  RichTextEditorEmojiPicker.tag,
  RichTextEditorEmojiPicker
);
export { RichTextEditorEmojiPicker };
