import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsField } from "./simple-fields-field.js"
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
              ?disabled="${this.disabled}"
              ?hidden="${this.hidden}"
              .name="${this.fieldId}"
              ?readonly="${this.readonly}"
              ?required="${this.required}"
              size="${this.size}">
              ${this.value}
            </textarea>
          ` 
          : html`
            <input 
              .id="${this.fieldId}"
              aria-invalid="${this.invalid}"
              ?autofocus="${this.autofocus}"
              @change="${this._onChange}"
              class="${["checkbox","color","file","radio","range"].includes(this.type) ? '' : 'box-input'}"
              dirname="${this.dirname}"
              ?disabled="${this.disabled}"
              ?hidden="${this.hidden}"
              .name="${this.fieldId}"
              ?readonly="${this.readonly}"
              ?required="${this.required}"
              .type="${this.type}">
          `
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
      /** TODO autocapitalize ,cols, rows, spellcheck, wrap, andd props */
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
      }
    };
  }
  constructor() {
    super();
    this.checked = false;
    this.multiple = false;
    this.readonly = false;
    this.options = {};
    this.field = this.shadowRoot ? this.shadowRoot.querySelector('input,textarea') : undefined;
  }

  updated(changedProperties) {
    let attributes = [
      "accept","autocomplete","capture","checked",
      "dirname","list","max","maxlength",
      "min","minlength","muliple",
      "pattern","size","step"
    ];
    changedProperties.forEach((oldValue, propName) => {
      if(propName === "type" || propName === "field"){
        attributes.forEach(prop=>this.updateAttribute(prop))
      }
      if(attributes.contains(propName)) this.updateAttribute(propName);
    });
    super.updated(changedProperties);
  }

  /**
   * determines if field is numeric
   *
   * @readonly
   * @memberof SimpleFieldsInput
   */
  get numeric(){
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
  updateAttribute(attribute){
    let types = {
      accept:	["file"],
      capture: ["file"],
      checked: ["radio", "checkbox"],
      dirname: ["text", "search"],
      max: ["date", "month", "week", "time", "datetime-local", "number", "range"],
      maxlength: ["password", "search", "tel", "text", "textrea", "url"],
      min: ["date", "month", "week", "time", "datetime-local", "number", "range"],
      minlength: ["password", "search", "tel", "text", "textarea", "url"],
      multiple:	["email", "file"],
      pattern: ["password", "text", "tel"],
      size:	["password", "text", "tel", "text", "textarea"],
      step:	["date", "month", "week", "time", "datetime-local", "number", "range"]
    };
    if(
      this.field && 
      this.type && 
      this[attribute] !== this.field.getAttribute(attribute)
    ){
      if(
        this[attribute] && 
        (!types[attribute] || types[attribute].includes(this.type))
      ) {
        this.field.setAttribute(attribute,this[attribute]);
      } else {
        this.field.removeAttribute(attribute,this[attribute]);
      }
    }
  }

  /**
   * selects all text 
   * @memberof SimpleFieldsInput
   */
  select(){
    if(this.field && (this.type === "text" ||this.type === "textarea")) 
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
  setRangeText(replacement,start,end,selectMode){
    if(this.field && (this.type === "text" ||this.type === "textarea")) 
      this.field.setRangeText(replacement,start,end,selectMode);
  }

  /**
   * selects a range of text
   * @param {string} replacement string to insert
   * @param {selectionStart} start 0-based index first character
   * @param {selectionEnd} end 0-based index after last character
   * @param {selectMode} selection direction: "forward", "backward", or default "none"
   * @memberof SimpleFieldsInput
   */
  setSelectionRange(selectionStart,selectionEnd,selectionDirection){
    if(this.field && (this.type === "text" ||this.type === "textarea")) 
      this.field.setSelectionRange(selectionStart,selectionEnd,selectionDirection);
  }

  /**
   * decrements by a multiple of step
   *
   * @param {number} [n=1]
   * @memberof SimpleFieldsInput
   */
  stepDown(n=1){
    if(this.field && this.numeric) this.field.stepDown();
  }

  /**
   * increments by a multiple of step
   *
   * @param {number} [n=1]
   * @memberof SimpleFieldsInput
   */
  stepUp(n=1){
    if(this.field && this.numeric) this.field.stepUp();
  }
  /**
   * handles change in select value
   *
   * @param {event} e change event
   * @memberof SimpleFieldsSelect
   */
  _onChange(e) {
    if (e && e.path && e.path[0]) this.value = e.path[0].value
  }
}
window.customElements.define(SimpleFieldsInput.tag, SimpleFieldsInput);
export { SimpleFieldsInput };
