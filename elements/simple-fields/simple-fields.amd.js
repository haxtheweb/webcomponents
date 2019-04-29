define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@polymer/polymer/lib/mixins/mutable-data.js","./node_modules/@polymer/paper-toggle-button/paper-toggle-button.js","./node_modules/@polymer/paper-button/paper-button.js","./node_modules/@polymer/paper-input/paper-textarea.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js","./node_modules/@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js","./node_modules/@lrnwebcomponents/code-editor/code-editor.js","./node_modules/app-datepicker/app-datepicker.js","./node_modules/@lrnwebcomponents/simple-picker/simple-picker.js","./node_modules/@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js","./node_modules/@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js","./node_modules/@lrnwebcomponents/paper-input-flagged/paper-input-flagged.js","./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"],function(_exports,_polymerElement,_HAXWiring,_mutableData,_paperToggleButton,_paperButton,_paperTextarea,_ironIcons,_ecoJsonSchemaForm,_ecoJsonSchemaObject,_codeEditor,_appDatepicker,_simplePicker,_simpleIconPicker,_simpleColorsPicker,_paperInputFlagged,_simpleColors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleFields=void 0;function _templateObject_5c25bdd06a8611e99b8f214e81ff19d8(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n  background-color: #ffffff;\n  overflow: hidden;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\neco-json-schema-object {\n  width: 50%;\n}\neco-json-schema-object {\n  color: var(--hax-text-color);\n  --eco-json-schema-object-form : {\n    -ms-flex: unset;\n    -webkit-flex: unset;\n    flex: unset;\n    -webkit-flex-basis: unset;\n    flex-basis: unset;\n  }\n}\neco-json-schema-object .hax-code-editor {\n  padding: 0;\n}</style>\n<eco-json-schema-object\n  id=\"schemaobject\"\n  schema=\"[[__validatedSchema]]\"\n  value=\"{{value}}\"\n></eco-json-schema-object>"]);_templateObject_5c25bdd06a8611e99b8f214e81ff19d8=function _templateObject_5c25bdd06a8611e99b8f214e81ff19d8(){return data};return data}/**
 * `simple-fields`
 * `Uses eco-json-form and HAX wiring to display a series of fields`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleFields=/*#__PURE__*/function(_MutableData){babelHelpers.inherits(SimpleFields,_MutableData);function SimpleFields(){babelHelpers.classCallCheck(this,SimpleFields);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleFields).apply(this,arguments))}babelHelpers.createClass(SimpleFields,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleFields.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(SimpleFields.haxProperties,SimpleFields.tag,this)}/**
   * fires when either the eco-json-schema-object or the simple-fields object changes the value
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */},{key:"_valueChanged",value:function _valueChanged(oldValue,newValue){//prevent a feddback loop when the eco-json-schema-object's values change to reflect the changes to simple-fields
if(JSON.stringify(oldValue)!==JSON.stringify(newValue)){this._setValues()}}/**
   * fires when the fields array changes
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */},{key:"_fieldsChanged",value:function _fieldsChanged(oldValue,newValue){//prevent a potential feedback loop
if(JSON.stringify(oldValue)!==JSON.stringify(newValue)){this._setValues()}}/**
   * when either the fields or the value changes, updates the schema and form to match
   */},{key:"_setValues",value:function _setValues(){var wiring=window.HAXWiring,schema=wiring._getHaxJSONSchemaProperty(this.fields,wiring);for(var prop in this.value){if(schema[prop])schema[prop].value=this.value[prop]}//form won't refresh unless we set it to null. notifyPath wasn't enough to refresh it
this.__validatedSchema=null;this.__validatedSchema={properties:schema}}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_5c25bdd06a8611e99b8f214e81ff19d8())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Simple fields",description:"Uses eco-json-form and HAX wiring to display a series of fields",icon:"icons:android",color:"green",groups:["Fields"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"fields",description:"",inputMethod:"array",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * Fields to conver toJSON Schema.
   */fields:{type:"Array",value:[],observer:"_fieldsChanged"},/**
   * Returned value from the form input.
   */value:{type:"Object",notify:!0,value:{},reflectToAttribute:!0,observer:"_valueChanged"},/**
   * Fields to conver to JSON Schema.
   */__validatedSchema:{type:"Array",value:{properties:{}}}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-fields"}}]);return SimpleFields}((0,_mutableData.MutableData)(_polymerElement.PolymerElement));_exports.SimpleFields=SimpleFields;window.customElements.define(SimpleFields.tag,SimpleFields)});