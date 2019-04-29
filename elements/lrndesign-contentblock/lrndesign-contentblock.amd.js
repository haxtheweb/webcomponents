define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js"],function(_exports,_polymerLegacy){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrndesignContentblock=void 0;function _templateObject_e567d2306a8211e99490036b8bc5aabc(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: inline-block;\n        position: relative;\n        box-sizing: border-box;\n      }\n    </style>\n    <h3>[[title]]</h3>\n    <slot></slot>\n  "]);_templateObject_e567d2306a8211e99490036b8bc5aabc=function _templateObject_e567d2306a8211e99490036b8bc5aabc(){return data};return data}/**
`lrndesign-contentblock`
An incredibly basic content block

* @demo demo/index.html
*/var LrndesignContentblock=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_e567d2306a8211e99490036b8bc5aabc()),is:"lrndesign-contentblock",properties:{/**
     * Heading for this block
     */title:{type:String}}});_exports.LrndesignContentblock=LrndesignContentblock});