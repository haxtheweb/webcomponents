define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/rich-text-editor/rich-text-editor.js","./lib/hax-text-editor-toolbar.js"],function(_exports,_polymerElement,_richTextEditor,_haxTextEditorToolbar){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.HaxTextEditor=void 0;function _templateObject_490da7e0ab1711e9bbdf6fcad72d6e94(){var data=babelHelpers.taggedTemplateLiteral(["\n<style></style>\n",""]);_templateObject_490da7e0ab1711e9bbdf6fcad72d6e94=function _templateObject_490da7e0ab1711e9bbdf6fcad72d6e94(){return data};return data}/**
 * `hax-text-editor`
 * `rich-text-editor configured for HAX`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var HaxTextEditor=/*#__PURE__*/function(_RichTextEditor){babelHelpers.inherits(HaxTextEditor,_RichTextEditor);babelHelpers.createClass(HaxTextEditor,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_490da7e0ab1711e9bbdf6fcad72d6e94(),babelHelpers.get(babelHelpers.getPrototypeOf(HaxTextEditor),"template",this))}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}}]);function HaxTextEditor(){var _this;babelHelpers.classCallCheck(this,HaxTextEditor);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(HaxTextEditor).call(this));_this.type="hax-text-editor-toolbar";return _this}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */babelHelpers.createClass(HaxTextEditor,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(HaxTextEditor.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"tag",get:function get(){return"hax-text-editor"}}]);return HaxTextEditor}(_richTextEditor.RichTextEditor);_exports.HaxTextEditor=HaxTextEditor;window.customElements.define(HaxTextEditor.tag,HaxTextEditor)});