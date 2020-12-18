import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsContainer } from "./simple-fields-container.js";
import "@lrnwebcomponents/code-editor/code-editor.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";

/**
 *`simple-fields-code`
 * HTML inputs (excluding submit, reset, button, and image)
 * with label, description, error massage,
 * and aria-invalid functionality if needed.
 *
 * @group simple-fields
 * @extends simple-fields-container
 * @element simple-fields-code
 * @demo ./demo/field.html
 */
class SimpleFieldsCode extends SimpleFieldsContainer {
  static get tag() {
    return "simple-fields-code";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        #options {
          display: var(--simple-fields-radio-option-display, flex);
          flex-wrap: var(--simple-fields-radio-option-flex-wrap, wrap);
        }
        code-editor {
          margin: 0;
          transition: height 0.5s ease-in-out;
          box-sizing: border-box;
          vertical-align: bottom;
        }
        code-editor:focus {
          outline: none;
        }
      `,
    ];
  }
  render() {
    return !this.hasFieldSet ? super.render() : this.fieldsetTemplate;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Automatically focus on field when the page is loaded
       */
      autofocus: {
        type: Boolean,
      },
      /**
       * changes the value of the editor
       */
      editorValue: {
        type: String,
        attribute: "editor-value",
      },
      /**
       * Font-size of editor
       */
      fontSize: {
        type: Number,
        attribute: "font-size",
      },
      /**
       * language of code-editor
       */
      language: {
        type: String,
      },
      /**
       * mode of code-editor
       */
      mode: {
        type: Number,
      },
      /**
       * Value is not editable
       */
      readonly: {
        type: Boolean,
        reflect: true,
      },
      /**
       * error message when field is required and has no value
       */
      requiredMessage: {
        type: String,
      },
      /**
       * theme of code-editor
       */
      theme: {
        type: Number,
      },
      /**
       * Current value of the form control. Submitted with the form as part of a name/value pair.
       */
      value: {
        reflect: true,
      },
    };
  }
  constructor() {
    super();
    this.autofocus = false;
    this.fontSize = 14;
    this.id = this._generateUUID();
    this.language = "html";
    this.mode = "html";
    this.readonly = false;
    this.theme = "vs";
  }
  disconnectedCallback() {
    this.removeEventListener("click", (e) => this.focus());
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id" && !this.id) this.id = this._generateUUID();
      if (propName === "field" && !this.field) this._updateField();
      if (propName === "value") this._fireValueChanged();
    });
  }

  /**
   * template label and field
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get fieldMainTemplate() {
    return html`
      <div class="field-main">
        <code-editor
          ?autofocus="${this.autofocus}"
          ?disabled="${this.disabled}"
          font-size="${this.fontSize}"
          editor-value="${this.__editorValue || ""}"
          theme="${this.theme}"
          language="${this.language}"
          mode="${this.mode}"
          ?read-only="${this.readonly || this.disabled}"
          @value-changed="${this._onChange}"
        >
        </code-editor>
        <input name="${this.id}" type="hidden" value="${this.value}" />
      </div>
    `;
  }

  /**
   * makes handles code-editor changes
   *
   * @memberof SimpleFieldsCode
   */
  _onChange(e) {
    var target = normalizeEventPath(e)[0];
    if (!target) return;
    if (this.value !== target.value) this.value = target.value;
    //this.autoGrow(target);
  }

  /**
   * overridden mutation observer
   *
   * @readonly
   * @memberof SimpleFieldsContainer
   */
  get slottedFieldObserver() {}

  /**
   * checks validation constraints and returns error data
   * @memberof SimpleFieldsCode
   */
  validate() {
    if (!this.value && this.required) {
      this.error = true;
      this.errorMessage = this.requiredMessage || `required`;
    }
    // to match container response
    return !this.error;
  }

  /**
   * fires when value changes
   * @event value-changed
   */
  _fireValueChanged() {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }
  /**
   * listens for focusout
   * overridden for fields in shadow DOM
   *
   * @param {boolean} [init=true] whether to start observing or disconnect observer
   * @memberof SimpleFieldsContainer
   */
  _observeAndListen(init = true) {
    if (init) {
      this.addEventListener("click", this.focus);
      this.addEventListener("focusout", this._onFocusout);
      this.addEventListener("focusin", this._onFocusin);
    } else {
      this.removeEventListener("click", this.focus);
      this.removeEventListener("focusout", this._onFocusout);
      this.removeEventListener("focusin", this._onFocusin);
    }
  }

  /**
   * updates field an type
   *
   * @memberof SimpleFieldsCode
   */
  _updateField() {
    this.field =
      this.shadowRoot && this.shadowRoot.querySelector("code-editor")
        ? this.shadowRoot.querySelector("code-editor")
        : undefined;
  }
  /**
   * generates a unique id
   * @returns {string } unique id
   */
  _generateUUID() {
    return "ss-s-s-s-sss".replace(
      /s/g,
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    );
  }
}
window.customElements.define(SimpleFieldsCode.tag, SimpleFieldsCode);
export { SimpleFieldsCode };
