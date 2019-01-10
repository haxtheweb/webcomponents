import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/paper-input/paper-textarea.js";class JsonEditor extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
  
}

:host([hidden]) {
  display: none;
}
:host([error]) paper-textarea {
  --iron-autogrow-textarea: {
    background-color: #ffeeee;
  };
}
paper-textarea {
  --iron-autogrow-textarea: {
    font-family: "Lucida Console", Monaco, monospace;
    font-weight: 600;
    white-space: pre;
    line-height: 20px;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    color: #000000;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: 0.3s linear all;
    -webkit-transition: 0.3s linear all;
    -moz-transition: 0.3s linear all;
    -ms-transition: 0.3s linear all;
    -o-transition: 0.3s linear all;
};
}</style>
<paper-textarea 
  label="[[label]]"
  value="{{value}}"
  error-message="Invalid JSON!"
  readonly="[[disabled]]"
  invalid="[[error]]"
  max-rows="[[maxRows]]"></paper-textarea>`}static get properties(){return{label:{name:"label",type:"String",value:"JSON data"},error:{name:"error",type:"Boolean",value:!1,reflectToAttribute:!0},disabled:{name:"disabled",type:"Boolean",value:!1,reflectToAttribute:!0},maxRows:{name:"maxRows",type:"Number",value:0,reflectToAttribute:!0},value:{name:"value",type:"String",value:"",reflectToAttribute:!1,observer:"_valueChanged"},formatTest:{name:"value",type:"String",computed:"_computeFormattedValue(value)"},currentData:{name:"currentData",type:"Object",notify:!0,computed:"_computeCurrentData(value)"}}}static get tag(){return"json-editor"}connectedCallback(){super.connectedCallback()}_valueChanged(newValue,oldValue){try{let v=JSON.parse(newValue);if(v){this.error=!1}}catch(e){this.error=!0}}_computeFormattedValue(value){try{let formatted=JSON.stringify(JSON.parse(formatted),null,2);if(formatted!==value){this.value=formatted}}catch(e){}}_computeCurrentData(value){try{return JSON.parse(value)}catch(e){}}}window.customElements.define(JsonEditor.tag,JsonEditor);export{JsonEditor};