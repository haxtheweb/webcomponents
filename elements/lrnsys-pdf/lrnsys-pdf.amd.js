define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@lrnwebcomponents/pdf-browser-viewer/pdf-browser-viewer.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"],function(_exports,_polymerLegacy,_pdfBrowserViewer,_schemaBehaviors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnsysPdf=void 0;function _templateObject_69524f206a8411e9bd340b492afc0145(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n    <pdf-browser-viewer\n      id=\"pdfViewer\"\n      file=\"[[file]]#page=[[page]]\"\n      width=\"100%\"\n      card=\"[[card]]\"\n      elevation=\"2\"\n      download-label=\"[[downloadLabel]]\"\n    ></pdf-browser-viewer>\n  "]);_templateObject_69524f206a8411e9bd340b492afc0145=function _templateObject_69524f206a8411e9bd340b492afc0145(){return data};return data}/**
`lrnsys-pdf`
A LRN element

* @demo demo/index.html
*/var LrnsysPdf=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_69524f206a8411e9bd340b492afc0145()),is:"lrnsys-pdf",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{/**
     * Title prior to the PDF
     */title:{type:String,value:"lrnsys-pdf"},/**
     * Whether or not to present this as a card.
     */card:{type:Boolean,value:!1},/**
     * Download Label.
     */downloadLabel:{type:String,computed:"_computeDownloadLabel(download)"},/**
     * Active Page
     */page:{type:String},/**
     * File to present
     */file:{type:String}},/**
   * See if we should supply a label.
   */_computeDownloadLabel:function _computeDownloadLabel(download){if(download){return"Download"}else{return null}}});_exports.LrnsysPdf=LrnsysPdf});