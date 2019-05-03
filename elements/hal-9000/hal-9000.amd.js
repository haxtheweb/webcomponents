define(["exports","meta","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js"],function(_exports,meta,_polymerElement,_esGlobalBridge,_resolveUrl){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.Hal9000=void 0;meta=babelHelpers.interopRequireWildcard(meta);function _templateObject_d9462f806d6911e9b6170febd231a1e5(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n[hidden] {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_d9462f806d6911e9b6170febd231a1e5=function _templateObject_d9462f806d6911e9b6170febd231a1e5(){return data};return data}/**
 * `hal-9000`
 * `Robot assistant tag, hopefully not evil`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var Hal9000=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(Hal9000,_PolymerElement);babelHelpers.createClass(Hal9000,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_d9462f806d6911e9b6170febd231a1e5())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * Commands to listen for and take action on
   */commands:{name:"commands",type:"Object",value:{},observer:"_commandsChanged"},/**
   * The name that HAL 9000 should respond to.
   */respondsTo:{name:"respondsTo",type:"String",value:"(hal)",observer:"_respondsToChanged"},/**
   * Debug mode for annyang
   */debug:{name:"debug",type:"Boolean",value:!1,observer:"_debugChanged"},/**
   * Start automatically
   */auto:{name:"auto",type:"Boolean",reflectToAttribute:!0,observer:"_autoChanged"},/**
   * Status of listening
   */enabled:{name:"enabled",type:"Boolean",reflectToAttribute:!0,observer:"_enabledChanged"},/**
   * Pitch of speech
   */pitch:{name:"pitch",type:"Number",reflectToAttribute:!0,value:.9},/**
   * Rate of speech
   */rate:{name:"rate",type:"Number",reflectToAttribute:!0,value:.9},/**
   * Language of the speaker
   */language:{name:"language",type:"String",reflectToAttribute:!0,value:"en-US"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"hal-9000"}/**
   * Establish the element
   */}]);function Hal9000(){var _this;babelHelpers.classCallCheck(this,Hal9000);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(Hal9000).call(this));var basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/annyang/annyang.min.js");window.addEventListener("es-bridge-annyang-loaded",_this._annyangLoaded.bind(babelHelpers.assertThisInitialized(_this)));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load("annyang",location);// check for speech synthesis API
if("undefined"!==typeof window.speechSynthesis){_this.synth=window.speechSynthesis;_this.voices=_this.synth.getVoices();for(var i=0;i<_this.voices.length;i++){if(_this.voices[i].default){_this.defaultVoice=_this.voices[i].name}}}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(Hal9000,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(Hal9000.prototype),"connectedCallback",this).call(this);// ensure singleton is set
window.Hal9000=window.Hal9000||{};window.Hal9000.instance=this}/**
   * Callback for clicking on whatever was just said
   */},{key:"clickObject",value:function clickObject(phrase){this.__text=phrase;this.commands[phrase].object.click();this.commands[phrase].object.focus()}/**
   * Notice new voice commands added
   */},{key:"_commandsChanged",value:function _commandsChanged(newValue){this.addCommands(newValue)}/**
   * Just rout add commands call to the right place
   */},{key:"addCommands",value:function addCommands(commands){if(this.annyang){this.annyang.addCommands(commands)}}/**
   * And the word was good.
   */},{key:"speak",value:function speak(text){this.__text=text;if(this.synth){this.utter=new SpeechSynthesisUtterance(this.__text);this.utter.pitch=this.pitch;this.utter.rate=this.rate;this.utter.lang=this.language;this.utter.voice=this.defaultVoice;// THOU SPEAKITH
this.synth.speak(this.utter)}else{console.warn("I have no voice...")}}/**
   * Annyang library has been loaded globally so we can use it
   */},{key:"_annyangLoaded",value:function _annyangLoaded(){this.annyang=window.annyang;// Add our commands to annyang
if(this.annyang){this.annyang.addCommands(this.commands);this.annyang.debug(this.debug);// Start listening. You can call this here, or attach this call to an event, button, etc.
if(this.auto){this.annyang.start({autoRestart:!0,continuous:!0})}else if(this.enabled){this.annyang.start()}// alert alert we are ready
var evt=new CustomEvent("hal-9000-online",{bubbles:!0,cancelable:!1,detail:!0});this.dispatchEvent(evt)}}/**
   * Change the key name that is responded to
   */},{key:"_respondsToChanged",value:function _respondsToChanged(newValue,oldValue){// remove all as our voice changed
if(this.annyang){this.annyang.removeCommands()}var commands={};for(var i in this.commands){if(i.replace(oldValue,newValue)!==i){commands[i.replace(oldValue,newValue)]=this.commands[i]}else{commands[i]=this.commands[i]}}this.set("commands",commands)}/**
   * Notice auto state changed so we start listening
   */},{key:"_autoChanged",value:function _autoChanged(newValue){this.enabled=newValue}/**
   * React to enabled state changing
   */},{key:"_enabledChanged",value:function _enabledChanged(newValue){if(this.annyang){if(newValue){if(this.auto){this.annyang.start({autoRestart:!0,continuous:!0})}else{this.annyang.start()}}else{this.annyang.abort()}}}/**
   * debug mode changed
   */},{key:"_debugChanged",value:function _debugChanged(newValue,oldValue){if(this.annyang){this.annyang.debug(newValue)}}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("es-bridge-annyang-loaded",this._annyangLoaded.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(Hal9000.prototype),"disconnectedCallback",this).call(this)}}]);return Hal9000}(_polymerElement.PolymerElement);// ensure we can generate a singleton
_exports.Hal9000=Hal9000;window.customElements.define(Hal9000.tag,Hal9000);window.Hal9000=window.Hal9000||{};window.Hal9000.requestAvailability=function(){if(!window.Hal9000.instance){window.Hal9000.instance=new Hal9000}}});