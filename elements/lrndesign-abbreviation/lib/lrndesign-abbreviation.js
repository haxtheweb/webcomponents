import "@polymer/polymer/polymer.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
`lrndesign-abbreviation`
A wrapper to make a cleaner abbreviation deign element

@demo demo/index.html
*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
    </style>
    <abbr title="{{phrase}}" id="abbr">{{abbr}}</abbr>
    <paper-tooltip for="abbr">{{phrase}}</paper-tooltip>
`,

  is: "lrndesign-abbreviation",

  properties: {
    /**
     * Abbreviation text.
     */
    abbr: {
      type: String,
      reflectToAttribute: true,
      notify: true
    },
    /**
     * The thing the abbreviation represents.
     */
    phrase: {
      type: String,
      reflectToAttribute: true,
      notify: true
    }
  }
});
