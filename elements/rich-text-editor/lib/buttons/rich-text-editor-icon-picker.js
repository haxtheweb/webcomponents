/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorPickerBehaviors } from "./rich-text-editor-picker.js";
import { SimpleIconPicker } from "@haxtheweb/simple-icon-picker/simple-icon-picker.js";
/**
 * `rich-text-editor-icon-picker`
 * an icon picker for the rich-text-editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @element rich-text-editor-icon-picker
 * @demo ./demo/buttons.html
 */
class RichTextEditorIconPicker extends RichTextEditorPickerBehaviors(
  LitElement,
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   *
   */
  static get tag() {
    return "rich-text-editor-icon-picker";
  }

  static get styles() {
    return [
      super.styles,
      css`
        #button.show-label::part(label) {
          padding: 0;
          margin-right: 0;
          margin-left: 4px;
        }
        #button.show-label::part(sample) {
          min-height: var(--simple-picker-option-size, 24px);
          margin-left: calc(-0.125 * var(--simple-picker-icon-size, 16px));
        }
        #button.show-label::part(sample-option) {
          display: none;
        }
      `,
    ];
  }

  // render function for template

  // render function for template
  render() {
    return html`
      <simple-icon-picker
        id="button"
        ?allow-null="${this.allowNull}"
        class="rtebutton ${this.labelVisibleClass}-label ${this.toggled
          ? "toggled"
          : ""}"
        .controls="${super.controls}"
        ?disabled="${this.disabled}"
        .icons="${this.icons}"
        .excludes="${this.excludes}"
        .includeSets="${this.includeSets}"
        .excludeSets="${this.excludeSets}"
        @keydown="${this._pickerFocus}"
        .label="${this.currentLabel}"
        @mouseover="${this._pickerFocus}"
        tabindex="0"
        ?toggled="${this.toggled}"
        @value-changed="${this._pickerChange}"
      >
      </simple-icon-picker>
      ${super.tooltipTemplate}
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      ...SimpleIconPicker.properties,
    };
  }

  constructor() {
    super();
    this.icon = undefined;
    this.icons = [];
    this.excludes = [];
    this.includeSets = [];
    this.excludeSets = [];
    this.label = "Insert icon";
    this.command = "insertHTML";
    this.tagsList = "simple-icon-lite";
  }

  /**
   * Picker change
   */
  _pickerChange(e) {
    let val = this._getSelectionType() || "",
      parent = this.__highlight.parentNode;
    this.commandVal = e.detail.value
      ? `<simple-icon-lite icon="${e.detail.value}"></simple-icon-lite>`
      : "";

    /* only update when there is an actual change */
    if (this.range && val !== this.commandVal) {
      this.sendCommand();
    }
  }
  /**
   * overrides RichTextEditorPickerBehaviors
   * since simple-symbol-picker already handles options
   *
   * @memberof RichTextEditorSymbolPicker
   */
  _setOptions() {}
}
customElements.define(RichTextEditorIconPicker.tag, RichTextEditorIconPicker);
export { RichTextEditorIconPicker };
