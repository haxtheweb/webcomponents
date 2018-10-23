import "@polymer/polymer/polymer.js";
import "paper-avatar/paper-avatar.js";
import "materializecss-styles/materializecss-styles.js";
/**
`lrndesign-avatar`
Visualize a user account eitehr with an image, a label, or as abstract art.

@demo demo/index.html
*/
Polymer({
  _template: `
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
      }
    </style>
    <paper-avatar label="[[label]]" src="[[src]]" two-chars="[[twoChars]]" class\$="[[color]]" jdenticon="[[jdenticon]]"></paper-avatar>
`,

  is: "lrndesign-avatar",

  properties: {
    /**
     * text to use for avatar
     */
    label: {
      type: String,
      value: "lrndesign-avatar"
    },
    /**
     * link to an image, optional
     */
    src: {
      type: String
    },
    /**
     * Mode for presenting 1st two letters
     */
    twoChars: {
      type: Boolean,
      value: false
    },
    /**
     * Materialize CSS color class names
     */
    color: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Form abstract art from hash of label
     */
    jdenticon: {
      type: Boolean,
      value: false
    }
  }
});
