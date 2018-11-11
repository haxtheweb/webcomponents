import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: block;
        @apply --paper-font-common-base;
        @apply --paper-button;
        --lrnsys-button-height: 48px;
      }
      a {
        text-decoration: none;
        display: block;
        color: #000000;
      }
      paper-button {
        padding: 0;
        margin: 0;
        min-width: .16px;
        height: inherit;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        text-transform: unset;
        border-radius: unset;
      }
      paper-button iron-icon {
        height: var(--lrnsys-button-height);
        margin: 0 4px;
      }
      paper-button iron-icon:first-child {
        margin: 0 4px 0 0;
      }
      paper-button iron-icon:last-child {
        margin: 0 0 0 4px;
      }
      paper-button div.inner {
        height: var(--lrnsys-button-height);
        line-height: var(--lrnsys-button-height);
        padding: 0 16px;
      }
      paper-button span.label {
        height: var(--lrnsys-button-height);
        line-height: var(--lrnsys-button-height);
      }
      .no-margin {
        margin: 0 !important;
      }
      .no-right-padding {
        padding-right: 0 !important;
      }
      .no-left-padding {
        padding-left: 0 !important;
      }
    </style>
    <a tabindex="-1" id="lrnsys-button-link" href\$="[[showHref]]" data-prefetch-hover\$="[[prefetch]]" target\$="[[target]]">
      <paper-button id="button" title="[[alt]]" raised="[[raised]]" class\$="[[buttonClass]] [[color]] [[textColor]]" disabled\$="[[disabled]]">
        <div class\$="inner [[innerClass]]">
          <iron-icon icon="[[icon]]" id="icon" class\$="[[iconClass]]" hidden\$="[[!icon]]"></iron-icon>
          <span class="label" hidden\$="[[!label]]">
            [[label]]
          </span>
          <slot></slot>
        </div>
      </paper-button>
    </a>
    <paper-tooltip for="lrnsys-button-link" animation-delay="0" hidden\$="[[!alt]]">[[alt]]</paper-tooltip>
`,
  is: "lrnsys-button",
  properties: {
    href: { type: String, value: "#", reflectToAttribute: !0 },
    showHref: {
      type: String,
      value: !1,
      reflectToAttribute: !0,
      computed: "_getShowHref(href,disabled)"
    },
    raised: { type: Boolean, reflectToAttribute: !0 },
    label: { type: String, value: "" },
    target: { type: String, value: "" },
    icon: { type: String, value: !1 },
    hoverClass: { type: String },
    buttonClass: { type: String },
    iconClass: { type: String },
    innerClass: { type: String },
    color: { type: String },
    textColor: { type: String },
    prefetch: { type: String },
    alt: { type: String },
    disabled: { type: Boolean, value: !1 },
    focusState: { type: Boolean, value: !1 }
  },
  attached: function() {
    this.addEventListener("mousedown", this.tapEventOn.bind(this));
    this.addEventListener("mouseover", this.tapEventOn.bind(this));
    this.addEventListener("mouseout", this.tapEventOff.bind(this));
    this.$.button.addEventListener("focused-changed", this.focusToggle);
  },
  _getShowHref: function(href, disabled) {
    if (href && !disabled) {
      return href;
    }
  },
  tapEventOn: function() {
    let root = this;
    if (typeof root.hoverClass !== typeof void 0 && !root.disabled) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item) {
        if ("" != item) {
          root.$.button.classList.add(item);
          if (-1 != item.indexOf("-")) {
            root.$.icon.classList.add(item);
          }
        }
      });
    }
  },
  tapEventOff: function() {
    let root = this;
    if (typeof root.hoverClass !== typeof void 0 && !root.disabled) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item) {
        if ("" != item) {
          root.$.button.classList.remove(item);
          if (-1 != item.indexOf("-")) {
            root.$.icon.classList.remove(item);
          }
        }
      });
    }
  },
  focusToggle: function() {
    let root = dom(this).parentNode.parentNode;
    if (typeof root.hoverClass !== typeof void 0 && !root.disabled) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item) {
        if ("" != item) {
          if (!root.focusState) {
            root.$.button.classList.add(item);
            if (-1 != item.indexOf("-")) {
              root.$.icon.classList.add(item);
            }
          } else {
            root.$.button.classList.remove(item);
            if (-1 != item.indexOf("-")) {
              root.$.icon.classList.remove(item);
            }
          }
        }
      });
    }
    root.focusState = !root.focusState;
  }
});
