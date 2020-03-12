import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsField } from "./simple-fields-field.js";
/**
 *`simple-fields-input`
 * provides label, description, error massage, and aria-invalid functionality if needed
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
        :host([type="hidden"]) { 
          display: none; 
        }
        input[type="range"]{
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
          background: var(--simple-fields-border-color-light,#ccc);
          border-radius: 8px;
        }
        input[type="range"]::-webkit-slider-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--simple-fields-background-color,white);
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -2px;
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]:focus::-webkit-slider-thumb {
          background: var(--simple-fields-accent-color, #3f51b5);
          transition: all 0.5ms ease-in-out;
        }
        :host([invalid]) input[type="range"]::-webkit-slider-thumb {
          background: var(--simple-fields-error-color, #dd2c00);
          transition: all 0.5ms ease-in-out;
        }
        :host([disabled]) input[type="range"]::-webkit-slider-thumb {
          background: var(--simple-fields-border-color, #999);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]::-moz-range-track {
          width: 100%;
          height: 16px;
          cursor: pointer;
          background: var(--simple-fields-border-color-light,#ccc);
          border-radius: 8px;
        }
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--simple-fields-background-color,white);
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
        :host([disabled]) input[type="range"]::-moz-range-thumb {
          background: var(--simple-fields-border-color, #999);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]::-ms-track {
          width: 100%;
          height: 16px;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          color: transparent;
        }
        input[type="range"]::-ms-fill-lower {
          background: var(--simple-fields-border-color-light,#ccc);
          border-radius: 8px;
        }
        input[type="range"]::-ms-fill-upper {
          background: var(--simple-fields-border-color-light,#ccc);
          border-radius: 8px;
        }
        input[type="range"]::-ms-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--simple-fields-background-color,white);
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
          cursor: pointer;
        }
        input[type="range"]:focus::-ms-thumb {
          background: var(--simple-fields-accent-color, #3f51b5);
        }
        :host([invalid]) input[type="range"]::-ms-thumb {
          background: var(--simple-fields-error-color, #dd2c00);
          transition: all 0.5ms ease-in-out;
        }
        :host([disabled]) input[type="range"]::-ms-thumb {
          background: var(--simple-fields-border-color, #999);
          transition: all 0.5ms ease-in-out;
        }
        input[type="range"]:focus::-ms-fill-lower {
          background: var(--simple-fields-border-color-light,#ccc);
        }
        input[type="range"]:focus::-ms-fill-upper {
          background: var(--simple-fields-border-color-light,#ccc);
        }
      `
    ];
  }
  render() {
    return html`
      <div class="label-input">
        ${this.labelElement}
        ${this.type === "textarea"
          ? html`
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
${this.value || ""}</textarea
              >
            `
          : html`
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
            `}
        ${this.borderBottom}
      </div>
      ${this.descriptionElement} ${this.errorElement}
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
      defaultValidation: {
        type: Boolean
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
      wrap: {
        type: Boolean
      }
    };
  }
  constructor() {
    super();
    this.checked = false;
    this.multiple = false;
    this.patternTypes = {
      email: "^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$",
      tel: "^(\+?\d\D*)?(\(\d{3}\)|\d{3})\D?[0-9a-zA-Z]{3}\D?[0-9a-zA-Z]{4}(.*x.*\d{4})?$",
      url: "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?"
    }
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
      multiple: ["email", "file"],
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
    if (e && e.path && e.path[0]) this.value = e.path[0].value;
    this._onTextareaupdate();
  }
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
