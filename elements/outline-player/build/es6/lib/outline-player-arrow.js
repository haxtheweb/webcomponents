import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
Polymer({
  _template: html`
    <style include="materializecss-styles">
      :host {
        display: block;
        position: relative;
        font-family: libre baskerville;
        width: 48px;
        --app-drawer-width: 300px;
        --outline-player-dark: #222222;
        --outline-player-light: #F8F8F8;
      }

      paper-icon-button {
        --paper-icon-button-ink-color: var(--outline-player-dark);
      }
    </style>

    <div id="container">
      <paper-icon-button id="button" disabled="[[disabled]]" icon="[[icon]]"></paper-icon-button>
      <paper-tooltip for="button" position="bottom" offset="14">
        <slot></slot>
      </paper-tooltip>
    </div>
`,
  is: "outline-player-arrow",
  behaviors: [MaterializeCSSBehaviors.ColorBehaviors],
  properties: {
    icon: { type: String, value: "icons:arrow-back" },
    disabled: { type: Boolean, value: !0, reflectToAttribute: !0 },
    sticky: { type: Boolean, value: !1, reflectToAttribute: !0 },
    __isNavSticky: {
      type: Boolean,
      value: !1,
      observer: "__isNavStickyChanged"
    },
    __originalPosition: { type: Number, value: 0 }
  },
  attached: function() {
    this.__originalPosition = this.__getElementOffset(this);
    const container = this.$.container;
    window.addEventListener("scroll", e => {
      if (this.sticky) {
        this.__calculateIsNavSticky();
        if (this.__isNavSticky) {
          container.style.position = "absolute";
          container.style.top =
            window.pageYOffset - this.__originalPosition.top + "px";
          container.style.left = this.__originalPosition.left;
        }
      }
    });
  },
  resetPosition: function() {
    const container = this.$.container;
    container.style.top = 0;
  },
  __isNavStickyChanged: function(isNavSticky) {
    console.log("is sticky", isNavSticky);
  },
  __calculateIsNavSticky: function() {
    const position = window.pageYOffset;
    if (this.__originalPosition.top < position) {
      if (!this.__isNavSticky) {
        this.__isNavSticky = !0;
      }
    } else {
      if (this.__isNavSticky) {
        this.__isNavSticky = !1;
      }
    }
  },
  __getElementOffset(element) {
    const de = document.documentElement,
      box = element.getBoundingClientRect(),
      top = box.top + window.pageYOffset - de.clientTop,
      left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
  }
});
