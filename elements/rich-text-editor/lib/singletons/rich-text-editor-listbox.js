/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleListBoxBehaviors } from "@lrnwebcomponents/simple-listbox/simple-listbox.js";


/**
 * `rich-text-editor-listbox`
 * a picker for rich text editor (custom buttons can RichTextEditorPickerBehaviors)
 *
 * @extends SimpleListBoxBehaviors
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-listbox
 * @demo ./demo/markdown.html
 */
class RichTextEditorListbox extends SimpleListBoxBehaviors(LitElement) {
  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-listbox";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        input {
          display: none
        }
      `,
    ];
  }
  get inputTemplate() {
    return html`
      <input
        aria-activedescendant="${this.activeDescendant}"
        aria-autocomplete="${this.autocomplete}"
        aria-descrbedby="${this.describedBy}"
        aria-expanded="${this.expanded ? "true" : "false"}"
        aria-haspopup="true"
        aria-invalid="${this.error ? "true" : "false"}"
        aria-owns="${this.listboxId}"
        ?autofocus="${this.autofocus}"
        @blur="${this._onInputBlur}"
        @change="${this._handleFieldChange}"
        class="input ${this.inputFocus ? "focus" : ""}"
        @click="${this._onInputClick}"
        ?disabled="${this.disabled}"
        @focus="${this._onInputFocus}"
        id="${this.fieldId}"
        @keydown="${this._onInputKeydown}"
        @keyup="${this._onInputKeyup}"
        name="${this.fieldId}"
        .placeholder="${this.placeholder || ""}"
        part="option-input"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        tabindex="0"
        type="text"
      />
    `;
  }
  firstUpdated(changedProperties){
    if(super.firstUpdated) super.firstUpdated(changedProperties);
    this.alwaysExpanded = true;
    this.autofocus = false;
  }
}
window.customElements.define(RichTextEditorListbox.tag, RichTextEditorListbox);
