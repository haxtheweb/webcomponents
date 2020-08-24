/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPickerBehaviors } from "./rich-text-editor-picker.js";
import "@lrnwebcomponents/simple-picker/lib/simple-emoji-picker.js";
/**
 * `rich-text-editor-emoji-picker`
 * an emoji picker for the rich-text-editor
 *
 * @element rich-text-editor-emoji-picker
 * @demo ./demo/buttons.html
 */
class RichTextEditorEmojiPicker extends RichTextEditorPickerBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   *
   */
  static get tag() {
    return "rich-text-editor-emoji-picker";
  }

  static get styles() {
    return [...super.styles];
  }

  // render function for template
  

  // render function for template
  render() {
    return html`
      <simple-emoji-picker
        id="button"
        ?allow-null="${this.allowNull}"
        class="rtebutton ${this.toggled ? "toggled" : ""}"
        ?disabled="${this.disabled}"
        controls="${super.controls}"
        @mouseover="${this._pickerFocus}"
        @keydown="${this._pickerFocus}"
        @value-changed="${this._pickerChange}"
        tabindex="0"
        ?title-as-html="${this.titleAsHtml}"
      >
        <span id="label" class="${super.labelStyle}"
          >${this.currentLabel}</span
        >
      </simple-emoji-picker>
      <simple-tooltip id="tooltip" for="button"
        >${this.currentLabel}</simple-tooltip
      >
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * Emoji types types to include
       */
      emojiTypes: {
        name: "emojiTypes",
        type: Array
      }
    };
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
      "flags"
    ];
    this.icon = "editor:insert-emoticon";
    this.label = "Insert emoji";
    this.titleAsHtml = true;
    this.command = "insertHTML";
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "titleAsHtml" && !this.titleAsHtml)
        this.titleAsHtml = true;
    });
  }
}
window.customElements.define(
  RichTextEditorEmojiPicker.tag,
  RichTextEditorEmojiPicker
);
export { RichTextEditorEmojiPicker };
