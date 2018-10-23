import "@polymer/polymer/polymer.js";
import "govcon-banner/govcon-banner.js";
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
      paper-button {
        padding: 0;
        margin: 0;
        min-width: 1rem;
      }
    </style>
    <govcon-banner></govcon-banner>
`,

  is: "govcon-app",

  properties: {},

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
