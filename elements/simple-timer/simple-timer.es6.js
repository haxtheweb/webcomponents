/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";/**
 * `simple-timer`
 * `Automated conversion of simple-timer/`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class SimpleTimer extends PolymerElement{static get template(){return html`
      <style>
        :host {
          display: block;
        }
      </style>
      [[_formattedTime]]
    `}static get tag(){return"simple-timer"}static get properties(){return{/**
       * Start time for the timer in seconds
       */startTime:{type:Number,value:60},/**
       * Current time of the timer, in seconds
       */currentTime:{type:Number,notify:!0},/**
       * True if the timer is currently running
       */isRunning:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1},/**
       * Set to true to have timer count up
       */countUp:{type:Boolean,value:!1},/**
       * Time the timer has spent running since it was started
       */_elapsedTime:{type:Number,value:0},_formattedTime:{type:String,value:"0"}}}ready(){super.ready();if(this.countUp){this.set("currentTime",0);this.set("_formattedTime","0")}else{this.set("currentTime",this.startTime);this.set("_formattedTime",this.startTime.toString())}}start(){if(0>=this.currentTime&&!this.countUp||this.currentTime>=this.startTime&&this.countUp){// timer is over
this.currentTime=this.countUp?this.startTime:0}if(!this.startTime||this.isRunning){this.pause();return}this._elapsed=performance.now()/1e3;this.isRunning=!0;window.requestAnimationFrame(this._decreaseTimer.bind(this))}pause(){this.isRunning=!1}_decreaseTimer(timestamp){if(!this.isRunning){return}if(0>=this.currentTime&&!this.countUp||this.currentTime>=this.startTime&&this.countUp){// timer is over
this.currentTime=this.countUp?this.startTime:0;this.pause();this.dispatchEvent(new CustomEvent("simple-timer-end",{bubbles:!0,cancelable:!0,composed:!0,detail:!0}));return}var now=timestamp/1e3,progress=now-this._elapsed;// Compute the relative progress based on the time spent running
this.currentTime=this.countUp?this.currentTime+progress:this.currentTime-progress;this._formattedTime=this._formatTime(this.currentTime);this._elapsed=now;window.requestAnimationFrame(this._decreaseTimer.bind(this))}_formatTime(time){var timeString=time.toString().split(".");return 0===timeString[0].indexOf("-")?0:timeString[0]+"."+timeString[1].substring(0,2)}}window.customElements.define(SimpleTimer.tag,SimpleTimer);export{SimpleTimer};