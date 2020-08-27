define(["exports","./node_modules/lit-element/lit-element.js","./lib/rich-text-editor-styles.js","./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js","./lib/toolbars/rich-text-editor-toolbar.js","./lib/toolbars/rich-text-editor-toolbar-mini.js","./lib/toolbars/rich-text-editor-toolbar-full.js"],function(_exports,_litElement,_richTextEditorStyles,_ironA11yKeys,_richTextEditorToolbar,_richTextEditorToolbarMini,_richTextEditorToolbarFull){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.RichTextEditor=void 0;function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable});keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1,source;i<arguments.length;i++){source=null!=arguments[i]?arguments[i]:{};if(i%2){ownKeys(Object(source),!0).forEach(function(key){babelHelpers.defineProperty(target,key,source[key])})}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source))}else{ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})}}return target}function _templateObject2_7ecfea10e80f11ea9e89bd2c3d9518a2(){var data=babelHelpers.taggedTemplateLiteral(["\n:host([hidden]) {\n  display: none;\n}\n\n:host {\n  display: block;\n  min-height: 20px;\n  cursor: pointer;\n}\n\n:host([contenteditable=\"true\"]) {\n  border: var(--rich-text-editor-border);\n  overflow: auto;\n}\n\n:host([contenteditable=\"true\"]):focus-within,\n:host([contenteditable=\"true\"]):focus {\n  padding: 2px;\n  margin-bottom: 2px;\n}\n\n:host(.heightmax[contenteditable=\"true\"]) {\n  max-height: calc(100vh - 200px);\n  overflow-y: scroll;\n}\n\n:host(:empty) {\n  border: 1px dashed var(--rich-text-editor-border-color);\n}\n\n:host(:not([contenteditable=\"true\"]):empty):before {\n  content: attr(placeholder);\n  padding: 0 5px;\n  display: block;\n  color: var(--rich-text-editor-button-disabled-color);\n}\n      "]);_templateObject2_7ecfea10e80f11ea9e89bd2c3d9518a2=function _templateObject2_7ecfea10e80f11ea9e89bd2c3d9518a2(){return data};return data}function _templateObject_7ecfea10e80f11ea9e89bd2c3d9518a2(){var data=babelHelpers.taggedTemplateLiteral(["\n\n<slot></slot>"]);_templateObject_7ecfea10e80f11ea9e89bd2c3d9518a2=function _templateObject_7ecfea10e80f11ea9e89bd2c3d9518a2(){return data};return data}function _createSuper(Derived){return function(){var Super=babelHelpers.getPrototypeOf(Derived),result;if(_isNativeReflectConstruct()){var NewTarget=babelHelpers.getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else{result=Super.apply(this,arguments)}return babelHelpers.possibleConstructorReturn(this,result)}}function _isNativeReflectConstruct(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{Date.prototype.toString.call(Reflect.construct(Date,[],function(){}));return!0}catch(e){return!1}}/**
 * `rich-text-editor`
 * @element rich-text-editor
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 */var RichTextEditor=/*#__PURE__*/function(_RichTextEditorStyles){babelHelpers.inherits(RichTextEditor,_RichTextEditorStyles);var _super=_createSuper(RichTextEditor);babelHelpers.createClass(RichTextEditor,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_7ecfea10e80f11ea9e89bd2c3d9518a2())}// haxProperty definition
}],[{key:"styles",//styles function
get:function get(){return[].concat(babelHelpers.toConsumableArray(babelHelpers.get(babelHelpers.getPrototypeOf(RichTextEditor),"styles",this)),[(0,_litElement.css)(_templateObject2_7ecfea10e80f11ea9e89bd2c3d9518a2())])}},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Rich text-editor",description:"a standalone rich text editor",icon:"icons:android",color:"green",groups:["Text"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"Penn State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return _objectSpread({},babelHelpers.get(babelHelpers.getPrototypeOf(RichTextEditor),"properties",this),{/**
   * The editor's unique id
   */id:{name:"id",type:String,reflect:!0,attribute:"id"},/**
   * Placeholder text for empty editable regions
   */placeholder:{name:"placeholder",type:String,reflect:!0,attribute:"placeholder"},/**
   * The id for the toolbar
   */toolbar:{name:"toolbar",type:String,reflect:!0,attribute:"toolbar"},/**
   * The type of editor toolbar, i.e.
   * full - full for full toolbar with breadcrumb,
   * mini - mini for mini floating toolbar, or
   * the default toolbar if neither.
   */type:{name:"type",type:String,reflect:!0,attribute:"type"}})}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"rich-text-editor"}}]);function RichTextEditor(){var _this;babelHelpers.classCallCheck(this,RichTextEditor);_this=_super.call(this);_this.placeholder="Click to edit";_this.toolbar="";_this.type="rich-text-editor-toolbar";_this.id="";return _this}/**
   * life cycle, element is afixed to the DOM
   * @returns {void}
   */babelHelpers.createClass(RichTextEditor,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(RichTextEditor.prototype),"connectedCallback",this).call(this);if(!this.id)this.id=this._generateUUID();this.getEditor();window.RichTextEditorStyleManager.requestAvailability()}/**
   * connects the mini-toolbar to a mini editor
   * @returns {void}
   */},{key:"getEditor",value:function getEditor(){var id=this.toolbar?"#"+this.toolbar:"",both=document.querySelector(this.type+id),idOnly=id?document.querySelector(id):null,typeOnly=document.querySelector(this.type),//try to match both id and type, if no match try id only, and then type only
toolbar=both||idOnly||typeOnly;//if still no match, create a region of type
if(!this.toolbar)this.toolbar=this._generateUUID();if(!toolbar||!toolbar.addEditableRegion){toolbar=document.createElement(this.type);toolbar.id=this.toolbar;this.parentNode.appendChild(toolbar)}toolbar.addEditableRegion(this)}/**
   * Normalizes selected range data.
   *
   * @returns {object} the selected range
   */},{key:"_getRange",value:function _getRange(){var sel=window.getSelection();if(sel.getRangeAt&&sel.rangeCount){return sel.getRangeAt(0)}else if(sel){return sel}else!1}/**
   * Generate a UUID
   * @returns {string} a unique id
   */},{key:"_generateUUID",value:function _generateUUID(){var hex=Math.floor(65536*(1+Math.random())).toString(16).substring(1);return"rte-"+"ss-s-s-s-sss".replace(/s/g,hex)}}]);return RichTextEditor}((0,_richTextEditorStyles.RichTextEditorStyles)(_litElement.LitElement));_exports.RichTextEditor=RichTextEditor;window.customElements.define(RichTextEditor.tag,RichTextEditor)});