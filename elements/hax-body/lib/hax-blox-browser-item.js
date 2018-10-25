import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
/**
`hax-blox-browser-item`
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
      .flip-icon {
        transform: rotateY(180deg);
      }
      iron-icon {
        width: 40px;
        height: 40px;
        display: inline-block;
      }
      @media screen and (max-width: 550px) {
        paper-button .item-title {
          font-size: 12px;
        }
      }
    </style>
    <paper-card id="card" elevation="[[elevation]]">
      <paper-button id="button" on-tap="_fireEvent" data-voicecommand\$="select [[title]]">
        <div class="button-inner">
          <iron-icon icon="[[icon]]"></iron-icon>
          <div class="item-title">[[title]]</div>
        </div>
      </paper-button>
    </paper-card>
`,

  is: "hax-blox-browser-item",

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
    bloxReference: {
      type: Object
    },
    /**
     * icon for the button, optional.
     */
    icon: {
      type: String
    },
    /**
     * Author related to this gizmo
     */
    author: {
      type: String
    },
    /**
     * Description for this.
     */
    description: {
      type: String
    },
    /**
     * Examples, optional.
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
     * Layout string to use
     */
    layout: {
      type: String
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
    let content = "";
    for (var i = 0; i < this.blox.length; i++) {
      let node = window.HaxStore.haxElementToNode(
        this.blox[i].tag,
        this.blox[i].content,
        this.blox[i].properties
      );
      content += window.HaxStore.haxNodeToContent(node);
    }
    // generate a hax element
    let blox = {
      tag: "grid-plate",
      properties: {
        layout: this.layout
      },
      content: content
    };
    this.fire("hax-insert-content", blox);
    window.HaxStore.instance.haxBloxPicker.close();
  }
});
