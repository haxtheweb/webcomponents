import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icons/editor-icons.js";
import "../node_modules/@polymer/iron-icons/device-icons.js";
import "../node_modules/@polymer/iron-icons/hardware-icons.js";
import "../node_modules/@polymer/iron-icons/communication-icons.js";
import "../node_modules/@polymer/iron-icons/social-icons.js";
import "../node_modules/@polymer/iron-icons/av-icons.js";
import "../node_modules/@polymer/iron-icons/places-icons.js";
import "../node_modules/@polymer/iron-icons/maps-icons.js";
import "../node_modules/@polymer/iron-image/iron-image.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: inline-flex;
      }
      :host([elevation="1"]) {
        -webkit-transform: scale(1, 1);
        transform: scale(1, 1);
      }
      :host([elevation="2"]) {
        -webkit-transform: scale(1.4, 1.4);
        transform: scale(1.4, 1.4);
      }
      paper-card {
        margin: 4px 0;
        border-radius: 10px;
      }
      paper-button {
        color: #000000;
        text-transform: none;
        margin: 0;
        background-color: #ffffff;
        height: 72px !important;
        width: 72px !important;
        display: flex;
        border-radius: 10px;
        border-style: solid;
        border-width: 4px;
        font-weight: normal;
      }
      paper-button .item-title {
        font-size: 10px;
      }
      paper-button .button-inner {
        text-align: center;
      }
      paper-button iron-icon {
        height: 32px;
        width: 32px;
        display: inline-block;
      }
      .flip-icon {
        transform: rotateY(180deg);
      }
    </style>
    <paper-card id="card" elevation="[[elevation]]">
      <paper-button
        id="button"
        data-voicecommand\$="select [[title]]"
        class\$="[[color]] lighten-5 [[color]]-border"
      >
        <div class="button-inner">
          <iron-icon
            icon="[[icon]]"
            class\$="[[color]]-text text-darken-3"
            hidden\$="[[!icon]]"
          ></iron-icon>
          <iron-image
            src="[[image]]"
            preload=""
            sizing="cover"
            hidden\$="[[!image]]"
          ></iron-image>
          <div class="item-title">[[title]]</div>
        </div>
      </paper-button>
    </paper-card>
  `,
  is: "hax-app-browser-item",
  listeners: {
    tap: "_fireEvent",
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    focusin: "tapEventOn",
    focusout: "tapEventOff"
  },
  properties: {
    title: { type: String },
    index: { type: Number },
    icon: { type: String },
    image: { type: String, value: !1 },
    color: { type: String },
    author: { type: String },
    description: { type: String },
    examples: { type: Array },
    status: { type: Array },
    elevation: { type: Number, value: 1, reflectToAttribute: !0 }
  },
  tapEventOn: function(e) {
    this.elevation = 2;
  },
  tapEventOff: function(e) {
    this.elevation = 1;
  },
  _fireEvent: function(e) {
    this.fire("hax-app-selected", this.index);
  }
});
