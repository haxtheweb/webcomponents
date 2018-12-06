/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";

/**
 * `simple-timer`
 * `Automated conversion of simple-timer/`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
let SimpleTimer = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    {{_formattedTime}}
  `,
  is: "simple-timer",
  properties: {
    /**
     * Start time for the timer in seconds
     */
    startTime: {
      type: Number,
      value: 60
    },
    /**
     * Current time of the timer, in seconds
     */
    currentTime: {
      type: Number,
      notify: true
    },
    /**
     * True if the timer is currently running
     */
    isRunning: {
      type: Boolean,
      reflectToAttribute: true,
      notify: true,
      value: false
    },
    /**
     * Set to true to have timer count up
     */
    countUp: {
      type: Boolean,
      value: false
    },
    /**
     * Time the timer has spent running since it was started
     */
    _elapsedTime: {
      type: Number,
      value: 0
    },
    _formattedTime: {
      type: String,
      value: "0"
    }
  },
  ready: function() {
    if (this.countUp) {
      this.set("currentTime", 0);
      this.set("_formattedTime", "0");
    } else {
      this.set("currentTime", this.startTime);
      this.set("_formattedTime", this.startTime.toString());
    }
  },
  start: function() {
    if (
      (this.currentTime <= 0 && !this.countUp) ||
      (this.currentTime >= this.startTime && this.countUp)
    ) {
      // timer is over
      this.currentTime = this.countUp ? this.startTime : 0;
    }
    if (!this.startTime || this.isRunning) {
      this.pause();
      return;
    }
    this._elapsed = performance.now() / 1000;
    this.isRunning = true;
    window.requestAnimationFrame(this._decreaseTimer.bind(this));
  },
  pause: function() {
    this.isRunning = false;
  },
  _decreaseTimer: function(timestamp) {
    if (!this.isRunning) {
      return;
    }
    if (
      (this.currentTime <= 0 && !this.countUp) ||
      (this.currentTime >= this.startTime && this.countUp)
    ) {
      // timer is over
      this.currentTime = this.countUp ? this.startTime : 0;
      this.pause();
      this.fire("simple-timer-end");
      return;
    }
    var now = timestamp / 1000;
    // Compute the relative progress based on the time spent running
    var progress = now - this._elapsed;
    this.currentTime = this.countUp
      ? this.currentTime + progress
      : this.currentTime - progress;
    this._formattedTime = this._formatTime(this.currentTime);
    this._elapsed = now;
    window.requestAnimationFrame(this._decreaseTimer.bind(this));
  },
  _formatTime: function(time) {
    var timeString = time.toString().split(".");
    return timeString[0].indexOf("-") === 0
      ? 0
      : timeString[0] + "." + timeString[1].substring(0, 2);
  }
});
export { SimpleTimer };
