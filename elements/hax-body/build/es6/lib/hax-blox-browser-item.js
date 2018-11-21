import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
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
    focusin: "tapEventOn",
    focusout: "tapEventOff"
  },
  properties: {
    title: { type: String },
    bloxReference: { type: Object },
    icon: { type: String },
    author: { type: String },
    description: { type: String },
    examples: { type: Array },
    status: { type: Array },
    layout: { type: String },
    tag: { type: String },
    elevation: { type: Number, value: 1, reflectToAttribute: !0 }
  },
  tapEventOn: function() {
    this.elevation = 2;
  },
  tapEventOff: function() {
    this.elevation = 1;
  },
  _fireEvent: function() {
    let content = "";
    for (var i = 0; i < this.blox.length; i++) {
      let node = window.HaxStore.haxElementToNode(
        this.blox[i].tag,
        this.blox[i].content,
        this.blox[i].properties
      );
      content += window.HaxStore.haxNodeToContent(node);
    }
    let blox = {
      tag: "grid-plate",
      properties: { layout: this.layout },
      content: content
    };
    this.fire("hax-insert-content", blox);
    window.HaxStore.instance.haxBloxPicker.close();
  }
});
