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
          margin: 0 var(--simple-fields-margin-small, 8px) 0 0;
        }
        .option:last-of-type {
          margin: 0;
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
        :host([error]) input[type="range"]::-webkit-slider-runnable-track {
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
       * Hint for expected file type in file upload controls
       */
      accept: {
        type: String
      },
      /**
       * Hint for form autofill feature
       */
      autocomplete: {
        type: String
      },
      /**
       * Automatically focus on field when the page is loaded
       */
      autofocus: {
        type: Boolean
      },
      /**
       * Media capture input method in file upload controls
       */
      capture: {
        type: String
      },
      /**
       * a counter text and textareas: "character", "word" or unset for none
       */
      counter: {
        type: String
      },
      /**
       * Name of form field to use for sending the element's directionality in form submission
       */
      dirname: {
        type: String
      },
      /**
       * array of options [{value: "key", text: "Text"}] for select, radio options, and checkboxes,
       * so that they can appear in a prescribed order,
       * eg. [{value: "b", text: "Option B"}, {value: "a", text: "Option A"}, {value: "c", text: "Option C"}]
       */
      itemsList: {
        type: Array
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
       * error message when number of items selected is not between min and max
       */
      numberMessage: {
        type: String
      },
      /**
       * options {value: "Text"}  for select, radio options, and checkboxes,
       * which are sorted by key,
       * eg. {a: "Option A", b: "Option B", c: "Option C"}
       */
      options: {
        type: Object
      },
      /**
       * regex pattern the value must match to be valid
       */
      pattern: {
        type: String
      },
      /**
       * error message when field does not match pattern
       */
      patternMessage: {
        type: String
      },
      /**
       * Content to be appear in the form control when the form control is empty
       */
      placeholder: {
        type: String
      },
      /**
       * error message when field is required and has no value
       */
      requiredMessage: {
        type: String
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
    this.autocomplete = "off";
    this.autofocus = false;
    this.multiple = false;
    this.readonly = false;
    this.spellcheck = false;
    this.id = this._generateUUID();
    this.List = [];
    this.options = {};
    this.wrap = false;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id" && !this.id) this.id = this._generateUUID();
      if (this._getAttributes(this.type).includes(propName))
        this._updateAttribute(propName);
      if (propName === "value" && this.value !== oldValue) {
        if (this.type !== "select" && this.field)
          this._updateAttribute("value");
        this._fireValueChanged();
      }
      if (
        ["counter", "maxlength", "type"].includes(propName) &&
        ["text", "textarea"].includes(this.type)
      )
        this._updateCount();
      if (propName === "type" && this.type !== oldValue) {
        this._updateField();
      }
    });
  }

  get hasFieldSet() {
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
    return html`
      <div id="fieldmeta" aria-live="polite"></div>
    `;
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
            option => html`
              <div class="option inline">
                <label for="${this.id}.${option.value}" class="radio-label"
                  >${option.text}</label
                >
                <input
                  .id="${option.value}"
                  .name="${this.id}"
                  ?autofocus="${this.autofocus}"
                  aria-descrbedby="${this.describedBy}"
                  .aria-invalid="${this.error ? "true" : "false"}"
                  ?checked="${this.type === "radio"
                    ? this.value === option.value
                    : (this.value || []).includes(option.value)}"
                  class="field"
                  @click="${this._onMulticheckChange}"
                  ?disabled="${this.disabled}"
                  ?hidden="${this.hidden}"
                  ?readonly="${this.readonly}"
                  ?required="${this.required}"
                  type="${this.type}"
                  .value="${option.value}"
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
        aria-descrbedby="${this.describedBy}"
        aria-invalid="${this.error ? "true" : "false"}"
        ?autofocus="${this.autofocus}"
        @change="${this._onInputChange}"
        ?checked="${this.value === true}"
        class="field ${["checkbox", "color", "file", "radio", "range"].includes(
          this.type
        )
          ? ""
          : "box-input"}"
        ?disabled="${this.disabled}"
        ?hidden="${this.hidden}"
        @input="${this._onInputChange}"
        .name="${this.id}"
        .placeholder="${this.placeholder || ""}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        .type="${this.type}"
      />
    `;
  }
  get sortedOptions() {
    let sorted = (this.itemsList || []).slice();
    console.log('sorted',sorted);
    Object.keys(this.options || {})
      .sort((a, b) => (a > b ? 1 : -1))
      .forEach(key => sorted.push({ value: key, text: this.options[key] }));
      console.log('sorted2',sorted);
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
        @change="${this._onSelectChange}"
        class="field"
        ?disabled="${this.disabled}"
        ?hidden="${this.hidden}"
        ?multiple="${this.multiple}"
        .name="${this.id}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
      >
        ${(this.sortedOptions|| []).map(
          option => html`
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
        @change="${this._onTextareaChange}"
        @keydown="${e => e.stopPropagation()}"
        ?disabled="${this.disabled}"
        ?hidden="${this.hidden}"
        @input="${this._onTextareaChange}"
        .name="${this.id}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        rows="1"
      >
${this.value || ""}</textarea
      >
    `;
  }
  /**
   * gets whether or not the field has options
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get noOptions() {
    return (
      (!this.List || this.itemsList === []) &&
      (!this.options || this.options === {})
    );
  }
  get valueIsArray() {
    return this.multiple || (this.type === "checkbox" && !this.noOptions);
  }
  /**
   * determines if number of items selected
   * is not between min and max
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get numberError() {
    let less = this.min ? !this.value || this.value.length < this.min : false,
      more = this.max ? this.value && this.value.length > this.max : false;
    return this.valueIsArray && (less || more);
  }
  /**
   * determines if value does not match regex pattern
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get patternError() {
    return (
      this.pattern &&
      this.pattern !== "" &&
      this.value &&
      (!this.multiple
        ? !this.value.match(this.pattern)
        : this.value.filter(value => !value.match(this.pattern)))
    );
  }
  /**
   * determines if field is required and blank
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get requiredError() {
    return !this.value && this.required;
  }

  /**
   * checks validation constraints and returns error data
   * @memberof SimpleFieldsField
   */
  validate() {
    if (this.requiredError) {
      this.error = true;
      this.errorMessage = this.requiredMessage || `required`;
    } else if (this.numberError) {
      let number = this.value ? this.value.length : 0;
      this.error = true;
      this.errorMessage =
        this.numberMessage || number < this.min
          ? `select ${this.min - number} more`
          : `select ${number - this.max} fewer`;
    } else if (this.patternError) {
      this.error = true;
      this.errorMessage = this.patternMessage || `invalid format`;
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
        "placeholder"
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
        "placeholder"
      ],
      select: ["autocomplete", "form", "list", "size"],
      tel: [
        "autocomplete",
        "form",
        "list",
        "maxlength",
        "maxlength",
        "pattern",
        "placeholder"
      ],
      text: [
        "autocomplete",
        "dirname",
        "form",
        "list",
        "maxlength",
        "maxlength",
        "pattern",
        "placeholder"
      ],
      textarea: [
        "autocomplete",
        "autocomplete",
        "form",
        "maxlength",
        "maxlength",
        "placeholder",
        "spellcheck",
        "wrap"
      ],
      time: ["autocomplete", "form", "list", "max", "min", "step"],
      url: [
        "autocomplete",
        "form",
        "list",
        "maxlength",
        "maxlength",
        "placeholder"
      ],
      week: ["autocomplete", "form", "list", "max", "min", "step"]
    };
    return attributes[type];
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
      this.addEventListener("focusout", this._onFocusout);
      this.addEventListener("focusin", this._onFocusin);
    } else {
      this.removeEventListener("click", this.focus);
      this.removeEventListener("focusout", this._onFocusout);
      this.removeEventListener("focusin", this._onFocusin);
    }
  }

  /**
   * handles change for inputs
   *
   * @param {event} e change event
   * @memberof SimpleFieldsSelect
   */
  _onInputChange(e) {
    if (!e.path[0]) return;
    if (this.type === "radio" || this.type === "checkbox") {
      this.value = e.path[0].checked;
    } else {
      this.value = e.path[0].value;
      if (this.type === "text") this._updateCount();
    }
  }

  /**
   * handles change for multiple checkboxes and radios
   *
   * @param {event} e change event
   * @memberof SimpleFieldsSelect
   */
  _onMulticheckChange(e) {
    if (!e.path[0]) return;
    if (this.type === "radio") {
      this.value = e.path[0].value;
    } else {
      this.value = this.value || [];
      if (e.path[0].checked) {
        this.value.push(e.path[0].value);
      } else {
        this.value = this.value.filter(val => val !== e.path[0].value);
      }
    }
  }

  /**
   * handles change for textarea
   *
   * @memberof SimpleFieldsField
   */
  _onTextareaChange(e) {
    if (!e.path[0]) return;
    this.value = e.path[0].value;
    this._updateCount();
    this.autoGrow(e.path[0]);
  }

  /**
   * handles change in select value
   *
   * @param {event} e change event
   * @memberof SimpleFieldsSelect
   */
  _onSelectChange(e) {
    if (!e.path[0]) return;
    this.value = this.multiple
      ? Object.keys(e.path[0].selectedOptions).map(
          option => e.path[0].selectedOptions[option].value
        )
      : e.path[0].selectedOptions[0].value;
  }

  /**
   * updates field attributes based on field type
   *
   * @param {string} attribute
   * @memberof SimpleFieldsField
   */
  _updateAttribute(attribute) {
    if (
      this.field &&
      this.type &&
      this[attribute] !== this.field.getAttribute(attribute)
    ) {
      if (this[attribute]) {
        this.field.setAttribute(attribute, this[attribute]);
      } else {
        this.field.removeAttribute(attribute, this[attribute]);
      }
    }
  }

  /**
   * updates counter and sets maximum word count
   *
   * @memberof SimpleFieldsField
   */
  _updateCount() {
    let count = ``;
    if (
      (this.type === "textarea" || this.type === "text") &&
      this.counter &&
      this.field
    ) {
      let word = `[\\w\\-\\']+`,
        counter = new RegExp(word, "gim"),
        max = `{0,${this.maxlength || 1}}`,
        maxword = `(${word}\\W*)${max}`,
        length = !this.value
          ? 0
          : this.counter === "character"
          ? this.field.value.length
          : this.field.value.match(counter)
          ? this.field.value.match(counter).length
          : 0,
        regex =
          this.counter === "character"
            ? new RegExp(`.${max}`, "g")
            : new RegExp(maxword, "g");
      if (
        this.value &&
        this.maxlength &&
        this.maxlength < length &&
        this.field.value.match(regex)
      ) {
        this.field.value = this.field.value.match(regex)[0];
        length = this.maxlength;
      }
      count = length;
    }
    if (this.shadowRoot && this.shadowRoot.querySelector("#fieldmeta"))
      this.shadowRoot.querySelector("#fieldmeta").innerHTML = this.maxlength
        ? `${count}/${this.maxlength}`
        : count;
    this.value = this.field.value;
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
    this._getAttributes(this.type).forEach(attr => this._updateAttribute(attr));
    if (this.type !== "select" && this.field) this._updateAttribute("value");
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
window.customElements.define(SimpleFieldsField.tag, SimpleFieldsField);
export { SimpleFieldsField };
