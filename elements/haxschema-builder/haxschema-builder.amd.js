define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/json-editor/json-editor.js","./node_modules/@lrnwebcomponents/code-editor/code-editor.js","./node_modules/@vaadin/vaadin-split-layout/vaadin-split-layout.js","./node_modules/@polymer/paper-button/paper-button.js","./node_modules/@lrnwebcomponents/hax-body/lib/hax-schema-form.js"],function(_exports,_polymerElement,_HAXWiring,_jsonEditor,_codeEditor,_vaadinSplitLayout,_paperButton,_haxSchemaForm){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.HaxschemaBuilder=void 0;function _templateObject_8e113280ab1711e9b5d2516c1a79e442(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\ncode-editor {\n  height: 500px;\n}</style>\n<vaadin-split-layout>\n  <div>\n    <paper-button raised noink on-click=\"addConfigure\">Add to configure</paper-button>\n    <paper-button raised noink on-click=\"addAdvanced\">Add to advanced</paper-button>\n    <code-editor id=\"code\"  on-value-changed=\"_editorDataChanged\" language=\"json\"></code-editor>\n    <json-editor id=\"json\" label=\"JSON\" value=\"{{haxSchema}}\"></json-editor>\n  </div>\n  <div>\n    <hax-schema-form id=\"form\" configure-schema=\"[[configureSchema]]\" advanced-schema=\"[[advancedSchema]]\" value=\"{{value}}\"></hax-schema-form>\n  </div>\n</vaadin-split-layout>"]);_templateObject_8e113280ab1711e9b5d2516c1a79e442=function _templateObject_8e113280ab1711e9b5d2516c1a79e442(){return data};return data}/**
 * `haxschema-builder`
 * `dynamically build and visualize HAXschema`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var HaxschemaBuilder=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(HaxschemaBuilder,_PolymerElement);function HaxschemaBuilder(){babelHelpers.classCallCheck(this,HaxschemaBuilder);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(HaxschemaBuilder).apply(this,arguments))}babelHelpers.createClass(HaxschemaBuilder,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){var _this=this;babelHelpers.get(babelHelpers.getPrototypeOf(HaxschemaBuilder.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(HaxschemaBuilder.haxProperties,HaxschemaBuilder.tag,this);if(!this.source){this.haxSchema=JSON.stringify(this.HAXWiring.prototypeHaxProperties(),null,2)}// HACK to get initial paint to have the correct form
this.$.form.modeTab="advanced";setTimeout(function(){_this.$.form.modeTab="configure"},2e3)}/**
   * Force an update on code editor when this value changes
   */},{key:"_haxSchemaChanged",value:function _haxSchemaChanged(newValue){if(newValue){this.$.code.editorValue=newValue}}/**
   * Notice code editor changes and reflect them into this element
   */},{key:"_editorDataChanged",value:function _editorDataChanged(e){// value coming up off of this and get it propegated correctly
this.haxSchema=e.detail.value;var hs=JSON.parse(this.haxSchema);for(var key in hs.settings){var schema=this.HAXWiring.getHaxJSONSchema(key,hs);this.set(key+"Schema",schema)}}},{key:"addAdvanced",value:function addAdvanced(e){var hs=JSON.parse(this.haxSchema);hs.settings.advanced.push(this.__propPrototype());this.__refreshSchemas(hs)}},{key:"addConfigure",value:function addConfigure(e){var hs=JSON.parse(this.haxSchema);hs.settings.configure.push(this.__propPrototype());this.__refreshSchemas(hs)}},{key:"__refreshSchemas",value:function __refreshSchemas(hs){for(var key in hs.settings){var schema=this.HAXWiring.getHaxJSONSchema(key,hs);this.set(key+"Schema",schema)}this.haxSchema=JSON.stringify(hs)}},{key:"__propPrototype",value:function __propPrototype(){return{property:"title",title:"Title",description:"",inputMethod:"textfield",icon:"android",required:!0,validationType:"text"}}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_8e113280ab1711e9b5d2516c1a79e442())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!0,gizmo:{title:"Haxschema builder",description:"dynamically build and visualize HAXschema",icon:"icons:android",color:"green",groups:["Builder"],handles:[],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"source",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={/**
   * schema to extract for whatever you wanted it for
   */haxSchema:{name:"haxSchema",type:String,notify:!0,observer:"_haxSchemaChanged"},/**
   * configure form schema to extract for whatever you wanted it for
   */configureSchema:{name:"configureSchema",type:Object,value:{}},/**
   * advanced form schema to extract for whatever you wanted it for
   */advancedSchema:{name:"advancedSchema",type:Object,value:{}},/**
   * Optional remote source to pull in
   */source:{name:"source",type:String},/**
   * String based value passed between the elements to stitch together
   */value:{name:"value",type:String}};if(babelHelpers.get(babelHelpers.getPrototypeOf(HaxschemaBuilder),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(HaxschemaBuilder),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"haxschema-builder"}}]);return HaxschemaBuilder}(_polymerElement.PolymerElement);_exports.HaxschemaBuilder=HaxschemaBuilder;window.customElements.define(HaxschemaBuilder.tag,HaxschemaBuilder)});