import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./lib/date.format.js";
/**
`simple-datetime`
A simple datetime element that takes in unix timestamp and outputs a date.

@demo demo/index.html

@microcopy - the mental model for this element
 - passing in a timestamp from unix and having it be php based date formatting to render is super helpful
 -

*/
let SimpleDatetime = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        font-size: 14px;
        color: #b3b3b1;
        line-height: 30px;
      }
    </style>
    <time datetime$="[[date]]">[[date]]</time>
`,

  is: "simple-datetime",

  properties: {
    /**
     * Javascript timestamp
     */
    timestamp: {
      type: Number
    },
    /**
     * Format to output, see https://github.com/jacwright/date.format#supported-identifiers
     */
    format: {
      type: String,
      value: "M jS, Y"
    },
    /**
     * Date, generated from timestamp + format
     */
    date: {
      type: String,
      computed: "formatDate(timestamp, format, unix)"
    },
    /**
     * Support for UNIX timestamp conversion on the fly
     */
    unix: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Figure out the date
   */
  formatDate: function(timestamp, format, unix) {
    // unix timestamp is seconds, JS is milliseconds
    if (unix) {
      timestamp = timestamp * 1000;
    }
    return new Date(timestamp).format(format);
  }
});
export { SimpleDatetime };
