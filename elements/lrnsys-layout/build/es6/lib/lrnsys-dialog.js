import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "../node_modules/@lrnwebcomponents/simple-modal/simple-modal.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/neon-animation/neon-animation.js";
import "../node_modules/@polymer/neon-animation/neon-animations.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "./lrnsys-dialog-modal.js";
import "./lrnsys-button-inner.js";
Polymer({
  _template: html`
    <custom-style>
    <style is="custom-style" include="simple-colors">
      :host {
        display: inline-block;
        --lrnsys-dialog-color: var(--simple-colors-foreground1,#000);
        --lrnsys-dialog-background-color: var(--simple-colors-background1);
        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background3);
        --lrnsys-dialog-secondary-background-color: rgba(255,255,255, 0.7);
      }
      :host([dark]) {
        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background1);
        --lrnsys-dialog-background-color: var(--simple-colors-background3);
        --lrnsys-dialog-secondary-background-color: rgba(0, 0, 0, 0.7);
      }
      #dialogtrigger {
        display:inline-block;
      }
    </style>
    </custom-style>
    <paper-button class$="[[class]]" id="dialogtrigger" on-tap="openDialog" raised="[[raised]]" disabled$="[[disabled]]" title="[[alt]]" aria-label$="[[alt]]">
      <lrnsys-button-inner avatar$="[[avatar]]" icon$="[[icon]]" text$="[[text]]">
        <slot name="button" slot="button"></slot>
      </lrnsys-button-inner>
    </paper-button>
    <paper-tooltip for="dialogtrigger" animation-delay="0" hidden$="[[!alt]]">[[alt]]</paper-tooltip>
`,
  is: "lrnsys-dialog",
  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff"
  },
  behaviors: [simpleColorsBehaviors],
  properties: {
    icon: { type: String },
    raised: { type: Boolean },
    avatar: { type: String },
    text: { type: String },
    alt: { type: String, reflectToAttribute: !0 },
    header: { type: String },
    disabled: { type: Boolean, value: !1 },
    hoverClass: { type: String },
    headingClass: { type: String, value: "white-text black" },
    dynamicImages: { type: Boolean, value: !1 },
    focusState: { type: Boolean, value: !1 }
  },
  tapEventOn: function(e) {
    const root = this;
    if (typeof root.hoverClass !== typeof void 0) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item, index) {
        if ("" != item) {
          root.$.dialogtrigger.classList.add(item);
        }
      });
    }
  },
  tapEventOff: function(e) {
    const root = this;
    if (typeof root.hoverClass !== typeof void 0) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item, index) {
        if ("" != item) {
          root.$.dialogtrigger.classList.remove(item);
        }
      });
    }
  },
  openDialog: function() {
    let nodes = dom(this).getEffectiveChildNodes(),
      h = document.createElement("span"),
      c = document.createElement("span"),
      node = {};
    for (var i in nodes) {
      if (typeof nodes[i].tagName !== typeof void 0) {
        switch (nodes[i].getAttribute("slot")) {
          case "toolbar-primary":
          case "toolbar-secondary":
          case "toolbar":
          case "header":
            node = nodes[i].cloneNode(!0);
            h.appendChild(node);
            break;
          case "button":
            break;
          default:
            node = nodes[i].cloneNode(!0);
            if (this.dynamicImages && "IRON-IMAGE" === node.tagName) {
              node.preventLoad = !1;
              node.removeAttribute("prevent-load");
            }
            c.appendChild(node);
            break;
        }
      }
    }
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: !0,
      cancelable: !0,
      detail: {
        title: this.header,
        elements: { header: h, content: c },
        invokedBy: this.$.dialogtrigger
      }
    });
    this.dispatchEvent(evt);
  },
  focusToggle: function(e) {
    const root = this;
    root.fire("focus-changed", { focus: root.focusState });
    if (typeof root.hoverClass !== typeof void 0) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item, index) {
        if ("" != item) {
          if (root.focusState) {
            root.$.dialogtrigger.classList.add(item);
          } else {
            root.$.dialogtrigger.classList.remove(item);
          }
        }
      });
    }
    root.focusState = !root.focusState;
  },
  ready: function() {
    this.__modal = window.simpleModal.requestAvailability();
  },
  attached: function() {
    this.$.dialogtrigger.addEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
  },
  detached: function() {
    this.$.dialogtrigger.removeEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
  }
});
