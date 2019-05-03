define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./lib/paper-fab-speed-dial-overlay.js"],function(_exports,_polymerLegacy,_paperFabSpeedDialOverlay){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.PaperFabSpeedDial=void 0;/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `paper-fab-speed-dial`
 * `A speed dial setup for a floating action button`
 *
 * @demo demo/index.html
 */var PaperFabSpeedDial=(0,_polymerLegacy.Polymer)({is:"paper-fab-speed-dial",properties:{icon:{type:String,value:"add"},opened:{type:Boolean,notify:!0},disabled:{type:Boolean,value:!1}},// Public methods
open:function open(e){// Required for mobile Safari to avoid passing the tap event to an element below the FAB
if(e){e.preventDefault()}this.opened=!0},close:function close(e){// Required for mobile Safari to avoid passing the tap event to an element below the FAB
if(e){e.preventDefault()}this.opened=!1}});_exports.PaperFabSpeedDial=PaperFabSpeedDial});