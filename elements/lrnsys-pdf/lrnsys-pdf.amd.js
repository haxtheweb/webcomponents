define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"],function(_exports,_require,_polymerElement,_schemaBehaviors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnsysPdf=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_284ad800ab1411e9865209cab773c586(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n        }\n      </style>\n      <h2>[[title]]</h2>\n      <pdf-browser-viewer\n        id=\"pdfViewer\"\n        file=\"[[file]]#page=[[page]]\"\n        width=\"100%\"\n        card=\"[[card]]\"\n        elevation=\"2\"\n        download-label=\"[[downloadLabel]]\"\n      ></pdf-browser-viewer>\n    "]);_templateObject_284ad800ab1411e9865209cab773c586=function _templateObject_284ad800ab1411e9865209cab773c586(){return data};return data}/**
 * `lrnsys-pdf`
 * @demo demo/index.html
 */var LrnsysPdf=/*#__PURE__*/function(_SchemaBehaviors){babelHelpers.inherits(LrnsysPdf,_SchemaBehaviors);function LrnsysPdf(){var _this;babelHelpers.classCallCheck(this,LrnsysPdf);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LrnsysPdf).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/pdf-browser-viewer/pdf-browser-viewer.js"],res,rej)});return _this}babelHelpers.createClass(LrnsysPdf,[{key:"_computeDownloadLabel",/**
   * See if we should supply a label.
   */value:function _computeDownloadLabel(download){if(download){return"Download"}else{return null}}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_284ad800ab1411e9865209cab773c586())}},{key:"tag",get:function get(){return"lrnsys-pdf"}},{key:"properties",get:function get(){var props={/**
       * Title prior to the PDF
       */title:{type:String,value:"lrnsys-pdf"},/**
       * Whether or not to present this as a card.
       */card:{type:Boolean,value:!1},/**
       * Download Label.
       */downloadLabel:{type:String,computed:"_computeDownloadLabel(download)"},/**
       * Active Page
       */page:{type:String},/**
       * File to present
       */file:{type:String}};if(babelHelpers.get(babelHelpers.getPrototypeOf(LrnsysPdf),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(LrnsysPdf),"properties",this))}return props}}]);return LrnsysPdf}((0,_schemaBehaviors.SchemaBehaviors)(_polymerElement.PolymerElement));_exports.LrnsysPdf=LrnsysPdf;window.customElements.define(LrnsysPdf.tag,LrnsysPdf)});