import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsContainer } from "./simple-fields-container.js";
/**
 *`simple-fields-field`
 * HTML inputs (excluding submit, reset, button, and image) 
 * with label, description, error massage, 
 * and aria-invalid functionality if needed.
 *
 * @group simple-fields
 * @extends simple-fields-container
 * @customElement simple-fields-field
 * @demo ./demo/field.html
 */
class SimpleFieldsField extends SimpleFieldsContainer {
  static get tag() {
    return "simple-fields-field";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        fieldset {
          margin: 0;
          padding: 0;
          border: none;
        }
        option {
          border-radius: 0;
        }
        legend {
          padding-inline-start: unset;
          padding-inline-end: unset;
        }
        #options {
          display: var(--simple-fields-radio-option-display, flex);
          flex-wrap: var(--simple-fields-radio-option-flex-wrap, wrap);
        }
        .option {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          justify-content: space-between;
          margin: 0 var(--simple-fields-margin-small, 8px);
        }
        .option:first-of-type {
          margin: 0 var(--simple-fields-margin-small, 8px) 0 0;
        }
        .option:last-of-type {
          margin: 0 0 0 var(--simple-fields-margin-small, 8px);
        }
        .option:focus-within label {
          color: var(--simple-fields-accent, #003f7d);
          transition: color ease-in-out;
        }
        :host([type]) fieldset .border-bottom {
          display: block;
        }
        .box-input:focus {
          outline: none;
        }
        textarea {
          margin: 0;
          transition: height 0.5s ease-in-out;
          box-sizing: border-box;
          vertical-align: bottom;
        }
        select.field {
          width: 100%;
          border: none;
          background: transparent;
          border-radius: 0;
          transition: color ease-in-out;
        }
        select:focus,
        select:focus-within {
          outline: none;
        }
        input[type="range"] {
          width: 100%;
          height: calc(
            var(--simple-fields-font-size, 16px) +
              var(--simple-fields-line-height, 22px)
          );
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 16px;
          cursor: pointer;
          background: var(--simple-fields-border-color-light, #ccc);
          border-radius: 8px;
          transition: all 0.5ms ease-in-out;
        }
        :host([invalid]) input[type="range"]::-webkit-slider-runnable-track {
          background: var(--simple-fields-faded-error-color, #ff997f);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]::-webkit-slider-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--simple-fields-background-color, white);
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -2px;
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"][readonly]::-webkit-slider-thumb,
        input[type="range"][disabled]::-webkit-slider-thumb {
          cursor: not-allowed;
        }
        input[type="range"]:focus::-webkit-slider-thumb {
          background: var(--simple-fields-accent-color, #3f51b5);
          transition: all 0.5ms ease-in-out;
        }
        :host([invalid]) input[type="range"]::-webkit-slider-thumb {
          background: var(--simple-fields-error-color, #dd2c00);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"][readonly]::-webkit-slider-thumb,
        input[type="range"][disabled]::-webkit-slider-thumb {
          background: var(--simple-fields-border-color, #999);
          cursor: not-allowed;
          box-shadow: none;
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]::-moz-range-track {
          width: 100%;
          height: 16px;
          cursor: pointer;
          background: var(--simple-fields-border-color-light, #ccc);
          border-radius: 8px;
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"][readonly]::-moz-range-track,
        input[type="range"][disabled]::-moz-range-track {
          cursor: not-allowed;
        }
        :host([invalid]) input[type="range"]::-moz-range-track {
          background: var(--simple-fields-faded-error-color, #ff997f);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--simple-fields-background-color, white);
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
          cursor: pointer;
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]:focus::-moz-range-thumb {
          background: var(--simple-fields-accent-color, #3f51b5);
          transition: all 0.5ms ease-in-out;
        }
        :host([invalid]) input[type="range"]::-moz-range-thumb {
          background: var(--simple-fields-error-color, #dd2c00);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"][readonly]::-moz-range-thumb,
        input[type="range"][disabled]::-moz-range-thumb {
          background: var(--simple-fields-border-color, #999);
          cursor: not-allowed;
          box-shadow: none;
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]::-ms-track {
          width: 100%;
          height: 16px;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          color: transparent;
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"][readonly]::-ms-track,
        input[type="range"][disabled]::-ms-track {
          cursor: not-allowed;
        }
        :host([invalid]) input[type="range"]::-ms-track {
          background: var(--simple-fields-faded-error-color, #ff997f);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]::-ms-fill-lower {
          background: var(--simple-fields-border-color-light, #ccc);
          border-radius: 8px;
        }
        input[type="range"]::-ms-fill-upper {
          background: var(--simple-fields-border-color-light, #ccc);
          border-radius: 8px;
        }
        input[type="range"]::-ms-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--simple-fields-background-color, white);
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
          cursor: pointer;
        }
        input[type="range"][readonly]::-ms-thumb,
        input[type="range"][disabled]::-ms-thumb {
          cursor: not-allowed;
        }
        input[type="range"]:focus::-ms-thumb {
          background: var(--simple-fields-accent-color, #3f51b5);
        }
        :host([invalid]) input[type="range"]::-ms-thumb {
          background: var(--simple-fields-error-color, #dd2c00);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"][redonly]::-ms-thumb,
        input[type="range"][disabled]::-ms-thumb {
          background: var(--simple-fields-border-color, #999);
          cursor: not-allowed;
          box-shadow: none;
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]:focus::-ms-fill-lower {
          background: var(--simple-fields-border-color-light, #ccc);
        }
        input[type="range"]:focus::-ms-fill-upper {
          background: var(--simple-fields-border-color-light, #ccc);
        }
      `
    ];
  }
  render() {
    return !this.hasFieldSet 
    ? super.render()
    : this.fieldsetTemplate;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Hint for expected file type in file upload controls
       */
      accept: {
        type: String
      },
      /**
       * Media capture input method in file upload controls
       */
      capture: {
        type: String
      },
      /**
       * Whether the command or control is checked
       */
      checked: {
        type: Boolean
      },
      /**
       * Name of form field to use for sending the element's directionality in form submission
       */
      dirname: {
        type: String
      },
      /**
       * Value of the id attribute of the `<datalist>` of autocomplete options
       */
      list: {
        type: String
      },
      /**
       * Maximum value for numeric field types
       */
      max: {
        type: Number
      },
      /**
       * Maximum length (number of characters) of `value`
       */
      maxlength: {
        type: Number
      },
      /**
       * Minimum value for numeric field types
       */
      min: {
        type: Number
      },
      /**
       * Minimum length (number of characters) of `value`
       */
      minlength: {
        type: Number
      },
      /**
       * Whether to allow multiple values
       */
      multiple: {
        type: Boolean
      },
      /**
       * options {value: "Text"} for select as object,
       * eg. {a: "Option A", b: "Option B", c: "Option C"}
       */
      options: {
        type: Object
      },
      /**
       * Pattern the value must match to be valid
       */
      pattern: {
        type: String
      },
      /**
       * Content to be appear in the form control when the form control is empty
       */
      placeholder: {
        type: String
      },
      /**
       * Value is not editable
       */
      readonly: {
        type: Boolean
      },
      /**
       * Size of the control
       */
      size: {
        type: Number
      },
      /*
       * Whether input subject to spell checking by browser/OS as "true", "default", or "false"
       */
      spellcheck: {
        type: String
      },
      /**
       * Incremental values that are valid
       */
      step: {
        type: Number
      },
      /**
       * Type of input form control
       */
      type: {
        type: String
      },
      /*
       * text wrapping for textarea,
       * "hard": automatically inserts line breaks (CR+LF)
       * "soft": all line breaks as CR+LF pair
       * "off" : no wrapping / <textarea> becomes horizontally scrollable
       */
      wrap: {
        type: Boolean
      }
    };
  }
  constructor() {
    super();
    this.checked = false;
    this.multiple = false;
    this.readonly = false;
    this.spellcheck = false;
    this.wrap = false;
    this.options = {};
  }

  updated(changedProperties) {
    let attributes = [
      "accept",
      "autocomplete",
      "capture",
      "checked",
      "dirname",
      "list",
      "max",
      "maxlength",
      "min",
      "minlength",
      "muliple",
      "pattern",
      "size",
      "step"
    ];
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "type" && this.type !== oldValue) this._updateField();
      if (["type", "field", "value"].includes(propName))
        this._onTextareaupdate();
      if (attributes.includes(propName)) this.updateAttribute(propName);
      if (propName === "value" && this.value !== oldValue)
        this._fireValueChanged();
    });
  }

  get hasFieldSet() {
    return (
      Object.keys(this.options || {}).length > 0 &&
      (this.type === "radio" || this.type === "checkbox")
    );
  }

  /**
   * gets field element tag in shadow DOM
   *
   * @readonly
   * @returns {string}
   * @memberof SimpleFieldsContainer
   */
  get fieldElementTag(){
    return this.type === "select" 
      ? "select" 
      : this.type === "textarea"
        ? "textarea"
        : this.hasFieldSet 
          ? "fieldset" 
          : "input";
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
        <div class="${
          this.inline 
          || ["checkbox","color","radio"].includes(this.type || "text") 
          ? 'field-main inline' 
          :'field-main'}">
          ${this.labelTemplate}
          <div>
            ${this.prefixTemplate}
            ${this.fieldElementTag === "input" 
              ? this.inputTemplate
              : this.fieldElementTag === "select" 
                ? this.selectTemplate
                : this.fieldElementTag === "textarea"
                  ? this.textareaTemplate
                  : ``
            }
            ${this.suffixTemplate}
          </div>
        </div>`;
  }

  /**
   * template for `fieldset` in shadow DOM
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsField
   */
  get fieldsetTemplate() {
    return html`
      <fieldset>
        <legend id="${this.fieldId}" class="label-main" ?hidden="${!this.label}">
          ${this.label}
        </legend>
        <div id="options">
          ${Object.keys(this.options || {}).map(
            option => html`
              <div class="option inline">
                <label for="${this.id}.${option}" class="radio-label"
                  >${this.options[option]}</label
                >
                <input
                  .id="${this.id}.${option}"
                  ?autofocus="${this.autofocus}"
                  autocomplete="${this.autocomplete}"
                  aria-descrbedby="${this.describedBy}"
                  .aria-invalid="${this.invalid ? "true" : "false"}"
                  .checked="${this.value === option}"
                  class="field"
                  @click="${this._onChange}"
                  ?disabled="${this.disabled}"
                  ?hidden="${this.hidden}"
                  ?required="${this.required}"
                  type="${this.type}"
                  .value="${option}"
                />
              </div>
            `
          )}
        </div>
        ${this.fieldBottom}
      </fieldset>
    `;
  }

  /**
   * template for `input` in shadow DOM
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsField
   */
  get inputTemplate() {
    return html`
      <input
        .id="${this.fieldId}"
        aria-descrbedby="${this.describedBy}"
        aria-invalid="${this.invalid}"
        ?autofocus="${this.autofocus}"
        @change="${this._onChange}"
        class="field ${["checkbox", "color", "file", "radio", "range"].includes(
          this.type
        )
          ? ""
          : "box-input"}"
        dirname="${this.dirname}"
        ?disabled="${this.disabled}"
        ?hidden="${this.hidden}"
        .name="${this.fieldId}"
        .placeholder="${this.placeholder || ""}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        .type="${this.type}"
      />
    `;
  }
  /**
   * template for `select` in shadow DOM
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsField
   */
  get selectTemplate() {
    return html`
    <select
        id="${this.fieldId}"
        ?autofocus="${this.autofocus}"
        .autocomplete="${this.autocomplete}"
        aria-descrbedby="${this.describedBy}"
        .aria-invalid="${this.invalid ? "true" : "false"}"
        @change="${this._onChange}"
        class="field"
        ?disabled="${this.disabled}"
        ?hidden="${this.hidden}"
        ?required="${this.required}"
        ?multiple="${this.multiple}"
        size="${this.size || ""}"
      >
        ${Object.keys(this.options || {}).map(
          option => html`
            <option
              .id="${this.id}.${option}"
              ?selected="${this.multiple
                ? this.value && this.value.includes(option)
                : this.value === option}"
              .value="${option}"
            >
              ${this.options[option]}
            </option>
          `
        )}
      </select>
    `;
  }
  
  /**
   * overridden mutation observer 
   *
   * @readonly
   * @memberof SimpleFieldsContainer
   */
  get slottedFieldObserver(){
  }
  /**
   * template for `textarea` in shadow DOM
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsField
   */
  get textareaTemplate() {
    return html`
      <textarea
        .id="${this.fieldId}"
        aria-invalid="${this.invalid}"
        ?autofocus="${this.autofocus}"
        class="field box-input"
        @change="${this._onChange}"
        @input="${this._onTextareaupdate}"
        ?disabled="${this.disabled}"
        ?hidden="${this.hidden}"
        .name="${this.fieldId}"
        .placeholder="${this.placeholder || ""}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        rows="1"
        size="${this.size}"
      >${this.value || ""}</textarea>
    `;
  }

  /**
   * updates field attributes based on field type
   *
   * @param {string} attribute
   * @memberof SimpleFieldsField
   */
  updateAttribute(attribute) {
    let types = {
      accept: ["file"],
      capture: ["file"],
      checked: ["radio", "checkbox"],
      dirname: ["text", "search"],
      max: [
        "date",
        "month",
        "week",
        "time",
        "datetime-local",
        "number",
        "range"
      ],
      maxlength: ["password", "search", "tel", "text", "textrea", "url"],
      min: [
        "date",
        "month",
        "week",
        "time",
        "datetime-local",
        "number",
        "range"
      ],
      minlength: ["password", "search", "tel", "text", "textarea", "url"],
      multiple: ["email", "file", "select"],
      pattern: ["password", "text", "tel"],
      size: ["password", "text", "tel", "text", "textarea"],
      step: [
        "date",
        "month",
        "week",
        "time",
        "datetime-local",
        "number",
        "range"
      ],
      spellcheck: ["textarea"]
    };
    if (
      this.field &&
      this.type &&
      this[attribute] !== this.field.getAttribute(attribute)
    ) {
      if (
        this[attribute] &&
        (!types[attribute] || types[attribute].includes(this.type))
      ) {
        this.field.setAttribute(attribute, this[attribute]);
      } else {
        this.field.removeAttribute(attribute, this[attribute]);
      }
    }
  }
  /**
   * fires when value changes
   * @event value-changed
   */
  _fireValueChanged() {
    console.log(
      "value-changed",
      this.value,
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
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
  _observeAndListen(init=true){
    if(init){
      this.addEventListener('focusout',this._onFocusout);
    } else {
      this.removeEventListener('focusout',this._onFocusout);
    }
  }

  /**
   * handles change in select value
   *
   * @param {event} e change event
   * @memberof SimpleFieldsSelect
   */
  _onChange(e) {
    e.stopPropagation();
    if (e && e.path && e.path[0]) {
      if (this.type === "select") {
        this.value = this.multiple
          ? Object.keys(e.path[0].selectedOptions).map(
              option => e.path[0].selectedOptions[option].value
            )
          : e.path[0].selectedOptions[0].value;
      } else if (this.hasFieldSet && this.type === "radio") {
        this.value = e.path[0].value;
      } else if (this.hasFieldSet && this.type === "checkbox") {
        this.value = this.value || [];
        if (e.path[0].checked) {
          this.value.push(e.path[0].value);
        } else {
          this.value = this.value.filter(val => val !== e.path[0].value);
        }
      } else {
        this.value = e.path[0].value;
      }
    }
    this._onTextareaupdate();
    this._fireValueChanged();
  }
  /**
   * updates field an type
   *
   * @memberof SimpleFieldsInput
   */
  _updateField(){
    this.type = this._getValidType(this.type);
    this.field = this.shadowRoot && this.shadowRoot.querySelector(this.fieldElementTag)
      ? this.shadowRoot.querySelector(this.fieldElementTag)
      : undefined;
  }
}
window.customElements.define(SimpleFieldsField.tag, SimpleFieldsField);
export { SimpleFieldsField };