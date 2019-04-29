define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js"],function(_exports,_polymerLegacy){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleTimer=void 0;function _templateObject_5ab2ad306a8311e98b2341f027fa3ef5(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    {{_formattedTime}}\n  "]);_templateObject_5ab2ad306a8311e98b2341f027fa3ef5=function _templateObject_5ab2ad306a8311e98b2341f027fa3ef5(){return data};return data}/**
 * `simple-timer`
 * `Automated conversion of simple-timer/`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleTimer=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_5ab2ad306a8311e98b2341f027fa3ef5()),is:"simple-timer",properties:{/**
     * Start time for the timer in seconds
     */startTime:{type:Number,value:60},/**
     * Current time of the timer, in seconds
     */currentTime:{type:Number,notify:!0},/**
     * True if the timer is currently running
     */isRunning:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1},/**
     * Set to true to have timer count up
     */countUp:{type:Boolean,value:!1},/**
     * Time the timer has spent running since it was started
     */_elapsedTime:{type:Number,value:0},_formattedTime:{type:String,value:"0"}},ready:function ready(){if(this.countUp){this.set("currentTime",0);this.set("_formattedTime","0")}else{this.set("currentTime",this.startTime);this.set("_formattedTime",this.startTime.toString())}},start:function start(){if(0>=this.currentTime&&!this.countUp||this.currentTime>=this.startTime&&this.countUp){// timer is over
this.currentTime=this.countUp?this.startTime:0}if(!this.startTime||this.isRunning){this.pause();return}this._elapsed=performance.now()/1e3;this.isRunning=!0;window.requestAnimationFrame(this._decreaseTimer.bind(this))},pause:function pause(){this.isRunning=!1},_decreaseTimer:function _decreaseTimer(timestamp){if(!this.isRunning){return}if(0>=this.currentTime&&!this.countUp||this.currentTime>=this.startTime&&this.countUp){// timer is over
this.currentTime=this.countUp?this.startTime:0;this.pause();this.fire("simple-timer-end");return}var now=timestamp/1e3,progress=now-this._elapsed;// Compute the relative progress based on the time spent running
this.currentTime=this.countUp?this.currentTime+progress:this.currentTime-progress;this._formattedTime=this._formatTime(this.currentTime);this._elapsed=now;window.requestAnimationFrame(this._decreaseTimer.bind(this))},_formatTime:function _formatTime(time){var timeString=time.toString().split(".");return 0===timeString[0].indexOf("-")?0:timeString[0]+"."+timeString[1].substring(0,2)}});_exports.SimpleTimer=SimpleTimer});