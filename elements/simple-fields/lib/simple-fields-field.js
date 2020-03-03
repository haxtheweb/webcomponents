import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *`simple-fields-field` 
 * provides label, description, error massage, and aria-invalid functionality if needed
 * 
 * @group simple-fields
 * @demo demo/index.html
 * @customElement simple-fields-field
 */
class SimpleFieldsField extends LitElement {
  static get tag() {
    return "simple-fields-field";
  }
  static get styles() {
    return [
      css`
        div {
          margin: 0;
        }
        :host([invalid]) label,
        :host([invalid]) .error-message {
          color: #990000;
        }
        :host([invalid]) label:after{
          content: "*";
        }
        :host(:not([invalid])) .error-message {
          display: none;
        }
      `
    ];
  }
  render() {
    return html`
      ${this.labelSibling}
      <slot class="${this.describedBy}"></slot>
      ${this.errorSibling}
      ${this.descriptionSibling}
    `;
  }
  static get properties() {
    return {
      data: {
        type: Object
      },
      description: {
        type: String
      },
      errorMessage: {
        type: String
      },
      field: {
        type: Object
      },
      fieldId: {
        type: String
      },
      invalid: {
        type: Boolean,
        reflect: true
      },
      label: {
        type: String
      }
    };
  }
  constructor(){
    super();
    this.data = {};
    this.invalid = false;
    this.fieldId = '';
  }

  updated(changedProperties) {
    changedProperties.fieldIdEach((oldValue, propName) => {
      if (propName === "invalid") {
        if(this.data.invalidProperty) this.field[this.data.invalidProperty] = this.invalid;
      } else {
        this.field.setAttribute('aria-invalid',this.invalid);
      }
    });
  }

  get describedBy(){
    let describedBy = [];
    //if(this.label && this.fieldId && this.data.labelSlot) describedBy.push(this.labelId);
    if(this.description && this.fieldId && this.data.descriptionSlot) describedBy.push(this.descriptionId);
    if(this.error && this.fieldId && this.data.errorSlot) describedBy.push(this.errorId);
    this.field.setAttribute('aria-describedBy',describedBy.join(' '));
    return describedBy.join(' ');
  }
  get descriptionId(){
    return `${this.fieldId}-error`;
  }
  get descriptionSibling(){
    console.log('descriptionSibling',this.description,this.data.descriptionProperty,this.data.descriptionSlot);
    let type = this._getSibling(
      this.description,
      this.data.descriptionProperty,
      this.data.descriptionSlot
    );
    if(type === 'slot') this._getDescriptionSlot(this.data.descriptionSlot);
    return type === 'prop' ? this._getDescriptionSlot() : ``;
  }
  get errorId(){
    return `${this.fieldId}-error`;
  }
  get errorSibling(){
    console.log('errorSibling',this.errorMessage,this.data.errorProperty,this.data.errorSlot);
    let type = this._getSibling(
      this.errorMessage || false,
      this.data.errorProperty || false,
      this.data.errorSlot || false
    );
    if(type === 'slot') this._getErrorSlot(this.data.errorSlot);
    return type === 'prop' ? this._getErrorSlot() : ``;
  }
  get labelId(){
    return `${this.fieldId}-label`;
  }
  get labelSibling(){
    console.log('labelSibling',this.label,this.data.labelProperty,this.data.labelSlot);
    let type = this._getSibling(
      this.label,
      this.data.labelProperty,
      this.data.labelSlot
    );
    if(type === 'slot') this._getLabelSlot(this.data.labelSlot);
    return type === 'prop' ? this._getLabelSlot() : ``;
  }
  _getDescriptionSlot(slot = ""){
    console.log('_getDescriptionSlot',this,this.description );
    return this.description ? html`
      <div 
        id="${this.descriptionId}"
        slot="${slot}" 
        class="description">
        ${this.description}
      </div>
    `: ``;
  }
  _getErrorSlot(slot = ""){
    console.log('_getErrorSlot',this,this.errorMessage );
    return this.errorMessage ? html`
      <div 
        id="${this.errorId}" 
        slot="${slot}" 
        class="error-message">
        ${this.errorMessage}
      </div>
    `: ``;
  }
  _getLabelSlot(slot = ""){
    console.log('_getLabelSlot',this,this.label);
    return this.label ? html`
      <label 
        id="${this.labelId}" 
        for="${this.fieldId}" 
        slot="${slot}">
        ${this.label}
      </label>
    `: ``;
  }
  _getSibling(value,prop,slot,callback = () => {}){
    console.log('_getSibling',this,this.field,this.data,value,prop,slot, typeof callback);
    if(prop){
      console.log('prop',prop,this.field);
      this.field[prop] = value;
      return 'prop';
    } else if(slot){
      console.log('slot',slot,this.field);
      if(this.field.querySelector(`[slot="${slot}"]`)) this.field.querySelector(`[slot="${slot}"]`).remove();
      return 'slot';
      //this.field.appendChild(callback(slot));
      return ``;
    } else {
      console.log('callback',this.field,this.data,callback);
      return '';
      return callback();
    }

  }
}
window.customElements.define(SimpleFieldsField.tag, SimpleFieldsField);
export { SimpleFieldsField };
