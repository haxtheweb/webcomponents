import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsContainer } from "./simple-fields-container.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 *`simple-fields-field`
 * HTML inputs (excluding submit, reset, button, and image)
 * with label, description, error massage,
 * and aria-invalid functionality if needed.
 *
 * @group simple-fields
 * @extends simple-fields-container
 * @element simple-fields-field
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
          background-color: var(--simple-fields-background-color, transparent);
        }
        option {
          border-radius: 0;
        }
        option[selected] {
          background-color: var(
            --simple-fields-faded-background-color,
            rgba(0, 0, 0, 0.1)
          );
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
          margin: 0 var(--simple-fields-margin-small, 8px) 0 0;
        }
        .option:last-of-type {
          margin: 0;
        }
        .option:focus-within label {
          color: var(--simple-fields-accent-color, #003f7d);
          transition: color ease-in-out;
        }
        :host([type]) fieldset .border-bottom {
          display: block;
        }
        .box-input:focus {
          outline: none;
        }
        .field-main.inline {
          align-items: center;
        }
        input {
          background-color: var(--simple-fields-background-color, transparent);
        }
        textarea {
          margin: 0;
          transition: height 0.5s ease-in-out;
          box-sizing: border-box;
          vertical-align: bottom;
          background-color: var(--simple-fields-background-color, transparent);
        }
        select.field {
          width: 100%;
          border: none;
          background-color: var(--simple-fields-background-color, transparent);
          border-radius: 0;
          transition: color ease-in-out;
        }
        select:focus,
        select:focus-within {
          outline: none;
        }
        :host([type="checkbox"]) span,
        :host([type="radio"]) span {
          position: relative;
          flex: 1 0 auto;
          display: flex;
          align-items: center;
        }
        :host([type="checkbox"]) span:focus-within,
        :host([type="radio"]) span:focus-within {
          color: var(--simple-fields-accent-color, #003f7d);
          outline: 1px dotted var(--simple-fields-accent-color, #003f7d);
        }
        :host([type="checkbox"]) label.checkbox-label,
        :host([type="radio"]) label.radio-label {
          flex: 0 0 auto;
        }
        :host([type="checkbox"]) input,
        :host([type="radio"]) input,
        .field-main.inline input[type="checkbox"].field,
        .field-main.inline input[type="radio"].field {
          z-index: -1;
          opacity: 0;
          min-width: 0;
          width: 0;
          margin: 0;
          flex: 0 1 0px;
        }
        :host([type="checkbox"]) simple-icon-lite,
        :host([type="radio"]) simple-icon-lite {
          flex: 0 0 auto;
        }
        :host([type="checkbox"]) simple-icon-lite:hover,
        :host([type="radio"]) simple-icon-lite:hover,
        :host([type="checkbox"]) span:focus-within simple-icon-lite,
        :host([type="radio"]) span:focus-within simple-icon-lite {
          color: var(--simple-fields-accent-color, #003f7d);
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
        :host([error]) input[type="range"]::-webkit-slider-runnable-track {
          background: var(--simple-fields-faded-error-color, #ff997f);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]::-webkit-slider-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background-color: var(--simple-fields-background-color, transparent);
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
        :host([error]) input[type="range"]::-webkit-slider-thumb {
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
        :host([error]) input[type="range"]::-moz-range-track {
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
        :host([error]) input[type="range"]::-moz-range-thumb {
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
        :host([error]) input[type="range"]::-ms-track {
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
        :host([error]) input[type="range"]::-ms-thumb {
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
      `,
    ];
  }
  render() {
    return !this.hasFieldset ? super.render() : this.fieldsetTemplate;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Hint for expected file type in file upload controls
       */
      accept: {
        type: String,
      },
      /**
       * Hint for form autofill feature
       */
      autocomplete: {
        type: String,
      },
      /**
       * Automatically focus on field when the page is loaded
       */
      autofocus: {
        type: Boolean,
      },
      /**
       * Media capture input method in file upload controls
       */
      capture: {
        type: String,
      },
      /**
       * a counter text and textareas: "character", "word" or unset for none
       */
      counter: {
        type: String,
      },
      /**
       * Name of form field to use for sending the element's directionality in form submission
       */
      dirname: {
        type: String,
      },
      /**
       * array of options [{value: "key", text: "Text"}] for select, radio options, and checkboxes,
       * so that they can appear in a prescribed order,
       * eg. [{value: "b", text: "Option B"}, {value: "a", text: "Option A"}, {value: "c", text: "Option C"}]
       */
      itemsList: {
        type: Array,
        attribute: "items-list",
      },
      /**
       * Value of the id attribute of the `<datalist>` of autocomplete options
       */
      list: {
        type: String,
      },
      /**
       * Maximum value for numeric field types
       */
      max: {
        type: Number,
      },
      /**
       * Maximum length (number of characters) of `value`
       */
      maxlength: {
        type: Number,
      },
      /**
       * Minimum value for numeric field types
       */
      min: {
        type: Number,
      },
      /**
       * Minimum length (number of characters) of `value`
       */
      minlength: {
        type: Number,
      },
      /**
       * Whether to allow multiple values
       */
      multiple: {
        type: Boolean,
      },
      /**
       * options {value: "Text"}  for select, radio options, and checkboxes,
       * which are sorted by key,
       * eg. {a: "Option A", b: "Option B", c: "Option C"}
       */
      options: {
        type: Object,
      },
      /**
       * Content to be appear in the form control when the form control is empty
       */
      placeholder: {
        type: String,
      },
      /**
       * Size of the control
       */
      size: {
        type: Number,
      },
      /*
       * Whether input subject to spell checking by browser/OS as "true", "default", or "false"
       */
      spellcheck: {
        type: String,
      },
      /**
       * Incremental values that are valid
       */
      step: {
        type: Number,
      },
      /**
       * Current value of the form control. Submitted with the form as part of a name/value pair.
       */
      value: {
        reflect: true,
      },
      /*
       * text wrapping for textarea,
       * "hard": automatically inserts line breaks (CR+LF)
       * "soft": all line breaks as CR+LF pair
       * "off" : no wrapping / <textarea> becomes horizontally scrollable
       */
      wrap: {
        type: Boolean,
      },
    };
  }
  constructor() {
    super();
    this.autocomplete = "off";
    this.autofocus = false;
    this.multiple = false;
    this.readonly = false;
    this.spellcheck = false;
    this.itemsList = [];
    this.options = {};
    this.wrap = false;
  }

  updated(changedProperties) {
    if (!this.field) this._updateField();
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id" && !this.id) this.id = this._generateUUID();
      if (this._getAttributes(this.type).includes(propName))
        this._updateAttribute(propName);
      if (propName === "value" && this.value !== oldValue) {
        if (this.field.value !== this.value) this.field.value = this.value;
        this._fireValueChanged();
      }
      if (
        ["counter", "maxlength", "type"].includes(propName) &&
        ["text", "textarea"].includes(this.type)
      )
        this._updateCount();
      if (
        (propName === "type" && this.type !== oldValue) ||
        ["itemsList", "options"].includes(propName)
      ) {
        this._updateField();
      }
    });
  }

  get hasFieldset() {
    return (
      (this.type === "radio" || this.type === "checkbox") && !this.noOptions
    );
  }

  /**
   * gets field element tag in shadow DOM
   *
   * @readonly
   * @returns {string}
   * @memberof SimpleFieldsField
   */
  get fieldElementTag() {
    return this.type === "select" || (this.type === "text" && !this.noOptions)
      ? "select"
      : this.type === "textarea"
      ? "textarea"
      : this.hasFieldset
      ? "fieldset"
      : "input";
  }

  /**
   * template label and field
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsField
   */
  get fieldMainTemplate() {
    return html`
      <div
        class="${this.inline ||
        ["checkbox", "color", "radio"].includes(this.type || "text")
          ? "field-main inline"
          : "field-main"}"
      >
        ${this.labelTemplate}
        <div>
          ${this.prefixTemplate}
          ${this.fieldElementTag === "input"
            ? this.inputTemplate
            : this.fieldElementTag === "select"
            ? this.selectTemplate
            : this.fieldElementTag === "textarea"
            ? this.textareaTemplate
            : ``}
          ${this.suffixTemplate}
        </div>
      </div>
    `;
  }
  /**
   *
   * gets field metadata
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsField
   */
  get fieldMeta() {
    return html` <div id="fieldmeta" aria-live="polite"></div> `;
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
        <legend class="label-main" ?hidden="${!this.label}">
          ${this.label}${this.error || this.required ? "*" : ""}
        </legend>
        <div id="options">
          ${(this.sortedOptions || []).map(
            (option) => html`
              <div class="option inline">
                <label for="${this.id}.${option.value}" class="radio-label"
                  >${option.text}</label
                >${this.getInput(option)}
              </div>
            `
          )}
        </div>
        ${this.fieldBottom}
      </fieldset>
    `;
  }
  _handleIconClick(checked, option) {
    this.value = !option
      ? !checked
      : this.type === "radio" && checked
      ? undefined
      : this.type === "radio"
      ? (option || {}).value
      : checked
      ? (this.value || []).filter((i) => i !== option.value)
      : [...(this.value || []), (option || {}).value];
    if (this.multicheck && this.autovalidate) {
      this.error = false;
      this.validate();
    }
  }
  getOptionIcon(checked) {
    return checked && this.type === "checkbox"
      ? "icons:check-box"
      : this.type === "checkbox"
      ? "icons:check-box-outline-blank"
      : checked
      ? "icons:radio-button-checked"
      : "icons:radio-button-unchecked";
  }
  getInput(option) {
    let checked = !option
        ? !!this.value
        : this.type === "radio"
        ? this.value === (option || {}).value
        : (this.value || []).includes((option || {}).value),
      icon = this.getOptionIcon(checked);
    return html`
      <span class="input-option">
        <input
          ?autofocus="${this.autofocus}"
          aria-descrbedby="${this.describedBy || ""}"
          .aria-invalid="${this.error ? "true" : "false"}"
          @change="${this._handleFieldChange}"
          ?checked="${checked}"
          class="field ${[
            "checkbox",
            "color",
            "file",
            "radio",
            "range",
          ].includes(this.type)
            ? ""
            : "box-input"}"
          ?disabled="${this.disabled}"
          @focus="${this._onFocusin}"
          @blur="${this._onFocusout}"
          ?hidden="${this.hidden}"
          id="${!option ? this.id : option.value}"
          @input="${this._handleFieldChange}"
          name="${this.id}"
          .placeholder="${this.placeholder || ""}"
          ?readonly="${this.readonly}"
          ?required="${this.required}"
          type="${this.type}"
          value="${!option ? this.value : (option || {}).value}"
        />
        ${this.type !== "checkbox" && this.type !== "radio"
          ? ""
          : html`
              <simple-icon-lite
                icon="${icon}"
                @click="${(e) => this._handleIconClick(checked, option)}"
              >
              </simple-icon-lite>
            `}
      </span>
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
    return this.getInput();
  }

  get multicheck() {
    return this.hasFieldset;
  }
  /**
   * gets whether or not the field has options
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get noOptions() {
    return (
      this.itemsList.length < 1 && Object.keys(this.options || {}).length < 1
    );
  }

  /**
   * determines if number of items selected
   * is not between min and max
   *
   * @readonly
   * @memberof SimpleFieldsContainer
   */
  get numberError() {
    let items = this._getFieldValue() ? this._getFieldValue().length : false,
      min = this.type === "select" || this.multicheck ? this.min : false,
      max = this.type === "select" || this.multicheck ? this.max : false;
    let more = min && items && min > items ? min - items : false,
      less = max && items && max < items ? max - items : more;
    return less;
  }
  /**
   * gets a sorted list of option
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get sortedOptions() {
    let sorted = (this.itemsList || []).map((item, i) =>
      typeof item === "object" ? item : { value: item, text: item }
    );
    Object.keys(this.options || {})
      .sort((a, b) => (a > b ? 1 : -1))
      .forEach((key) => sorted.push({ value: key, text: this.options[key] }));
    return sorted;
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
        ?autofocus="${this.autofocus}"
        aria-descrbedby="${this.describedBy}"
        aria-invalid="${this.error ? "true" : "false"}"
        @change="${this._handleFieldChange}"
        class="field"
        ?disabled="${this.disabled}"
        @focus="${this._onFocusin}"
        @blur="${this._onFocusout}"
        ?hidden="${this.hidden}"
        id="${this.id}"
        ?multiple="${this.multiple}"
        name="${this.id}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
      >
        ${(this.sortedOptions || []).map(
          (option) => html`
            <option
              .id="${this.id}.${option.value}"
              ?selected="${this.multiple
                ? this.value && this.value.includes(option.value)
                : this.value === option.value}"
              .value="${option.value}"
            >
              ${option.text}
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
   * @memberof SimpleFieldsField
   */
  get slottedFieldObserver() {}

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
        aria-invalid="${this.error ? "true" : "false"}"
        ?autofocus="${this.autofocus}"
        class="field box-input"
        @change="${this._handleFieldChange}"
        @keydown="${(e) => e.stopPropagation()}"
        ?disabled="${this.disabled}"
        @focus="${this._onFocusin}"
        @blur="${this._onFocusout}"
        ?hidden="${this.hidden}"
        id="${this.id}"
        @input="${this._handleFieldChange}"
        name="${this.id}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        rows="1"
      >
${this.value || ""}</textarea
      >
    `;
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
   * handles field changes by field type
   *
   * @memberof SimpleFieldsContainer
   */
  _handleFieldChange(e) {
    super._handleFieldChange();
    if (this.multicheck && this.autovalidate) {
      this.error = false;
      this.validate();
    }
  }

  /**
   * gets attributes that will only be set if they are defined
   * @param {string} [type=text] input type
   * @returns {array} list of attributes
   */
  _getAttributes(type) {
    let attributes = {
      checkbox: ["autocomplete", "form", "list"],
      color: ["autocomplete", "form", "list"],
      date: ["autocomplete", "form", "list", "max", "min", "step"],
      "datetime-local": ["form", "list", "max", "min", "step"],
      email: ["autocomplete", "form", "list", "placeholder"],
      file: ["autocomplete", "accept", "capture", "form", "list"],
      hidden: ["autocomplete", "form"],
      month: ["autocomplete", "form", "list", "max", "min", "step"],
      number: ["autocomplete", "form", "list", "max", "min", "step"],
      password: [
        "autocomplete",
        "form",
        "list",
        "maxlength",
        "maxlength",
        "pattern",
        "placeholder",
      ],
      radio: ["autocomplete", "form", "list"],
      range: ["autocomplete", "form", "list", "max", "min", "step"],
      search: [
        "autocomplete",
        "dirname",
        "form",
        "list",
        "maxlength",
        "maxlength",
        "placeholder",
      ],
      select: ["autocomplete", "form", "list", "size"],
      tel: [
        "autocomplete",
        "form",
        "list",
        "maxlength",
        "maxlength",
        "pattern",
        "placeholder",
      ],
      text: [
        "autocomplete",
        "dirname",
        "form",
        "list",
        "maxlength",
        "maxlength",
        "pattern",
        "placeholder",
      ],
      textarea: [
        "autocomplete",
        "autocomplete",
        "form",
        "maxlength",
        "maxlength",
        "placeholder",
        "spellcheck",
        "wrap",
      ],
      time: ["autocomplete", "form", "list", "max", "min", "step"],
      url: [
        "autocomplete",
        "form",
        "list",
        "maxlength",
        "maxlength",
        "placeholder",
      ],
      week: ["autocomplete", "form", "list", "max", "min", "step"],
    };
    return attributes[type];
  }
  _getFieldsetValue() {
    return this.value;
  }
  /**
   * listens for focusout
   * overridden for fields in shadow DOM
   *
   * @param {boolean} [init=true] whether to start observing or disconnect observer
   * @memberof SimpleFieldsField
   */
  _observeAndListen(init = true) {
    if (init) {
      this.addEventListener("click", this.focus);
    } else {
      this.removeEventListener("click", this.focus);
    }
  }

  /**
   * updates field attributes based on field type
   *
   * @param {string} attribute
   * @memberof SimpleFieldsContainer
   */
  _updateAttribute(attribute) {
    if (this.field && this[attribute] !== this.field.getAttribute(attribute)) {
      if (this[attribute]) {
        this.field.setAttribute(attribute, this[attribute]);
      } else {
        this.field.removeAttribute(attribute, this[attribute]);
      }
    }
  }
  /**
   * updates field an type
   *
   * @memberof SimpleFieldsField
   */
  _updateField() {
    this.type = this._getValidType(this.type);
    this.field =
      this.shadowRoot && this.shadowRoot.querySelector(this.fieldElementTag)
        ? this.shadowRoot.querySelector(this.fieldElementTag)
        : undefined;
    this._getAttributes(this.type).forEach((attr) =>
      this._updateAttribute(attr)
    );
    if (this.type !== "select" && this.field) this._updateAttribute("value");
  }
}
window.customElements.define(SimpleFieldsField.tag, SimpleFieldsField);
export { SimpleFieldsField };
