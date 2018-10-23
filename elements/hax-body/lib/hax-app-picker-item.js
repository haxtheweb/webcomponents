import "@polymer/polymer/polymer.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "materializecss-styles/materializecss-styles.js";
import "simple-colors/simple-colors.js";
/**
 `hax-app-picker-item`
 An item for displaying in a picker

@demo demo/index.html
*/
Polymer({
  _template: `
    <style is="custom-style" include="materializecss-styles">
      :host {
        display: inline-flex;
        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);
      }
      :host[elevation="1"] {
        -webkit-transform: scale(1, 1);
        transform: scale(1, 1);
      }
      :host[elevation="2"] {
        -webkit-transform: scale(1.4, 1.4);
        transform: scale(1.4, 1.4);
      }
      :host > div {
        @apply --paper-font-caption;
        margin-top: 8px;
        color: #FFFFFF;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        @apply --hax-app-picker-hax-element-text;
      }
      .icon {
        cursor: pointer;
        width: 50px;
        height: 50px;
        padding: 8px;
        color: white;
        border-radius: 50%;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        -webkit-transition: box-shadow .2s;
        -moz-transition: box-shadow .2s;
        -ms-transition: box-shadow .2s;
        -o-transition: box-shadow .2s;
        transition: box-shadow .2s;
        @apply --hax-app-picker-hax-element--icon;
      }
      .icon:hover, .icon:focus {
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
      }
      .icon:active {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }
      @media screen and (max-width: 550px) {
        .icon {
          width: 32px;
          height: 32px;
          padding: 4px;
        }
      }
    </style>
    <paper-icon-button id="button" class\$="icon [[color]]" icon="[[icon]]" title="[[label]]"></paper-icon-button>
    <div aria-hidden="true">[[label]]</div>
`,

  is: "hax-app-picker-item",

  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    "button.focusin": "tapEventOn",
    "button.focusout": "tapEventOff"
  },

  behaviors: [simpleColorsBehaviors],

  properties: {
    /**
     * Color
     */
    color: {
      type: String
    },
    /**
     * Icon
     */
    icon: {
      type: String
    },
    /**
     * Label
     */
    label: {
      type: String
    },
    /**
     * Elevation off the UI
     */
    elevation: {
      type: Number,
      value: 1,
      reflectToAttribute: true
    }
  },

  /**
   * special handling for taps on the thing
   */
  tapEventOn: function(e) {
    this.elevation = 2;
  },

  /**
   * Hover off stop showing the deeper shadow.
   */
  tapEventOff: function(e) {
    this.elevation = 1;
  }
});
