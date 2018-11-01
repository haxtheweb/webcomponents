import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-collapse/iron-collapse.js";
/**
`lrndesign-stepper-button`
visualization of steps

@demo demo/index.html
*/
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
        height: 1.5em;
        margin: auto;
      }

      .bottom-line {
        width: 2px;
        height: 1.5em;
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
        line-height: 2em;
        font-weight: bold;
        font-size: 1em;
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
        right: 1.2em;
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
    /**
     * The button title.
     */
    title: {
      type: String,
      reflectToAttribute: true,
      notify: true
    },

    /**
     * The button icon.
     */
    icon: {
      type: String,
      reflectToAttribute: true,
      notify: true
    },

    /**
     * The url for button.
     */
    url: {
      type: String,
      reflectToAttribute: true,
      notify: true
    },
    /**
     * The tab location position (start / middle / end).
     */
    location: {
      type: String,
      reflectToAttribute: true,
      notify: true
    },
    /**
     * Allow for collapsible content with the items inside
     */
    collapsible: {
      type: Boolean,
      reflectToAttribute: true,
      notify: true,
      value: false
    },
    opened: {
      type: Boolean,
      value: false
    }
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

  /**
   * Toggling collapse on an iron element.
   */
  collapseToggle: function(e) {
    e.target.nextElementSibling.toggle();
  },

  /**
   * If it is in a collapsed state or not.
   */
  hasCollapse: function(bool, test) {
    if (bool == test) {
      return true;
    } else {
      return false;
    }
  }
});
