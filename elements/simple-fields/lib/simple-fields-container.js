import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *`simple-fields-container`
 * Progressive enhanced container HTML fields
 * with label, description, error massage,
 * and aria-invalid functionality if needed.
 *
 * @group simple-fields
 * @customElement simple-fields-container
 * @demo ./demo/container.html Demo
 */
class SimpleFieldsContainer extends LitElement {
  static get tag() {
    return "simple-fields-container";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: 100%;
          font-size: var(--simple-fields-detail-font-size, 12px);
          font-family: var(--simple-fields-detail-font-family, sans-serif);
          line-height: var(--simple-fields-detail-line-height, 22px);
          transition: color 0.3s ease-in-out;
          margin: var(--simple-fields-margin, 16px) 0;
        }
        :host([hidden]),
        :host([type="hidden"]) {
          display: none;
        }
        :host([error]) {
          color: var(--simple-fields-error-color, #dd2c00);
          transition: color 0.3s ease-in-out;
        }
        .field-main.inline,
        .field-main > div,
        #field-bottom {
          display: flex;
          align-items: stretch;
          justify-content: flex-start;
        }
        * {
          flex: 1 1 auto;
        }
        :host(:focus-within) .label-main {
          color: var(--simple-fields-accent-color, #3f51b5);
          transition: color 0.3s ease-in-out;
        }
        .inline label {
          margin: 0 var(--simple-fields-margin-small, 8px) 0 0;
          flex: 0 1 auto;
        }
        .inline label,
        .field-main > div,
        .field,
        ::slotted([slot="field"]) {
          font-size: var(--simple-fields-font-size, 16px);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-line-height, 22px);
        }
        .field,
        ::slotted([slot="field"]) {
          width: auto;
          border: none;
          color: var(--simple-fields-color, black);
          transition: opacity ease-in-out;
          flex: 1 0 auto;
        }
        .field-main.inline .field,
        .field-main.inline ::slotted([slot="field"]) {
          min-width: var(--simple-fields-detail-line-height, 22px);
          height: var(--simple-fields-detail-line-height, 22px);
          margin: 0 var(--simple-fields-margin-small, 8px) 0 0;
        }
        .field[disabled],
        ::slotted([slot="field"][readonly]) {
          opacity: var(--simple-fields-disabled-opacity, 0.7);
          transition: opacity ease-in-out;
        }
        .field[readonly],
        .field[disabled],
        ::slotted([slot="field"][readonly]),
        ::slotted([slot="field"][disabled]) {
          cursor: not-allowed;
        }
        .border-bottom {
          height: 0;
        }
        :host([type="checkbox"]) .border-bottom,
        :host([type="color"]) .border-bottom,
        :host([type="file"]) .border-bottom,
        :host([type="radio"]) .border-bottom,
        :host([type="range"]) .border-bottom {
          display: none;
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
    return html`
      ${this.fieldMainTemplate} ${this.fieldBottom}
    `;
  }
  static get properties() {
    return {
      /**
       * Automatically validate field
       */
      autovalidate: {
        type: Boolean
      },
      /**
       * Optional description of the field (or use slot="description")
       */
      description: {
        type: String
      },
      /**
       * Whether the form control is disabled
       */
      disabled: {
        type: Boolean,
        reflect: true
      },
      /**
       * Optional validation error message to display
       */
      defaultErrorMessage: {
        type: String
      },
      /**
       * Optional required validation error message to display
       */
      defaultRequiredMessage: {
        type: String
      },
      /**
       * Whether field has errors
       */
      error: {
        type: Boolean,
        reflect: true
      },
      /**
       * Validation error message to display
       */
      errorMessage: {
        type: String
      },
      /**
       * Whether the field is hidden
       */
      hidden: {
        type: Boolean,
        reflect: true
      },
      /**
       * Field element
       */
      field: {
        type: Object
      },
      /**
       * Unique id
       */
      id: {
        type: String,
        reflect: true
      },
      /**
       * Whether field and label should be inline
       */
      inline: {
        type: Boolean,
        reflect: true
      },
      /**
       * Label for the field (or use slot="label")
       */
      label: {
        type: String
      },
      /**
       * Name of the input form control. Submitted with the form as part of a name/value pair.
       */
      name: {
        type: String,
        reflect: true
      },
      /**
       * Optional prefix string (or use slot="prefix")
       */
      prefix: {
        type: String
      },
      /**
       * Whether field is required
       */
      required: {
        type: Boolean,
        reflect: true
      },
      /**
       * Optional suffix string (or use slot="suffix")
       */
      suffix: {
        type: String
      },
      /**
       * Current value of the form control. Submitted with the form as part of a name/value pair.
       */
      value: {
        reflect: true
      },
      /**
       * Type of input form control
       */
      type: {
        type: String,
        reflect: true
      },
      /**
       * List of valid field types
       */
      validTypes: {
        type: Array
      }
    };
  }
  constructor() {
    super();
    this.autovalidate = false;
    this.disabled = false;
    this.hidden = false;
    this.error = false;
    this.inline = false;
    this.validTypes = [
      "checkbox",
      "color",
      "date",
      "datetime-local",
      "email",
      "file",
      "hidden",
      "month",
      "number",
      "password",
      "radio",
      "range",
      "search",
      "select",
      "tel",
      "text",
      "textarea",
      "time",
      "url",
      "week"
    ];
    this._observeAndListen();
  }

  disconnectedCallback() {
    this._observeAndListen(false);
    super.disconnectedCallback();
  }
  /**
   * updates slotted field
   *
   * @memberof SimpleFieldsContainer
   */
  firstUpdated() {
    this._updateField();
  }
  /**
   * updates for slotted input
   * overrride for shadow DOM
   *
   * @param {*} changedProperties
   * @memberof SimpleFieldsContainer
   */
  updated(changedProperties) {
    let errorChanged = false;
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "error" && this.error !== oldValue) errorChanged = true;
      if (propName === "errorMessage" && this.errorMessage !== oldValue)
        errorChanged = true;
      if (propName === "error" && this.field) {
        this.field.setAttribute("aria-invalid", this.error ? "true" : "false");
      }
    });
    if (errorChanged) this._fireErrorChanged();
  }

  /**
   * template for slotted or shadow DOM description
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get descriptionTemplate() {
    return html`
      <div id="description">
        <slot name="description"></slot>
        ${this.description}
      </div>
    `;
  }

  /**
   * template for slotted or shadow DOM error message
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get errorTemplate() {
    return html`
      <div id="error-message" ?hidden="${!this.error}" role="alert">
        ${this.errorMessage}
      </div>
    `;
  }

  /**
   *
   * gets bottom (metadata, description, and error message) of a field
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get fieldBottom() {
    return html`
      <div class="border-bottom blur"></div>
      <div class="border-bottom focus"></div>
      <div id="field-bottom">
        <div id="error-desc">
          ${this.descriptionTemplate} ${this.errorTemplate}
        </div>
        ${this.fieldMeta}
      </div>
    `;
  }
  /**
   * gets field element tag in shadow DOM
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
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
   * gets field's id
   *
   * @readonly
   * @returns {string}
   * @memberof SimpleFieldsContainer
   */
  get fieldId() {
    return `${this.id || "field"}.input`;
  }

  /**
   * template for slotted or shadow DOM label
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
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
          <slot name="field"></slot>
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
   * @memberof SimpleFieldsContainer
   */
  get fieldMeta() {
    return html`
      <div id="fieldmeta" aria-live="polite">
        <slot name="field-meta"></slot>
      </div>
    `;
  }

  /**
   * template for slotted or shadow DOM label
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get labelTemplate() {
    return html`
      <label for="${this.fieldId}" class="label-main">
        <slot name="label"></slot>
        ${this.label}${this.error || this.required ? "*" : ""}
      </label>
    `;
  }

  /**
   * determines if field is numeric
   *
   * @readonly
   * @returns {boolean}
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
   * template for slotted or shadow DOM prefix
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get prefixTemplate() {
    return html`
      <slot name="prefix"></slot>
      ${this.prefix}
    `;
  }

  /**
   * mutation observer that updates field property with slotted field
   * override for shadow DOM field
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get slottedFieldObserver() {
    return new MutationObserver(this._updateField);
  }

  /**
   * template for slotted or shadow DOM suffix
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get suffixTemplate() {
    return html`
      <slot name="suffix"></slot>
      ${this.suffix}
    `;
  }

  /**
   * focuses on field
   * @memberof SimpleFieldsInput
   */
  focus() {
    if (this.field) this.field.focus();
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
   * checks validation constraints and returns error data (for slotted field)
   * @returns {object}
   * @memberof SimpleFieldsInput
   */
  validate() {
    let value = this.field.value,
      pattern = this.field.pattern,
      requiredError =
        !value && this.required
          ? this.defaultRequiredMessage || this.defaultErrorMessage
          : false,
      patternError =
        pattern !== "" && value && !value.match(pattern)
          ? this.defaultErrorMessage
          : false;
    this.errorMessage = requiredError || patternError;
    this.error = this.errorMessage !== false;
  }
  /**
   * fires when error changes
   * @event error-changed
   */
  _fireErrorChanged() {
    this.dispatchEvent(
      new CustomEvent("error-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
  /**
   * gets a valid version of a given type
   *
   * @param {string} type
   * @returns {string}
   * @memberof SimpleFieldsContainer
   */
  _getValidType(type) {
    if (type === "datetime" && this.validTypes.includes(type)) {
      return "datetime-local";
    } else if (this.validTypes.includes(type)) {
      return type;
    }
    return "text";
  }
  /**
   * observes slotted field and listens for focusout
   * override for fields in shadow DOM
   *
   * @param {boolean} [init=true] whether to start observing or disconnect observer
   * @memberof SimpleFieldsContainer
   */
  _observeAndListen(init = true) {
    if (init) {
      this.slottedFieldObserver.observe(this, {
        attributeFilter: ["required", "slot"],
        childlist: true
      });
      this._updateField();
      this.addEventListener("click", this.focus);
      this.addEventListener("focusout", this._onFocusout);
      this.addEventListener("focusin", this._onFocusin);
    } else {
      this.slottedFieldObserver.disconnect();
      this.removeEventListener("click", this.focus);
      this.removeEventListener("focusout", this._onFocusout);
      this.removeEventListener("focusin", this._onFocusin);
    }
  }
  /**
   * handles focusout validation
   *
   * @memberof SimpleFieldsContainer
   */
  _onFocusin() {
    this.error = false;
  }
  /**
   * handles focusout validation
   *
   * @memberof SimpleFieldsContainer
   */
  _onFocusout() {
    if (this.autovalidate) this.validate();
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

  /**
   * updates field an type
   *
   * @memberof SimpleFieldsInput
   */
  _updateField() {
    this.field =
      this.querySelector && this.querySelector("[slot=field]")
        ? this.querySelector("[slot=field]")
        : undefined;
    this.id = `${this.fieldId || ""}-wrapper`;
    if (this.field) {
      let tag = this.field.tagName.toLowerCase(),
        type = this.field.type || this.field.getAttribute("type") || "text";
      this.type = this._getValidType(tag === "input" ? type : tag);
      this.required = this.field.required;
      this.field.setAttribute("aria-describedby", "field-bottom");
    } else {
      this.required = false;
      this.type = undefined;
    }
  }
}
window.customElements.define(SimpleFieldsContainer.tag, SimpleFieldsContainer);
export { SimpleFieldsContainer };
