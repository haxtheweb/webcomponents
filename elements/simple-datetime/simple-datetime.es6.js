import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./lib/date.format.js";/**
 * `simple-datetime`
 * A simple datetime element that takes in unix timestamp and outputs a date.
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - passing in a timestamp from unix and having it be php based date formatting to render is super helpful
 */class SimpleDatetime extends PolymerElement{static get template(){return html`
      <style>
        :host {
          display: block;
          font-size: 14px;
          color: #b3b3b1;
          line-height: 30px;
        }
      </style>
      <time datetime$="[[date]]">[[date]]</time>
    `}static get tag(){return"simple-datetime"}static get properties(){return{/**
       * Javascript timestamp
       */timestamp:{type:Number},/**
       * Format to output, see https://github.com/jacwright/date.format#supported-identifiers
       */format:{type:String,value:"M jS, Y"},/**
       * Date, generated from timestamp + format
       */date:{type:String,computed:"formatDate(timestamp, format, unix)"},/**
       * Support for UNIX timestamp conversion on the fly
       */unix:{type:Boolean,value:!1}}}/**
   * Figure out the date
   */formatDate(timestamp,format,unix){// unix timestamp is seconds, JS is milliseconds
if(unix){timestamp=1e3*timestamp}return new Date(timestamp).format(format)}}window.customElements.define(SimpleDatetime.tag,SimpleDatetime);export{SimpleDatetime};