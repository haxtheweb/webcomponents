define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleTimer=void 0;function _templateObject_6cf1aed06d6a11e98890b5f4c91fc0cc(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    [[_formattedTime]]"]);_templateObject_6cf1aed06d6a11e98890b5f4c91fc0cc=function _templateObject_6cf1aed06d6a11e98890b5f4c91fc0cc(){return data};return data}/**
 * `simple-timer`
 * `Automated conversion of simple-timer/`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleTimer=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleTimer,_PolymerElement);function SimpleTimer(){babelHelpers.classCallCheck(this,SimpleTimer);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleTimer).apply(this,arguments))}babelHelpers.createClass(SimpleTimer,[{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleTimer.prototype),"ready",this).call(this);if(this.countUp){this.set("currentTime",0);this.set("_formattedTime","0")}else{this.set("currentTime",this.startTime);this.set("_formattedTime",this.startTime.toString())}}},{key:"start",value:function start(){if(0>=this.currentTime&&!this.countUp||this.currentTime>=this.startTime&&this.countUp){// timer is over
this.currentTime=this.countUp?this.startTime:0}if(!this.startTime||this.isRunning){this.pause();return}this._elapsed=performance.now()/1e3;this.isRunning=!0;window.requestAnimationFrame(this._decreaseTimer.bind(this))}},{key:"pause",value:function pause(){this.isRunning=!1}},{key:"_decreaseTimer",value:function _decreaseTimer(timestamp){if(!this.isRunning){return}if(0>=this.currentTime&&!this.countUp||this.currentTime>=this.startTime&&this.countUp){// timer is over
this.currentTime=this.countUp?this.startTime:0;this.pause();this.dispatchEvent(new CustomEvent("simple-timer-end",{bubbles:!0,cancelable:!0,composed:!0,detail:!0}));return}var now=timestamp/1e3,progress=now-this._elapsed;// Compute the relative progress based on the time spent running
this.currentTime=this.countUp?this.currentTime+progress:this.currentTime-progress;this._formattedTime=this._formatTime(this.currentTime);this._elapsed=now;window.requestAnimationFrame(this._decreaseTimer.bind(this))}},{key:"_formatTime",value:function _formatTime(time){var timeString=time.toString().split(".");return 0===timeString[0].indexOf("-")?0:timeString[0]+"."+timeString[1].substring(0,2)}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_6cf1aed06d6a11e98890b5f4c91fc0cc())}},{key:"tag",get:function get(){return"simple-timer"}},{key:"properties",get:function get(){return{/**
       * Start time for the timer in seconds
       */startTime:{type:Number,value:60},/**
       * Current time of the timer, in seconds
       */currentTime:{type:Number,notify:!0},/**
       * True if the timer is currently running
       */isRunning:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1},/**
       * Set to true to have timer count up
       */countUp:{type:Boolean,value:!1},/**
       * Time the timer has spent running since it was started
       */_elapsedTime:{type:Number,value:0},_formattedTime:{type:String,value:"0"}}}}]);return SimpleTimer}(_polymerElement.PolymerElement);_exports.SimpleTimer=SimpleTimer;window.customElements.define(SimpleTimer.tag,SimpleTimer)});