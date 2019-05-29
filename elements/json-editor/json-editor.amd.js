define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/paper-input/paper-textarea.js"],function(_exports,_polymerElement,_paperTextarea){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.JsonEditor=void 0;function _templateObject_b408af1081c111e9915b49d3b7a32164(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n  \n}\n\n:host([hidden]) {\n  display: none;\n}\n:host([error]) paper-textarea {\n  --iron-autogrow-textarea: {\n    background-color: #ffeeee;\n  };\n}\npaper-textarea {\n  --iron-autogrow-textarea: {\n    font-family: \"Lucida Console\", Monaco, monospace;\n    font-weight: 600;\n    white-space: pre;\n    line-height: 20px;\n    padding: 9.5px;\n    margin: 0 0 10px;\n    font-size: 13px;\n    color: #000000;\n    word-break: break-all;\n    word-wrap: break-word;\n    background-color: #f5f5f5;\n    border: 1px solid #ccc;\n    border-radius: 4px;\n    transition: 0.3s linear all;\n    -webkit-transition: 0.3s linear all;\n    -moz-transition: 0.3s linear all;\n    -ms-transition: 0.3s linear all;\n    -o-transition: 0.3s linear all;\n};\n}</style>\n<paper-textarea \n  label=\"[[label]]\"\n  value=\"{{value}}\"\n  error-message=\"Invalid JSON!\"\n  readonly=\"[[disabled]]\"\n  invalid=\"[[error]]\"\n  max-rows=\"[[maxRows]]\"></paper-textarea>"]);_templateObject_b408af1081c111e9915b49d3b7a32164=function _templateObject_b408af1081c111e9915b49d3b7a32164(){return data};return data}/**
 * `json-editor`
 * `simple JSON blob data binding to a text area`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var JsonEditor=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(JsonEditor,_PolymerElement);function JsonEditor(){babelHelpers.classCallCheck(this,JsonEditor);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(JsonEditor).apply(this,arguments))}babelHelpers.createClass(JsonEditor,[{key:"_valueChanged",// Observer value for changes
value:function _valueChanged(newValue,oldValue){// try to evaluate this as json, otherwise return an error
try{var v=JSON.parse(newValue);if(v){this.error=!1}}catch(e){this.error=!0}}},{key:"_computeFormattedValue",value:function _computeFormattedValue(value){try{var formatted=JSON.stringify(JSON.parse(formatted),null,2);if(formatted!==value){this.value=formatted}}catch(e){}}/**
   * Computed value based on parsing the value in question
   */},{key:"_computeCurrentData",value:function _computeCurrentData(value){try{return JSON.parse(value)}catch(e){}}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_b408af1081c111e9915b49d3b7a32164())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * label for the text area
   */label:{name:"label",type:"String",value:"JSON data"},/**
   * State of being valid JSON object
   */error:{name:"error",type:"Boolean",value:!1,reflectToAttribute:!0},/**
   * toggling disabled state of the editor
   */disabled:{name:"disabled",type:"Boolean",value:!1,reflectToAttribute:!0},/**
   * max rows in the textarea
   */maxRows:{name:"maxRows",type:"Number",value:0,reflectToAttribute:!0},/**
   * String based value of the editor, use this to set initial value
   */value:{name:"value",type:"String",value:"",notify:!0,reflectToAttribute:!1,observer:"_valueChanged"},/**
   * format test to update value so it's pretty printed
   */formatTest:{name:"value",type:"String",computed:"_computeFormattedValue(value)"},/**
   * The current data object
   */currentData:{name:"currentData",type:"Object",notify:!0,computed:"_computeCurrentData(value)"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"json-editor"}}]);return JsonEditor}(_polymerElement.PolymerElement);_exports.JsonEditor=JsonEditor;window.customElements.define(JsonEditor.tag,JsonEditor)});