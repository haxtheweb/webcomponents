import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
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
        color: #222222;
        text-transform: none;
        margin: 0;
        background-color: #ffffff;
        height: 80px !important;
        width: 200px !important;
        display: flex;
        border-radius: 10px;
        border: 4px solid #cccccc;
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
      <paper-button
        id="button"
        on-tap="_fireEvent"
        data-voicecommand\$="select [[title]]"
      >
        <div class="button-inner">
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
  is: "hax-stax-browser-item",
  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    focusin: "tapEventOn",
    focusout: "tapEventOff"
  },
  properties: {
    title: { type: String },
    staxReference: { type: Object },
    image: { type: String, value: !1 },
    author: { type: String },
    description: { type: String },
    examples: { type: Array },
    status: { type: Array },
    tag: { type: String },
    elevation: { type: Number, value: 1, reflectToAttribute: !0 }
  },
  tapEventOn: function(e) {
    this.elevation = 2;
  },
  tapEventOff: function(e) {
    this.elevation = 1;
  },
  _fireEvent: function(e) {
    for (var i = 0; i < this.stax.length; i++) {
      this.fire("hax-insert-content", this.stax[i]);
    }
    window.HaxStore.instance.haxStaxPicker.close();
  }
});
