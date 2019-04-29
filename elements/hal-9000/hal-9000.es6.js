/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{ESGlobalBridge}from"./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js";import{pathFromUrl}from"./node_modules/@polymer/polymer/lib/utils/resolve-url.js";/**
 * `hal-9000`
 * `Robot assistant tag, hopefully not evil`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class Hal9000 extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
[hidden] {
  display: none;
}
</style>
<slot></slot>`}// properties available to the custom element for data binding
static get properties(){return{/**
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
   */static get tag(){return"hal-9000"}/**
   * Establish the element
   */constructor(){super();const name="annyang",basePath=pathFromUrl(decodeURIComponent(import.meta.url)),location=`${basePath}lib/annyang/annyang.min.js`;window.addEventListener(`es-bridge-${name}-loaded`,this._annyangLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load(name,location);// ensure singleton is set
window.Hal9000.instance=this;// check for speech synthesis API
if("undefined"!==typeof window.speechSynthesis){this.synth=window.speechSynthesis;this.voices=this.synth.getVoices();for(var i=0;i<this.voices.length;i++){if(this.voices[i].default){this.defaultVoice=this.voices[i].name}}}}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback()}/**
   * Callback for clicking on whatever was just said
   */clickObject(phrase){this.__text=phrase;this.commands[phrase].object.click();this.commands[phrase].object.focus()}/**
   * Notice new voice commands added
   */_commandsChanged(newValue){this.addCommands(newValue)}/**
   * Just rout add commands call to the right place
   */addCommands(commands){if(this.annyang){this.annyang.addCommands(commands)}}/**
   * And the word was good.
   */speak(text){this.__text=text;if(this.synth){this.utter=new SpeechSynthesisUtterance(this.__text);this.utter.pitch=this.pitch;this.utter.rate=this.rate;this.utter.lang=this.language;this.utter.voice=this.defaultVoice;// THOU SPEAKITH
this.synth.speak(this.utter)}else{console.warn("I have no voice...")}}/**
   * Annyang library has been loaded globally so we can use it
   */_annyangLoaded(){this.annyang=window.annyang;// Add our commands to annyang
if(this.annyang){this.annyang.addCommands(this.commands);this.annyang.debug(this.debug);// Start listening. You can call this here, or attach this call to an event, button, etc.
if(this.auto){this.annyang.start({autoRestart:!0,continuous:!0})}else if(this.enabled){this.annyang.start()}// alert alert we are ready
const evt=new CustomEvent("hal-9000-online",{bubbles:!0,cancelable:!1,detail:!0});this.dispatchEvent(evt)}}/**
   * Change the key name that is responded to
   */_respondsToChanged(newValue,oldValue){// remove all as our voice changed
if(this.annyang){this.annyang.removeCommands()}var commands={};for(var i in this.commands){if(i.replace(oldValue,newValue)!==i){commands[i.replace(oldValue,newValue)]=this.commands[i]}else{commands[i]=this.commands[i]}}this.set("commands",commands)}/**
   * Notice auto state changed so we start listening
   */_autoChanged(newValue){this.enabled=newValue}/**
   * React to enabled state changing
   */_enabledChanged(newValue){if(this.annyang){if(newValue){if(this.auto){this.annyang.start({autoRestart:!0,continuous:!0})}else{this.annyang.start()}}else{this.annyang.abort()}}}/**
   * debug mode changed
   */_debugChanged(newValue,oldValue){if(this.annyang){this.annyang.debug(newValue)}}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}// ensure we can generate a singleton
window.customElements.define(Hal9000.tag,Hal9000);export{Hal9000};window.Hal9000=window.Hal9000||{};window.Hal9000.requestAvailability=()=>{if(!window.Hal9000.instance){window.Hal9000.instance=new Hal9000}};