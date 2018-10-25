import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-image/iron-image.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
/**
`hax-stax-browser-item`
A button on the hax-gizmo-browser app display

@demo demo/index.html

@microcopy - the mental model for this element
 - 
*/
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: inline-flex;
      }
      :host[elevation="1"] {
        -webkit-transform: scale(1, 1);
        transform: scale(1, 1);
      }
      :host[elevation="2"] {
        -webkit-transform: scale(1.4, 1.4);
        transform: scale(1.4, 1.4);
      }
      paper-card {
        margin: 4px 0;
        border-radius: 10px;
      }
      paper-button {
        color: #222222;
        text-transform: none;
        margin:0;
        background-color: #FFFFFF;
        height: 80px !important;
        width: 200px !important;
        display: flex;
        border-radius: 10px;
        border: 4px solid #CCCCCC;
        min-width: unset;
      }
      paper-button .item-title {
        font-size: 14px;
        display: inline-flex;
      }
      paper-button .button-inner {
        text-align: center;
      }
      .flip-icon {
        transform: rotateY(180deg);
      }
      @media screen and (max-width: 550px) {
        paper-button .item-title {
          font-size: 10px;
        }
      }
    </style>
    <paper-card id="card" elevation="[[elevation]]">
      <paper-button id="button" on-tap="_fireEvent" data-voicecommand\$="select [[title]]">
        <div class="button-inner">
          <iron-image src="[[image]]" preload="" sizing="cover" hidden\$="[[!image]]"></iron-image>
          <div class="item-title">[[title]]</div>
        </div>
      </paper-button>
    </paper-card>
    <paper-tooltip for="button" position="bottom" offset="14">
      [[teaser]]
    </paper-tooltip>
`,

  is: "hax-stax-browser-item",

  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    "button.focusin": "tapEventOn",
    "button.focusout": "tapEventOff"
  },

  properties: {
    /**
     * Title
     */
    title: {
      type: String
    },
    /**
     * Index position in the original list of imports
     */
    staxReference: {
      type: Object
    },
    /**
     * Image for the button, optional.
     */
    image: {
      type: String,
      value: false
    },
    /**
     * Author related to this gizmo
     */
    author: {
      type: String
    },
    /**
     * Teaser / headline.
     */
    teaser: {
      type: String
    },
    /**
     * Description for this.
     */
    description: {
      type: String
    },
    /**
     * Examples, a list of image links, optional.
     */
    examples: {
      type: Array
    },
    /**
     * Status, whether disabled, enabled, or other future states.
     */
    status: {
      type: Array
    },
    /**
     * Tag
     */
    tag: {
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
  },

  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent: function(e) {
    for (var i = 0; i < this.stax.length; i++) {
      this.fire("hax-insert-content", this.stax[i]);
    }
    window.HaxStore.instance.haxStaxPicker.close();
  }
});
