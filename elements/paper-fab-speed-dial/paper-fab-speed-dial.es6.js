/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./lib/paper-fab-speed-dial-overlay.js";/**
 * `paper-fab-speed-dial`
 * `A speed dial setup for a floating action button`
 *
 * @demo demo/index.html
 */let PaperFabSpeedDial=Polymer({is:"paper-fab-speed-dial",properties:{icon:{type:String,value:"add"},opened:{type:Boolean,notify:!0},disabled:{type:Boolean,value:!1}},// Public methods
open:function(e){// Required for mobile Safari to avoid passing the tap event to an element below the FAB
if(e){e.preventDefault()}this.opened=!0},close:function(e){// Required for mobile Safari to avoid passing the tap event to an element below the FAB
if(e){e.preventDefault()}this.opened=!1}});export{PaperFabSpeedDial};