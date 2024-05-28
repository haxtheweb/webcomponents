/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorPickerBehaviors } from "./rich-text-editor-picker.js";
import "@haxtheweb/simple-picker/lib/simple-emoji-picker.js";
/**
 * `rich-text-editor-emoji-picker`
 * an emoji picker for the rich-text-editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @element rich-text-editor-emoji-picker
 * @demo ./demo/buttons.html
 */
class RichTextEditorEmojiPicker extends RichTextEditorPickerBehaviors(
  LitElement,
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   *
   */
  static get tag() {
    return "rich-text-editor-emoji-picker";
  }

  static get styles() {
    return [super.styles, css``];
  }

  // render function for template

  // render function for template
  render() {
    return html`
      <simple-emoji-picker
        id="button"
        ?allow-null="${this.allowNull}"
        class="rtebutton ${this.labelVisibleClass}-label ${this.toggled
          ? "toggled"
          : ""}"
        .controls="${super.controls}"
        ?disabled="${this.disabled}"
        .emoji-types="${this.emojiTypes}"
        @keydown="${this._pickerFocus}"
        .label="${this.currentLabel}"
        @mouseover="${this._pickerFocus}"
        tabindex="0"
        title-as-html
        ?toggled="${this.toggled}"
        @value-changed="${this._pickerChange}"
      >
      </simple-emoji-picker>
      ${super.tooltipTemplate}
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
        type: Array,
        attribute: "emoji-types",
      },
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
      "flags",
    ];
    this.icon = "editor:insert-emoticon";
    this.label = "Insert emoji";
    this.command = "insertHTML";
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "titleAsHtml" && !this.titleAsHtml)
        this.titleAsHtml = true;
    });
  }
  /**
   * overrides RichTextEditorPickerBehaviors
   * since simple-symbol-picker already handles options
   *
   * @memberof RichTextEditorSymbolPicker
   */
  _setOptions() {}
}
customElements.define(RichTextEditorEmojiPicker.tag, RichTextEditorEmojiPicker);
export { RichTextEditorEmojiPicker };
