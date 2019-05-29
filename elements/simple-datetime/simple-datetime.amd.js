define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./lib/date.format.js"],function(_exports,_polymerElement,_dateFormat){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleDatetime=void 0;function _templateObject_2f83aa6081c111e98b962b3b0530c7de(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n          font-size: 14px;\n          color: #b3b3b1;\n          line-height: 30px;\n        }\n      </style>\n      <time datetime$=\"[[date]]\">[[date]]</time>\n    "]);_templateObject_2f83aa6081c111e98b962b3b0530c7de=function _templateObject_2f83aa6081c111e98b962b3b0530c7de(){return data};return data}/**
 * `simple-datetime`
 * A simple datetime element that takes in unix timestamp and outputs a date.
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - passing in a timestamp from unix and having it be php based date formatting to render is super helpful
 */var SimpleDatetime=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleDatetime,_PolymerElement);function SimpleDatetime(){babelHelpers.classCallCheck(this,SimpleDatetime);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleDatetime).apply(this,arguments))}babelHelpers.createClass(SimpleDatetime,[{key:"formatDate",/**
   * Figure out the date
   */value:function formatDate(timestamp,format,unix){// unix timestamp is seconds, JS is milliseconds
if(unix){timestamp=1e3*timestamp}return new Date(timestamp).format(format)}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_2f83aa6081c111e98b962b3b0530c7de())}},{key:"tag",get:function get(){return"simple-datetime"}},{key:"properties",get:function get(){return{/**
       * Javascript timestamp
       */timestamp:{type:Number},/**
       * Format to output, see https://github.com/jacwright/date.format#supported-identifiers
       */format:{type:String,value:"M jS, Y"},/**
       * Date, generated from timestamp + format
       */date:{type:String,computed:"formatDate(timestamp, format, unix)"},/**
       * Support for UNIX timestamp conversion on the fly
       */unix:{type:Boolean,value:!1}}}}]);return SimpleDatetime}(_polymerElement.PolymerElement);_exports.SimpleDatetime=SimpleDatetime;window.customElements.define(SimpleDatetime.tag,SimpleDatetime)});