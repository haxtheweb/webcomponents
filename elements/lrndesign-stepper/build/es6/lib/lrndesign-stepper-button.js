import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icons/av-icons.js";
import "../node_modules/@polymer/iron-icons/social-icons.js";
import "../node_modules/@polymer/iron-collapse/iron-collapse.js";
Polymer({
  _template: html`
    <style>
       :host {
        display: block;
        --lrndesign-icon-button-color: #abacae;
        --lrndesign-stepper-btn-title-color: #000;
        --lrndesign-stepper-btn-active: #F6F7F7;
        --lrndesign-border-color: #abacae;
      }

      .top-line,
      .bottom-line {
        background-color: transparent;
      }

      :host([location="start"]) .bottom-line {
        background-color: var(--lrndesign-icon-button-color);
      }

      :host([location="middle"]) .top-line,
      :host([location="middle"]) .bottom-line {
        background-color: var(--lrndesign-icon-button-color);
      }

      :host([location="end"]) .top-line {
        background-color: var(--lrndesign-icon-button-color);
      }

      .top-line {
        width: 2px;
        height: 24px;
        margin: auto;
      }

      .bottom-line {
        width: 2px;
        height: 24px;
        margin: auto;
      }

      .stepper-btn {
        background-color: transparent;
        display: flex;
        width: 100%;
        justify-content: center;
      }

      .node-title {
        color: var(--lrndesign-stepper-btn-title-color);
        text-transform: none;
        line-height: 32px;
        font-weight: bold;
        font-size: 16px;
      }

      .btn-icon {
        background-color: transparent;
        color: var(--lrndesign-icon-button-color);
        border-radius: 50%;
        --iron-icon-height: 35px;
        --iron-icon-width: 35px;
      }

      .url-style {
        text-decoration: none;
      }

      .title-container {
        padding: 10px;
        width: 70%;
        position: relative;
        right: 19.2px;
      }

      .title-container:hover {
        text-decoration: underline;
      }

      .box-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        position: relative;
        width: 30%;
      }

      paper-button {
        width: 100%;
        position: relative;
      }

      paper-button:after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
      }

      paper-button:active,
      paper-button:focus {
        background-color: var(--lrndesign-stepper-btn-active);
      }
      paper-button:focus iron-icon {
        color: black;
      }

      paper-button:active:after,
      paper-button:focus:after {
        border-color: var(--lrndesign-border-color);
      }

      paper-button {
        --paper-button: {
          border-radius: 0;
          padding: 0;
        }
      }
    </style>

    <template is="dom-if" if="{{hasCollapse(collapsible, 1)}}">
      <paper-button noink="" on-click="collapseToggle">
        <div class="box-container">
          <div class="top-line"></div>
          <div class="stepper-btn">
            <iron-icon icon="[[icon]]" class="btn-icon"></iron-icon>
          </div>
          <div class="bottom-line"></div>
        </div>
        <div class="title-container">
          <div class="node-title">[[title]]</div>
        </div>
      </paper-button>
      <iron-collapse>
      <div>
        <slot></slot>
      </div>
      </iron-collapse>
    </template>
    <template is="dom-if" if="{{hasCollapse(collapsible, 0)}}">
      <a tabindex="-1" href="[[url]]" class="url-style">
      <paper-button class="btn" noink="">
        <div class="box-container">
          <div class="top-line"></div>
          <div class="stepper-btn">
            <iron-icon icon="[[icon]]" class="btn-icon"></iron-icon>
          </div>
          <div class="bottom-line"></div>
        </div>
        <div class="title-container">
          <div class="node-title">[[title]]</div>
        </div>
      </paper-button>
      </a>
      <slot></slot>
    </template>
`,
  is: "lrndesign-stepper-button",
  properties: {
    title: { type: String, reflectToAttribute: !0, notify: !0 },
    icon: { type: String, reflectToAttribute: !0, notify: !0 },
    url: { type: String, reflectToAttribute: !0, notify: !0 },
    location: { type: String, reflectToAttribute: !0, notify: !0 },
    collapsible: {
      type: Boolean,
      reflectToAttribute: !0,
      notify: !0,
      value: !1
    },
    opened: { type: Boolean, value: !1 }
  },
  ready: function() {
    var root = this;
    setTimeout(function() {
      var target = root.shadowRoot.querySelector("iron-collapse");
      if (root.opened) {
        console.log("opening in stepper");
        target.show();
      }
    }, 0);
  },
  collapseToggle: function(e) {
    e.target.nextElementSibling.toggle();
  },
  hasCollapse: function(bool, test) {
    if (bool == test) {
      return !0;
    } else {
      return !1;
    }
  }
});
