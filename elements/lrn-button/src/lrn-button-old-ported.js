import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/materializecss-styles";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
`lrnsys-button`
A LRN element

* @demo demo/index.html
*/
let LrnsysButton = Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: block;
        @apply --paper-font-common-base;
        @apply --paper-button;
        --lrnsys-button-height: 48px;
      }
      :host(.center) {
        text-align: center;
      }
      a {
        text-decoration: none;
        display: block;
        color: #000000;
      }
      paper-button {
        transition: 0.3s;
        margin: 0;
        max-width: 50%;
        height: inherit;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        align-items: center;
        border-radius: unset;
      }
      paper-button iron-icon {
        height: var(--lrnsys-button-height);
        margin: 0 12px;
      }
      paper-button div.inner {
        height: var(--lrnsys-button-height);
        line-height: var(--lrnsys-button-height);
        padding: 0 12px;
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
      .center {
        text-align: center;
        margin: 0 auto;
      }
    </style>
    <a
      tabindex="-1"
      id="lrnsys-button-link"
      href\$="[[showHref]]"
      data-prefetch-hover\$="[[prefetch]]"
      target\$="[[target]]"
    >
      <paper-button
        id="button"
        raised="[[raised]]"
        class\$="[[class]] [[color]] [[textColor]]"
        disabled\$="[[disabled]]"
      >
        <div class\$="inner [[innerClass]]">
          <iron-icon
            icon\$="[[icon]]"
            id="icon"
            class\$="[[iconClass]]"
            hidden\$="[[!icon]]"
          ></iron-icon>
          <span class="label" hidden\$="[[!label]]"> [[label]] </span>
          <slot></slot>
        </div>
      </paper-button>
    </a>
    <paper-tooltip for="lrnsys-button-link" animation-delay="0"
      >[[alt]]</paper-tooltip
    >
  `,

  is: "lrn-button",

  /**
   * Detect when hovering on our off the element and provide color switching
   */
  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    "button.focused-changed": "focusToggle"
  },

  properties: {
    /**
     * Standard href pass down
     */
    href: {
      type: String,
      value: "#"
    },
    showHref: {
      type: String,
      value: false
    },
    /**
     * If the button should be visually lifted off the UI.
     */
    raised: {
      type: Boolean
    },
    /**
     * Label to place in the text area
     */
    label: {
      type: String,
      value: ""
    },
    target: {
      type: String,
      value: ""
    },
    /**
     * iron-icon to use (with iconset if needed)
     */
    icon: {
      type: String,
      value: false
    },
    /**
     * Classes to add / subtract based on the item being hovered.
     */
    hoverClass: {
      type: String
    },
    /**
     * Icon class in the event you want it to look different from the text.
     */
    iconClass: {
      type: String
    },
    /**
     * Inner container classes.
     */
    innerClass: {
      type: String
    },
    /**
     * materializeCSS color class
     */
    color: {
      type: String
    },
    /**
     * materializeCSS color class for text
     */
    textColor: {
      type: String
    },
    /**
     * Allow for prefetch data on hover
     */
    prefetch: {
      type: String
    },
    /**
     * Alt via tooltip.
     */
    alt: {
      type: String
    },
    /**
     * Disabled state.
     */
    disabled: {
      type: Boolean,
      value: false
    },
    /**
     * Tracks if focus state is applied
     */
    focusState: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Go to the href if the button isn't disabled
   */
  ready: function(e) {
    if (!this.disabled) {
      this.showHref = this.href;
    }
  },

  /**
   * Class processing on un-tap / hover
   */
  tapEventOn: function(e) {
    let root = this;
    if (typeof root.hoverClass !== typeof undefined && !root.disabled) {
      // break class into array
      var classes = root.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach(function(item, index) {
        if (item != "") {
          root.$.button.classList.add(item);
          if (item.indexOf("-") != -1) {
            root.$.icon.classList.add(item);
          }
        }
      });
    }
  },

  /**
   * Undo class processing on un-tap / hover
   */
  tapEventOff: function(e) {
    let root = this;
    if (typeof root.hoverClass !== typeof undefined && !root.disabled) {
      // break class into array
      var classes = root.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach(function(item, index) {
        if (item != "") {
          root.$.button.classList.remove(item);
          if (item.indexOf("-") != -1) {
            root.$.icon.classList.remove(item);
          }
        }
      });
    }
  },

  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  focusToggle: function(e) {
    let root = this;
    this.fire("focus-changed", { focus: root.focusState });
    // see if it has hover classes
    if (typeof root.hoverClass !== typeof undefined && !root.disabled) {
      // break class into array
      var classes = root.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach(function(item, index) {
        if (item != "") {
          if (root.focusState) {
            root.$.button.classList.add(item);
            if (item.indexOf("-") != -1) {
              root.$.icon.classList.add(item);
            }
          } else {
            root.$.button.classList.remove(item);
            if (item.indexOf("-") != -1) {
              root.$.icon.classList.remove(item);
            }
          }
        }
      });
    }
    root.focusState = !root.focusState;
  }
});
export { LrnsysButton };
