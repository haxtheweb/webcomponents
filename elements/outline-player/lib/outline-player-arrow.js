import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
/**
`outline-player`
A LRN element

@demo demo/index.html

*/
Polymer({
  _template: html`
    <style include="materializecss-styles">
      :host {
        display: block;
        position: relative;
        font-family: libre baskerville;
        width: 3em;
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
    icon: {
      type: String,
      value: "icons:arrow-back"
    },
    disabled: {
      type: Boolean,
      value: true,
      reflectToAttribute: true
    },
    sticky: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    __isNavSticky: {
      type: Boolean,
      value: false,
      observer: "__isNavStickyChanged"
    },
    __originalPosition: {
      type: Number,
      value: 0
    }
  },

  attached: function() {
    // identify your nav element to query
    this.__originalPosition = this.__getElementOffset(this);
    const container = this.$.container;
    // watch for a scroll event
    window.addEventListener("scroll", e => {
      // check if we are sticky
      if (this.sticky) {
        // calculate is nav sticky
        this.__calculateIsNavSticky();
        // scroll the nav element
        if (this.__isNavSticky) {
          container.style.position = "absolute";
          container.style.top =
            window.pageYOffset - this.__originalPosition.top + "px";
          container.style.left = this.__originalPosition.left;
        }
      }
    });
  },

  /**
   * Reset the dynaimc positioning of the arrows.  Usefull for ajax page changes
   */
  resetPosition: function() {
    const container = this.$.container;
    container.style.top = 0;
  },

  /**
   * Sticky Nav has changed
   */
  __isNavStickyChanged: function(isNavSticky) {
    console.log("is sticky", isNavSticky);
  },

  /**
   * Calculate is nav sticky
   */
  __calculateIsNavSticky: function() {
    const position = window.pageYOffset;
    // if the window scroll has reached the element
    if (this.__originalPosition.top < position) {
      // // check to make sure that its not already sticky
      if (!this.__isNavSticky) {
        this.__isNavSticky = true;
      }
    } else {
      if (this.__isNavSticky) {
        this.__isNavSticky = false;
      }
    }
  },

  /**
   * Get Element Offset
   */
  __getElementOffset(element) {
    const de = document.documentElement;
    const box = element.getBoundingClientRect();
    const top = box.top + window.pageYOffset - de.clientTop;
    const left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
  }
});
