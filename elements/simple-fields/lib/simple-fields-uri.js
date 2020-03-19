import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsContainer } from "./simple-fields-container.js";
/**
 *`simple-fields-uri`
 * HTML inputs (excluding submit, reset, button, and image)
 * with label, description, error massage,
 * and aria-invalid functionality if needed.
 *
 * @group simple-fields
 * @extends simple-fields-container
 * @customElement simple-fields-uri
 * @demo ./demo/field.html
 */
class SimpleFieldsUri extends SimpleFieldsContainer {
  static get tag() {
    return "simple-fields-uri";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        /*:host {
          display: block;
          visibility: visible;
          transition: 0.3s all ease;
          box-sizing: border-box;
          pointer-events: all;
          overflow: visible;
          --simple-camera-snap-width: 300px;
          --simple-camera-snap-height: calc(300px * 9 / 16);
          --simple-camera-snap-color: var(--eco-json-form-color, #222);
          --simple-camera-snap-background: var(--eco-json-form-bg, white);
          --simple-camera-snap-border-radius: 2px;
          --lumo-font-family: var(
            --eco-json-form-font-family,
            var(--paper-font-caption_-_font-family, unset)
          );
          --lumo-base-color: var(
            --eco-json-form-bg,
            var(--primary-background-color, #fff)
          );
          --lumo-primary-contrast-color: var(
            --eco-json-form-bg,
            var(--primary-background-color, #fff)
          );
          --lumo-primary-color: var(
            --eco-json-form-active-color,
            var(--primary-color, #000)
          );
          --lumo-primary-text-color: var(
            --eco-json-form-color,
            var(--primary-text-color, #222)
          );
          --lumo-body-text-color: var(
            --eco-json-form-color,
            var(--primary-text-color, #222)
          );
          --lumo-header-text-color: var(
            --eco-json-form-color,
            var(--primary-text-color, #222)
          );
          --lumo-secondary-text-color: var(
            --eco-json-form-faded-color,
            var(--secondary-text-color, #888)
          );
          --lumo-disabled-text-color: var(
            --eco-json-form-faded-color,
            var(--secondary-text-color, #888)
          );
          background-color: var(
            --eco-json-form-bg,
            var(--primary-background-color, #fff)
          );
        }
        :host #legend {
          transition: all 0.5s;
          color: var(
            --eco-json-form-faded-color,
            var(--secondary-text-color, #888)
          );
        }
        :host(:focus-within) #legend {
          color: var(--eco-json-form-active-color, var(--primary-color, #000));
        }
        :host #fieldset {
          border-radius: 2px;
          transition: all 0.5s;
          border: 1px solid
            var(--eco-json-form-faded-color, var(--secondary-text-color, #888));
        }
        :host #fieldset > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        :host #fieldset > div > *:not(#picker) {
          flex: 1 1 auto;
        }
        #picker {
          margin-bottom: 0;
          margin-right: 5px;
        }
        vaadin-upload {
          padding: 0;
          margin: 0;
        }
        simple-camera-snap {
          position: relative;
          --simple-camera-snap-button-container-position: absolute;
          --simple-camera-snap-button-container-bottom: 2px;
          --simple-camera-snap-button-container-z-index: 5;
          --simple-camera-snap-button-border-radius: 100%;
          --simple-camera-snap-button-opacity: 0.7;
        }*/
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
    return html`
      <fieldset>
        <legend class="label-main" ?hidden="${!this.label}">
          ${this.label}${this.error || this.required ? "*" : ""}
        </legend>
        <simple-picker
            id="picker"
            aria-label="Source..."
            required
            value="${this.option}"
            @value-changed="${this.optionChanged}"
            .options="${this.options}"
          >
        </simple-picker>
        <simple-fields-field
          id="url"
          ?hidden="${this.option !== "url"}"
          value="${this.value}"
          @value-changed="${this.valueChanged}"
          label="URL"
          type="url"
          auto-validate=""
        ></simple-fields-field>
        <vaadin-upload
          capture
          form-data-name="file-upload"
          ?hidden="${this.option !== "fileupload"}"
          id="fileupload"
          @upload-before="${this._fileAboutToUpload}"
          @upload-response="${this._fileUploadResponse}"
        ></vaadin-upload>
        <div id="camerahole" ?hidden="${this.option !== "selfie"}"></div>
        <div id="voicerecorder" ?hidden="${this.option !== "audio"}"></div>
      </fieldset>
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
       * options {value: "Text"} for select as object,
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
    this.wrap = false;
    this.options = {};
    this.__winEvents = {
      "hax-app-picker-selection": "_haxAppPickerSelection"
    };
    this.label = null;
    this.noCamera = false;
    // @todo leave this off until we can do more testing
    // the wiring is all there but the UI pattern is not
    this.noVoiceRecord = true;
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@vaadin/vaadin-upload/vaadin-upload.js");
    import("@lrnwebcomponents/simple-picker/lib/simple-picker-option.js");
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
  optionChanged(e) {
    this.option = e.detail.value;
  }
  valueChanged(e) {
    this.value = e.detail.value;
  }

  /**
   * overridden mutation observer
   *
   * @readonly
   * @memberof SimpleFieldsUri
   */
  get slottedFieldObserver() {}

  /**
   * determines if value does not match regex pattern
   *
   * @readonly
   * @memberof SimpleFieldsUri
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
   * @memberof SimpleFieldsUri
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
   * updates field attributes based on field type
   *
   * @param {string} attribute
   * @memberof SimpleFieldsUri
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
   * updates field an type
   *
   * @memberof SimpleFieldsUri
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
window.customElements.define(SimpleFieldsUri.tag, SimpleFieldsUri);
export { SimpleFieldsUri };
