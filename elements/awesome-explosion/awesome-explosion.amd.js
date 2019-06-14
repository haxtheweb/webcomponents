define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js"],function(_exports,_polymerElement,_renderStatus){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.AwesomeExplosion=void 0;function _templateObject_7f9d4cf081c011e98f205dbe9c726df6(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: inline-block;\n        }\n        :host([size=\"tiny\"]) #image {\n          width: 80px;\n          height: 80px;\n        }\n        :host([size=\"small\"]) #image {\n          width: 160px;\n          height: 160px;\n        }\n        :host([size=\"medium\"]) #image {\n          width: 240px;\n          height: 240px;\n        }\n        :host([size=\"large\"]) #image {\n          width: 320px;\n          height: 320px;\n        }\n        :host([size=\"epic\"]) #image {\n          width: 720px;\n          height: 720px;\n        }\n\n        :host([color=\"red\"]) #image {\n          filter: sepia() saturate(10000%) hue-rotate(30deg);\n        }\n        :host([color=\"purple\"]) #image {\n          filter: sepia() saturate(10000%) hue-rotate(290deg);\n        }\n        :host([color=\"blue\"]) #image {\n          filter: sepia() saturate(10000%) hue-rotate(210deg);\n        }\n        :host([color=\"orange\"]) #image {\n          filter: sepia() saturate(10000%) hue-rotate(320deg);\n        }\n        :host([color=\"yellow\"]) #image {\n          filter: sepia() saturate(10000%) hue-rotate(70deg);\n        }\n        #image {\n          width: 240px;\n          height: 240px;\n        }\n      </style>\n      <img src=\"[[image]]\" id=\"image\" class=\"image-tag\" alt=\"\" />\n    "]);_templateObject_7f9d4cf081c011e98f205dbe9c726df6=function _templateObject_7f9d4cf081c011e98f205dbe9c726df6(){return data};return data}/**
 * `awesome-explosion`
 * `An awesome, explosion.`
 *
 * @customElement
 * @polymer
 * @polymerLegacy
 * @silly
 * @demo demo/index.html
 */var AwesomeExplosion=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(AwesomeExplosion,_PolymerElement);function AwesomeExplosion(){babelHelpers.classCallCheck(this,AwesomeExplosion);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(AwesomeExplosion).apply(this,arguments))}babelHelpers.createClass(AwesomeExplosion,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(AwesomeExplosion.prototype),"connectedCallback",this).call(this);(0,_renderStatus.afterNextRender)(this,function(){this.addEventListener("click",this._setPlaySound.bind(this));this.addEventListener("mouseover",this._setPlaySound.bind(this));this.addEventListener("mouseout",this._setStopSound.bind(this))})}},{key:"disconnectedCallback",value:function disconnectedCallback(){this.removeEventListener("click",this._setPlaySound.bind(this));this.removeEventListener("mouseover",this._setPlaySound.bind(this));this.removeEventListener("mouseout",this._setStopSound.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(AwesomeExplosion.prototype),"disconnectedCallback",this).call(this)}},{key:"_calculateStopped",/**
   * calculate if it is stopped
   */value:function _calculateStopped(newValue,oldValue){if("stop"==newValue){this.stopped=!0;if(babelHelpers.typeof(window.audio)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){window.audio.currentTime=0}this._stopSound();this.dispatchEvent(new CustomEvent("awesome-event",{bubbles:!0,cancelable:!0,composed:!0,detail:{message:"Sound stopped"}}))}else{this.stopped=!1}}/**
   * calculate if it is stopped
   */},{key:"_calculatePlaying",value:function _calculatePlaying(newValue,oldValue){if("play"==newValue){this.playing=!0;this._playSound();this.dispatchEvent(new CustomEvent("awesome-event",{bubbles:!0,cancelable:!0,composed:!0,detail:{message:"Sound played"}}))}else{this.playing=!1}}/**
   * calculate if it is stopped
   */},{key:"_calculatePaused",value:function _calculatePaused(newValue,oldValue){if("pause"==newValue){this.paused=!0;this._stopSound();this.dispatchEvent(new CustomEvent("awesome-event",{bubbles:!0,cancelable:!0,composed:!0,detail:{message:"Sound paused"}}))}else{this.paused=!1}}/**
   * Stop the sound effect.
   */},{key:"_stopSound",value:function _stopSound(){if(babelHelpers.typeof(window.audio)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){window.audio.pause();if(this.resetSound){window.audio.currentTime=0}}}/**
   * Set the state to play from an event.
   */},{key:"_setPlaySound",value:function _setPlaySound(e){this.state="play"}/**
   * Set the state to play from an event.
   */},{key:"_setStopSound",value:function _setStopSound(e){this.state="pause"}/**
   * Play the sound effect.
   */},{key:"_playSound",value:function _playSound(){if(babelHelpers.typeof(window.audio)===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){window.audio=new Audio(this.sound)}window.audio.play()}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_7f9d4cf081c011e98f205dbe9c726df6())}},{key:"tag",get:function get(){return"awesome-explosion"}},{key:"properties",get:function get(){return{/**
       * State is for setting:
       * Possible values: play, pause, stop
       */state:{type:String,value:"stop",reflectToAttribute:!0},/**
       * Allow for stopping the sound effect.
       */stopped:{type:Boolean,computed:"_calculateStopped(state)"},/**
       * Allow for playing the sound effect.
       */playing:{type:Boolean,computed:"_calculatePlaying(state)"},/**
       * Allow for pausing the sound effect.
       */paused:{type:Boolean,computed:"_calculatePaused(state)"},/**
       * This allows you to swap out the image
       */image:{type:String,value:"assets/explode.gif",reflectToAttribute:!0},/**
       * This allows you to swap out the sound.
       */sound:{type:String,value:"assets/273320__clagnut__fireworks.mp3",reflectToAttribute:!0},/**
       * This is the size of the element. Possible values are:
       * tiny, small, medium, large, epic
       */size:{type:String,value:"medium",reflectToAttribute:!0},/**
       * This is to change the color of the element. Possible values are:
       * red, blue, orange, yellow
       */color:{type:String,value:"",reflectToAttribute:!0},/**
       * Allow for resetting the sound effect.
       */resetSound:{type:Boolean,value:!1,reflectToAttribute:!0}}}}]);return AwesomeExplosion}(_polymerElement.PolymerElement);_exports.AwesomeExplosion=AwesomeExplosion;window.customElements.define(AwesomeExplosion.tag,AwesomeExplosion)});