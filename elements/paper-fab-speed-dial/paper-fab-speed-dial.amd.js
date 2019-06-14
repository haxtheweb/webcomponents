define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_require,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.PaperFabSpeedDial=void 0;_require=babelHelpers.interopRequireWildcard(_require);/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `paper-fab-speed-dial`
 * `A speed dial setup for a floating action button`
 *
 * @demo demo/index.html
 */var PaperFabSpeedDial=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(PaperFabSpeedDial,_PolymerElement);function PaperFabSpeedDial(){var _this;babelHelpers.classCallCheck(this,PaperFabSpeedDial);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(PaperFabSpeedDial).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/paper-fab-speed-dial/lib/paper-fab-speed-dial-overlay.js"],res,rej)});return _this}babelHelpers.createClass(PaperFabSpeedDial,[{key:"open",// Public methods
value:function open(e){// Required for mobile Safari to avoid passing the tap event to an element below the FAB
if(e){e.preventDefault()}this.opened=!0}},{key:"close",value:function close(e){// Required for mobile Safari to avoid passing the tap event to an element below the FAB
if(e){e.preventDefault()}this.opened=!1}}],[{key:"tag",get:function get(){return"paper-fab-speed-dial"}},{key:"properties",get:function get(){return{icon:{type:String,value:"add"},opened:{type:Boolean,notify:!0},disabled:{type:Boolean,value:!1}}}}]);return PaperFabSpeedDial}(_polymerElement.PolymerElement);_exports.PaperFabSpeedDial=PaperFabSpeedDial;window.customElements.define(PaperFabSpeedDial.tag,PaperFabSpeedDial)});