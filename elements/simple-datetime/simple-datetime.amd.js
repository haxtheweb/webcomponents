define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./lib/date.format.js"],function(_exports,_polymerLegacy,_dateFormat){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleDatetime=void 0;function _templateObject_48768e206a8311e9819ecb8f04bc622f(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        font-size: 14px;\n        color: #b3b3b1;\n        line-height: 30px;\n      }\n    </style>\n    <time datetime$=\"[[date]]\">[[date]]</time>\n  "]);_templateObject_48768e206a8311e9819ecb8f04bc622f=function _templateObject_48768e206a8311e9819ecb8f04bc622f(){return data};return data}/**
`simple-datetime`
A simple datetime element that takes in unix timestamp and outputs a date.

* @demo demo/index.html

@microcopy - the mental model for this element
 - passing in a timestamp from unix and having it be php based date formatting to render is super helpful
 -

*/var SimpleDatetime=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_48768e206a8311e9819ecb8f04bc622f()),is:"simple-datetime",properties:{/**
     * Javascript timestamp
     */timestamp:{type:Number},/**
     * Format to output, see https://github.com/jacwright/date.format#supported-identifiers
     */format:{type:String,value:"M jS, Y"},/**
     * Date, generated from timestamp + format
     */date:{type:String,computed:"formatDate(timestamp, format, unix)"},/**
     * Support for UNIX timestamp conversion on the fly
     */unix:{type:Boolean,value:!1}},/**
   * Figure out the date
   */formatDate:function formatDate(timestamp,format,unix){// unix timestamp is seconds, JS is milliseconds
if(unix){timestamp=1e3*timestamp}return new Date(timestamp).format(format)}});_exports.SimpleDatetime=SimpleDatetime});