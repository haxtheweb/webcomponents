define(["exports","meta","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js"],function(_exports,meta,_polymerLegacy,_resolveUrl,_esGlobalBridge){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MomentElement=void 0;meta=babelHelpers.interopRequireWildcard(meta);function _templateObject_0a6c4ac06a8311e9a375fbafecef5751(){var data=babelHelpers.taggedTemplateLiteral(["\n    [[output]]\n  "]);_templateObject_0a6c4ac06a8311e9a375fbafecef5751=function _templateObject_0a6c4ac06a8311e9a375fbafecef5751(){return data};return data}/**
 * @license
 * Copyright (c) 2016 Abdón Rodríguez Davila (@abdonrd). All rights reserved.
 * This code may only be used under the MIT style license found at https://abdonrd.github.io/LICENSE.txt
 */ /**
Polymer element wrapper for the [moment](https://github.com/moment/moment) library.

Examples:

    <moment-element></moment-element>
    <moment-element datetime="1991-12-31" output-format="MMM DD[,] YYYY"></moment-element>

* @demo demo/index.html
*/var MomentElement=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_0a6c4ac06a8311e9a375fbafecef5751()),is:"moment-element",properties:{/**
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
     */libraryLoaded:{type:Boolean}},observers:["_computeOutput(datetime, inputFormat, outputFormat, from, to, libraryLoaded)"],created:function created(){var name="moment",basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/moment/moment.js");window.addEventListener("es-bridge-".concat(name,"-loaded"),this._momentLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load(name,location)},_momentLoaded:function _momentLoaded(){this.libraryLoaded=!0},/**
   * Recomputes the output
   */update:function update(){this._computeOutput(this.datetime,this.inputFormat,this.outputFormat,this.from,this.to,this.libraryLoaded)},_computeOutput:function _computeOutput(datetime,inputFormat,outputFormat,from,to,libraryLoaded){if(libraryLoaded){var output=inputFormat?moment(datetime,inputFormat):moment(datetime);if(outputFormat){output=output.format(outputFormat)}else if(from){output="now"===from?output.fromNow():output.from(moment(from))}else if(to){output="now"===to?output.toNow():output.to(moment(to))}this.set("output",output)}}});_exports.MomentElement=MomentElement});