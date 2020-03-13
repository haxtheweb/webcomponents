import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsField } from "./simple-fields-field.js";
/**
 *`simple-fields-input`
 * HTML inputs (excluding submit, reset, button, and image) with label, description, error massage, and aria-invalid functionality if needed.
 *
 * @group simple-fields
 * @extends simple-fields-field
 * @customElement simple-fields-input
 * @demo ./demo/input.html
 */
class SimpleFieldsInput extends SimpleFieldsField {
  static get tag() {
    return "simple-fields-input";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host([type="hidden"]),
        :host([type="button"]),
        :host([type="image"]),
        :host([type="submit"]),
        :host([type="reset"]) {
          display: none;
        }
        input,
        select,
        textarea {
          width: 100%;
          font-size: var(--simple-fields-font-size, 16px);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-line-height, 22px);
          border: none;
        }
        input[readonly],
        input[disabled],
        select[disabled],
        select[disabled],
        textarea[readonly],
        textarea[disabled] {
          cursor: not-allowed;
        }
        :host(:focus-within) label {
          color: var(--simple-fields-accent-color, #3f51b5);
          transition: color 0.3s ease-in-out;
        }
        :host([invalid]) label,
        :host([invalid]) .error-message,
        :host([invalid]) #error-message {
          color: var(--simple-fields-error-color, #dd2c00);
          transition: color 0.3s ease-in-out;
        }
        :host([required]) label:after, 
        :host([invalid]) label:after {
          content: "*";
        }

        :host([type="color"]) .label-input,
        :host([type="checkbox"]) .label-input,
        :host([type="radio"]) .label-input {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          justify-content: flex-start;
        }
        :host([type="color"]) label,
        :host([type="checkbox"]) label,
        :host([type="radio"]) label {
          font-size: var(--simple-fields-font-size, 16px);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-line-height, 22px);
          flex: 0 1 auto;
        }
        input[type="color"],
        input[type="checkbox"],
        input[type="radio"] {
          width: var(--simple-fields-detail-line-height, 22px);
          height: var(--simple-fields-detail-line-height, 22px);
          flex: 0 0 auto;
          margin: 0 0 0 var(--simple-fields-margin-small, 8px);
          max-width: calc(
            100% - var(--simple-fields-detail-line-height, 22px) -
              var(--simple-fields-margin-small, 8px)
          );
        }
        input[type="color"] {
          box-sizing: border-box;
          width: unset;
          min-width: var(--simple-fields-detail-line-height, 22px);
          transition: opacity 0.5s ease-in-out;
        }
        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        input[type="color"][disabled] {
          opacity: 0.5;
          transition: opacity 0.5s ease-in-out;
        }
        input[type="range"] {
          height: calc(
            var(--simple-fields-font-size, 16px) +
              var(--simple-fields-line-height, 22px)
          );
          padding: 0;
          box-sizing: border-box;
        }
        textarea {
          margin: 0;
          transition: height 0.5s ease-in-out;
          box-sizing: border-box;
          vertical-align: bottom;
        }
        select {
          width: 100%;
          border: none;
          background: transparent;
          border-radius: 0;
          transition: color ease-in-out;
        }
        option {
          border-radius: 0;
        }

        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          margin: 10px 0;
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
          background: var(--simple-fields-faded-error-color, #FF997F);
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
          background: var(--simple-fields-faded-error-color, #FF997F);
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
          background: var(--simple-fields-faded-error-color, #FF997F);
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
        .box-input:focus {
          outline: none;
        }
        .border-bottom {
          height: 0;
        }
        .border-bottom.blur {
          border-bottom: 1px solid var(--simple-fields-border-color, #999);
          width: 100%;
        }
        .border-bottom.focus {
          margin: -1px auto 0;
          width: 0;
          border-bottom: 2px solid var(--simple-fields-accent-color, #3f51b5);
          transition: width 0.5s ease-in-out;
        }
        :host(:focus-within) .border-bottom.focus {
          width: 100%;
          transition: width 0.5s ease-in-out;
        }
      `
    ];
  }
  render() {
    return this.hasFieldSet
      ? html`${this.fieldset}`
      : html`
        <div class="label-input">
          ${this.labelElement}
          ${this.type === "textarea"
            ? html`${this.textarea}`
            : this.type === 'select' 
              ? html`${this.select}`
              :html`${this.input}`
          }
          ${this.borderBottom}
        </div>
        ${this.descriptionElement}
        ${this.errorElement}
      `;
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
    this.field = this.shadowRoot
      ? this.shadowRoot.querySelector("input,textarea")
      : undefined;
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
      if (propName === "type" || propName === "field") {
        attributes.forEach(prop => this.updateAttribute(prop));
        this._onTextareaupdate();
      }
      if (["type", "field", "value"].includes(propName))
        this._onTextareaupdate();
      if (attributes.includes(propName)) this.updateAttribute(propName);
    });
    super.updated(changedProperties);
  }

  get hasFieldSet(){
    return Object.keys(this.options || {}).length > 0 
      && (this.type === "radio" || this.type === "checkbox");
  }

  get fieldset() {
    return html`
      <fieldset>
        <legend id="legend" ?hidden="${!this.label}">
          ${this.label}
        </legend>
        <div id="options">
          ${Object.keys(this.options || {}).map(
            option => html`
              <div class="option">
                <label for="${this.id}.${option}" class="radio-label"
                  >${this.options[option]}</label
                >
                <input
                  .id="${this.id}.${option}"
                  ?autofocus="${this.autofocus}"
                  autocomplete="${this.autocomplete}"
                  .aria-invalid="${this.invalid ? "true" : "false"}"
                  .checked="${this.value === option}"
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
        ${this.descriptionElement} ${this.errorElement}
      </fieldset>
    `;
  }

  get input(){
    return html`
      <input
        .id="${this.fieldId}"
        aria-invalid="${this.invalid}"
        ?autofocus="${this.autofocus}"
        @change="${this._onChange}"
        class="${[
          "checkbox",
          "color",
          "file",
          "radio",
          "range"
        ].includes(this.type)
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
   * determines if field is numeric
   *
   * @readonly
   * @memberof SimpleFieldsInput
   */
  get numeric() {
    return [
      "date",
      "month",
      "week",
      "time",
      "datetime-local",
      "number",
      "range"
    ].includes(this.type);
  }
  /**
   * gets select element
   *
   * @readonly
   * @memberof SimpleFieldsInput
   */
  get select(){
    return html`
      <select 
        id="${this.id}.select" 
        ?autofocus="${this.autofocus}"
        .autocomplete="${this.autocomplete}"
        .aria-invalid="${this.invalid ? "true" : "false"}"
        @change="${this._onChange}"
        ?disabled="${this.disabled}"
        ?hidden="${this.hidden}"
        ?required="${this.required}"
        ?mutliple="${this.mutliple}"
        size="${this.size}"
        .value="${this.value}">
        ${Object.keys(this.options || {}).map(
          option => html`
            <option
              .id="${this.id}.${option}"
              ?selected="${this.multiple
                ? this.value.contains(option)
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
   * gets textarea element
   *
   * @readonly
   * @memberof SimpleFieldsInput
   */
  get textarea(){
    return html`
      <textarea
        .id="${this.fieldId}"
        aria-invalid="${this.invalid}"
        ?autofocus="${this.autofocus}"
        class="box-input"
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
      >
        ${this.value || ""}
      </textarea>
    `;
  }

  /**
   * updates field attributes based on field type
   *
   * @param {string} attribute
   * @memberof SimpleFieldsInput
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
   * selects all text
   * @memberof SimpleFieldsInput
   */
  select() {
    if (this.field && (this.type === "text" || this.type === "textarea"))
      this.field.select();
  }

  /**
   * replaces a range of text
   * @param {string} replacement string to insert
   * @param {number=selectionStart} start 0-based index first character to replace
   * @param {number=selectionEnd} end 0-based index after last character to replace
   * @param {selectMode} after the text has been replaced:
   * "select" selects the newly inserted text,
   * "start" moves the selection to just before the inserted text,
   * "end" moves the selection to just after the inserted text, and
   * "preserve" attempts to preserve the selection. This is the default.
   * @memberof SimpleFieldsInput
   */
  setRangeText(replacement, start, end, selectMode) {
    if (this.field && (this.type === "text" || this.type === "textarea"))
      this.field.setRangeText(replacement, start, end, selectMode);
  }

  /**
   * selects a range of text
   * @param {string} replacement string to insert
   * @param {selectionStart} start 0-based index first character
   * @param {selectionEnd} end 0-based index after last character
   * @param {selectMode} selection direction: "forward", "backward", or default "none"
   * @memberof SimpleFieldsInput
   */
  setSelectionRange(selectionStart, selectionEnd, selectionDirection) {
    if (this.field && (this.type === "text" || this.type === "textarea"))
      this.field.setSelectionRange(
        selectionStart,
        selectionEnd,
        selectionDirection
      );
  }

  /**
   * decrements by a multiple of step
   *
   * @param {number} [n=1]
   * @memberof SimpleFieldsInput
   */
  stepDown(n = 1) {
    if (this.field && this.numeric) this.field.stepDown();
  }

  /**
   * increments by a multiple of step
   *
   * @param {number} [n=1]
   * @memberof SimpleFieldsInput
   */
  stepUp(n = 1) {
    if (this.field && this.numeric) this.field.stepUp();
  }
  /**
   * handles change in select value
   *
   * @param {event} e change event
   * @memberof SimpleFieldsSelect
   */
  _onChange(e) {
    if (e && e.path && e.path[0]) {
      if(this.type == "select"){
        this.value = this.multiple
        ? e.path[0].selectedOptions.map(option => option.value)
        : e.path[0].selectedOptions[0].value;
      } else if(this.hasFieldSet && this.type === "radio"){
        this.value =  e.path[0].value;
      } else if(this.hasFieldSet && this.type === "checkbox"){
        if(e.path[0].checked) { 
          this.value.push(e.path[0].value);
        } else {
          this.value.filter(val => val !== e.path[0].value);
        }
      } else {
        this.value = e.path[0].value
      }
    }
    this._onTextareaupdate();
  }
  /**
   * makes textarea autogrow
   *
   * @memberof SimpleFieldsInput
   */
  _onTextareaupdate() {
    let textarea = this.shadowRoot
      ? this.shadowRoot.querySelector("textarea")
      : false;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    }
  }
}
window.customElements.define(SimpleFieldsInput.tag, SimpleFieldsInput);
export { SimpleFieldsInput };
