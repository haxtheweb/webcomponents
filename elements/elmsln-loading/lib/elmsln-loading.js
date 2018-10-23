import "@polymer/polymer/polymer.js";
import "lrn-icons/lrn-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "materializecss-styles/colors.js";
/**
`elmsln-loading`
A spinner to tell the user that something is loading. This is just the spinner though
and doesn't provide any text or anything else to indicate that it's loading, just the
visual.

@demo demo/index.html
*/
Polymer({
  _template: `
    <style include="materializecss-styles-colors">
      :host {
        display: block;
      }
      iron-icon {
        -webkit-animation:spin 1.25s ease-out infinite;
        -moz-animation:spin 1.25s ease-out infinite;
        animation:spin 1.25s ease-out infinite;
      }
      .tiny {
        width: 1em;
        height: 1em;
        -webkit-animation:spin .75s ease-out infinite;
        -moz-animation:spin .75s ease-out infinite;
        animation:spin .75s ease-out infinite;
      }
      .small {
        width: 2em;
        height: 2em;
        -webkit-animation:spin 1s ease-out infinite;
        -moz-animation:spin 1s ease-out infinite;
        animation:spin 1s ease-out infinite;
      }
      .medium {
        width: 4em;
        height: 4em;
      }
      .large {
        width: 5em;
        height: 5em;
        -webkit-animation:spin 1.25s ease-out infinite;
        -moz-animation:spin 1.25s ease-out infinite;
        animation:spin 1.25s ease-out infinite;
      }
      .epic {
        width: 25em;
        height: 25em;
        -webkit-animation:spin 2s ease-out infinite;
        -moz-animation:spin 2s ease-out infinite;
        animation:spin 2s ease-out infinite;
      }
      @-moz-keyframes spin { 100% { -moz-transform: rotate(60deg); filter:saturate(10) invert(.9);} }
      @-webkit-keyframes spin { 100% { -webkit-transform: rotate(60deg); filter:saturate(10) invert(.9);} }
      @keyframes spin { 100% { -webkit-transform: rotate(60deg); transform:rotate(60deg);} }
    </style>
    <iron-icon icon="lrn:network" class\$="[[color]] [[size]]"></iron-icon>
`,

  is: "elmsln-loading",

  properties: {
    /**
     * materialize class names for color
     */
    color: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * tiny, small, medium, large, epic sizing.
     */
    size: {
      type: String,
      reflectToAttribute: true,
      value: "medium"
    }
  }
});
