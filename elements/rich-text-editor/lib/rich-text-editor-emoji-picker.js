/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { RichTextEditorPicker } from "./rich-text-editor-picker.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * `rich-text-editor-emoji-picker`
 * `an emoji picker for the rich-text-editor`
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
       * Emoji types types to include
       */
      emojiTypes: {
        name: "emojiTypes",
        type: "Array",
        value: [
          "emotions",
          "people",
          "nature",
          "food",
          "travel",
          "activities",
          "objects",
          "symbols",
          "flags"
        ]
      },
      /**
       * Optional icon for null value
       */
      icon: {
        name: "icon",
        type: "String",
        value: "editor:insert-emoticon",
        readOnly: true
      },

      /**
       * Label for the icon.
       */
      label: {
        name: "label",
        type: "String",
        value: "Insert emoji"
      },

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
      },

      /**
       * The value
       */
      value: {
        name: "value",
        type: "String",
        value: "null"
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
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
    const src = this.optionsSrc;
    const location = `${basePath}${src}`;
    window.addEventListener(
      "es-bridge-emoji-loaded",
      this._setOptions.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("emoji", location);
  }
  disconnectedCallback() {
    window.removeEventListener(
      `es-bridge-emoji-loaded`,
      this._setOptions.bind(this)
    );
  }

  /**
   * Handles default options loaded from an external js file
   */
  _setOptions() {
    let optData = [];
    this.emojiTypes.forEach(function(type) {
      optData = optData.concat(Object.keys(emojis[type]));
    });
    this.set(
      "options",
      this._getPickerOptions(optData, this.allowNull, this.icon)
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
