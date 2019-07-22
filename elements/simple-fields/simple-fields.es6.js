/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{MutableData}from"./node_modules/@polymer/polymer/lib/mixins/mutable-data.js";import"./node_modules/@polymer/paper-toggle-button/paper-toggle-button.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/paper-input/paper-textarea.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";import"./node_modules/@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";import"./node_modules/@lrnwebcomponents/code-editor/code-editor.js";import"./node_modules/@lrnwebcomponents/simple-picker/simple-picker.js";import"./node_modules/@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js";import"./node_modules/@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js";import"./node_modules/@lrnwebcomponents/paper-input-flagged/paper-input-flagged.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";/**
 * `simple-fields`
 * `Uses eco-json-form and HAX wiring to display a series of fields`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class SimpleFields extends MutableData(PolymerElement){// render function
static get template(){return html`
<style>:host {
  display: block;
  background-color: #ffffff;
  overflow: hidden;
}

:host([hidden]) {
  display: none;
}

eco-json-schema-object {
  width: 50%;
}
eco-json-schema-object {
  color: var(--hax-text-color);
  --eco-json-form-color: var(--hax-text-color);
  --eco-json-schema-object-form : {
    -ms-flex: unset;
    -webkit-flex: unset;
    flex: unset;
    -webkit-flex-basis: unset;
    flex-basis: unset;
  }
}
eco-json-schema-object .hax-code-editor {
  padding: 0;
}</style>
<eco-json-schema-object
  id="schemaobject"
  autofocus$="[[autofocus]]"
  hide-line-numbers$="[[hideLineNumbers]]"
  on-form-changed="_formChanged"
  schema="[[__validatedSchema]]"
  value="{{value}}"
></eco-json-schema-object>`}// haxProperty definition
static get haxProperties(){return}// properties available to the custom element for data binding
static get properties(){let props={/**
   * automatically set focus on the first field if that field has autofocus
   */autofocus:{type:Boolean,value:!1},/**
   * hide code-editor line numbers
   */hideLineNumbers:{type:Boolean,value:!1},/**
   * Fields to conver toJSON Schema.
   */fields:{type:Array,value:[],observer:"_fieldsChanged"},/**
   * Returned value from the form input.
   */value:{type:Object,notify:!0,value:{},observer:"_valueChanged"},/**
   * Fields to conver to JSON Schema.
   */__validatedSchema:{type:Array,value:{properties:{}}}};if(super.properties){props=Object.assign(props,super.properties)}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"simple-fields"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(SimpleFields.haxProperties,SimpleFields.tag,this)}/**
   * when form changes, sets focus on the first field if this has auto-focus
   */_formChanged(e){this.dispatchEvent(new CustomEvent("fields-changed",{bubbles:!0,cancelable:!0,composed:!0,detail:e.detail}))}/**
   * fires when either the eco-json-schema-object or the simple-fields object changes the value
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */_valueChanged(oldValue,newValue){//prevent a feddback loop when the eco-json-schema-object's values change to reflect the changes to simple-fields
if(JSON.stringify(oldValue)!==JSON.stringify(newValue)){this._setValues()}}/**
   * fires when the fields array changes
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */_fieldsChanged(oldValue,newValue){//prevent a potential feedback loop
if(JSON.stringify(oldValue)!==JSON.stringify(newValue)){this._setValues()}}/**
   * when either the fields or the value changes, updates the schema and form to match
   */_setValues(){let wiring=window.HAXWiring,schema=wiring._getHaxJSONSchemaProperty(this.fields,wiring);for(let prop in this.value){if(schema[prop])schema[prop].value=this.value[prop]}//form won't refresh unless we set it to null. notifyPath wasn't enough to refresh it
this.__validatedSchema=null;this.__validatedSchema={properties:schema}}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}window.customElements.define(SimpleFields.tag,SimpleFields);export{SimpleFields};