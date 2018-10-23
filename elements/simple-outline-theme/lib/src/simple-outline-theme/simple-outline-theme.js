import "@polymer/polymer/polymer.js";
/**
`simple-outline-theme`
A LRN polymer app

@demo ../../demo/index.html

@microcopy - the mental model for this app
 -
 -
 -

*/
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
    <paper-button raised="">Hello world!</paper-button>
`,

  is: "simple-outline-theme",

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
