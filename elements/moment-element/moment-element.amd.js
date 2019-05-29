define(["exports","meta","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js"],function(_exports,meta,_polymerElement,_resolveUrl,_esGlobalBridge){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MomentElement=void 0;meta=babelHelpers.interopRequireWildcard(meta);function _templateObject_0d125fd081c111e98be11b9ae8bb63e2(){var data=babelHelpers.taggedTemplateLiteral(["\n      [[output]]\n    "]);_templateObject_0d125fd081c111e98be11b9ae8bb63e2=function _templateObject_0d125fd081c111e98be11b9ae8bb63e2(){return data};return data}/**
 * @license
 * Copyright (c) 2016 Abdón Rodríguez Davila (@abdonrd). All rights reserved.
 * This code may only be used under the MIT style license found at https://abdonrd.github.io/LICENSE.txt
 */ /**
Polymer element wrapper for the [moment](https://github.com/moment/moment) library.

Examples:

    <moment-element></moment-element>
    <moment-element datetime="1991-12-31" output-format="MMM DD[,] YYYY"></moment-element>

* @demo demo/index.html
*/var MomentElement=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(MomentElement,_PolymerElement);babelHelpers.createClass(MomentElement,null,[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_0d125fd081c111e98be11b9ae8bb63e2())}},{key:"tag",get:function get(){return"moment-element"}},{key:"properties",get:function get(){return{/**
       * The input datetime. If don't set the datetime, the datetime will be now.
       * For consistent results, parsing anything other than ISO 8601 strings
       * with the `inputFormat` property. More information in [moment String](http://momentjs.com/docs/#/parsing/string/).
       */datetime:{type:String,value:function value(){return new Date}},/**
       * The datetime input format. An string using the
       * [moment String + Format](http://momentjs.com/docs/#/parsing/string-format/).
       */inputFormat:{type:String,value:""},/**
       * The datetime output format. Options are 'now' or datetime using the
       * [moment Format](http://momentjs.com/docs/#/displaying/format/).
       */outputFormat:{type:String,value:""},/**
       * Relative time using [momen time from now](http://momentjs.com/docs/#/displaying/fromnow/)
       * or [momen Time from datetime](http://momentjs.com/docs/#/displaying/from/).
       */from:{type:String,value:""},/**
       * Relative time using [momen Time to now](http://momentjs.com/docs/#/displaying/tonow/)
       * or [momen Time to datetime](http://momentjs.com/docs/#/displaying/to/).
       */to:{type:String,value:""},/**
       * The output datetime.
       */output:{type:String,notify:!0},/**
       * library loaded
       */libraryLoaded:{type:Boolean}}}},{key:"observers",get:function get(){return["_computeOutput(datetime, inputFormat, outputFormat, from, to, libraryLoaded)"]}}]);function MomentElement(){var _this;babelHelpers.classCallCheck(this,MomentElement);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(MomentElement).call(this));var basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/moment/moment.js");window.addEventListener("es-bridge-moment-loaded",_this._momentLoaded.bind(babelHelpers.assertThisInitialized(_this)));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load("moment",location);return _this}babelHelpers.createClass(MomentElement,[{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("es-bridge-moment-loaded",this._momentLoaded.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(MomentElement.prototype),"disconnectedCallback",this).call(this)}},{key:"_momentLoaded",value:function _momentLoaded(){this.libraryLoaded=!0}/**
   * Recomputes the output
   */},{key:"update",value:function update(){this._computeOutput(this.datetime,this.inputFormat,this.outputFormat,this.from,this.to,this.libraryLoaded)}},{key:"_computeOutput",value:function _computeOutput(datetime,inputFormat,outputFormat,from,to,libraryLoaded){if(libraryLoaded){var output=inputFormat?moment(datetime,inputFormat):moment(datetime);if(outputFormat){output=output.format(outputFormat)}else if(from){output="now"===from?output.fromNow():output.from(moment(from))}else if(to){output="now"===to?output.toNow():output.to(moment(to))}this.set("output",output)}}}]);return MomentElement}(_polymerElement.PolymerElement);_exports.MomentElement=MomentElement;window.customElements.define(MomentElement.tag,MomentElement)});