import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsContainer } from "./simple-fields-container.js";
/**
 *`simple-fields-markup`
 * HTML inputs (excluding submit, reset, button, and image)
 * with label, description, error massage,
 * and aria-invalid functionality if needed.
 *
 * @group simple-fields
 * @extends simple-fields-container
 * @customElement simple-fields-markup
 * @demo ./demo/field.html
 */
class SimpleFieldsMarkup extends SimpleFieldsContainer {
  static get tag() {
    return "simple-fields-markup";
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
      `
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
        type: Boolean
      },
      /**
       * Font-size of editor
       */
      fontSize: {
        type: Number,
        attribute: "font-size"
      },
      /**
       * mode of code-editor
       */
      mode: {
        type: Number
      },
      /**
       * Value is not editable
       */
      readonly: {
        type: Boolean,
        reflect: true
      },
      /**
       * error message when field is required and has no value
       */
      requiredMessage: {
        type: String
      },
      /**
       * theme of code-editor
       */
      theme: {
        type: Number
      }
    };
  }
  constructor() {
    super();
    this.autofocus = false;
    this.fontSize = 14;
    this.id = this._generateUUID();
    this.mode = "html";
    this.readonly = false;
    this.theme = "vs";
  }
  disconnectedCallback() {
    this.removeEventListener("click", e => this.focus());
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id" && !this.id) this.id = this._generateUUID();
      if (propName === "value" && this.value !== oldValue) {
        if(this.field) console.log(this.value,this.field.value,this.field.editorValue);
        //this.field.editorValue = this.value;
        this._fireValueChanged();
      }
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
        ${this.labelTemplate}
        <code-editor 
          ?autofocus="${this.autofocus}"  
          font-size="${this.fontSize}" 
          theme="${this.theme}" 
          mode="${this.mode}"
          @value-changed="${this._onChange}">
        </code-editor>
        <input name ="${this.id}" type="hidden" value="${this.value}">
      </div>
    `;
  }

  /**
   * makes handles code-editor changes
   *
   * @memberof SimpleFieldsMarkup
   */
  _onChange(e) {
    console.log(e);
    if (!e.path[0]) return;
    console.log(e.path[0]);
    this.value = e.path[0].value;
    this.autoGrow(e.path[0]);
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
   * @memberof SimpleFieldsMarkup
   */
  validate() {
    if (!this.value && this.required) {
      this.error = true;
      this.errorMessage = this.requiredMessage || `required`;
    }
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
        detail: this
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
   * @memberof SimpleFieldsMarkup
   */
  _updateField() {
    this.field =
      this.shadowRoot && this.shadowRoot.querySelector('code-editor')
        ? this.shadowRoot.querySelector('code-editor')
        : undefined;
    this.value = this.field.value;
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
window.customElements.define(SimpleFieldsMarkup.tag, SimpleFieldsMarkup);
export { SimpleFieldsMarkup };
