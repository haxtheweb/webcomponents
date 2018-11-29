import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-drawer/simple-drawer.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "./lrnsys-button-inner.js";
/**
 * `lrnsys-drawer`
 *
 * @demo demo/index.html
 */
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
        --lrnsys-drawer-color: var(--simple-colors-foreground1);
        --lrnsys-drawer-background-color: var(--simple-colors-background1);
      }
      paper-button {
        display:inline-block;
      }
    </style>
    <paper-button class\$="[[class]]" id="flyouttrigger" on-tap="toggleDrawer" raised="[[raised]]" disabled\$="[[disabled]]" title="[[alt]]">
      <lrnsys-button-inner avatar="[[avatar]]" icon="[[icon]]" text="[[text]]">
        <slot name="button"></slot>
      </lrnsys-button-inner>
    </paper-button>
    <paper-tooltip for="flyouttrigger" animation-delay="0">[[alt]]</paper-tooltip>
`,

  is: "lrnsys-drawer",

  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff"
  },

  properties: {
    /**
     * State for if it is currently open.
     */
    opened: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * If the button should be visually lifted off the UI.
     */
    raised: {
      type: Boolean,
      reflectToAttribute: true
    },
    /**
     * Icon to present for clicking.
     */
    icon: {
      type: String
    },
    /**
     * Icon to present for clicking.
     */
    avatar: {
      type: String
    },
    /**
     * Text to present for clicking.
     */
    text: {
      type: String
    },
    /**
     * Side of the screen to align the flyout (right or left)
     */
    align: {
      type: String,
      value: "left"
    },
    /**
     * Alt / hover text for this link
     */
    alt: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Header for the drawer
     */
    header: {
      type: String
    },
    /**
     * Disabled state.
     */
    disabled: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Classes to add / subtract based on the item being hovered
     */
    hoverClass: {
      type: String
    },
    /**
     * Heading classes to apply downstream.
     */
    headingClass: {
      type: String,
      value: "white-text black"
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
   * Ready lifecycle
   */
  ready: function() {
    this.__modal = window.simpleDrawer.requestAvailability();
  },

  /**
   * Attached lifecycle
   */
  attached: function() {
    this.$.flyouttrigger.addEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
  },
  /**
   * detached lifecycle
   */
  detached: function() {
    this.$.flyouttrigger.removeEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
  },

  /**
   * Handle a mouse on event and add the hoverclasses
   * to the classList array for paper-button.
   */
  tapEventOn: function(e) {
    if (typeof this.hoverClass !== typeof undefined) {
      var classes = this.hoverClass.split(" ");
      classes.forEach((item, index) => {
        if (item != "") {
          this.$.flyouttrigger.classList.add(item);
        }
      });
    }
  },

  /**
   * Handle a mouse out event and remove the hoverclasses
   * from the classList array for paper-button.
   */
  tapEventOff: function(e) {
    if (typeof this.hoverClass !== typeof undefined) {
      var classes = this.hoverClass.split(" ");
      classes.forEach((item, index) => {
        if (item != "") {
          this.$.flyouttrigger.classList.remove(item);
        }
      });
    }
  },

  /**
   * Toggle the drawer to open / close.
   */
  toggleDrawer: function() {
    // assemble everything in the slot
    let nodes = dom(this).getEffectiveChildNodes();
    let h = document.createElement("span");
    let c = document.createElement("span");
    for (var i in nodes) {
      if (typeof nodes[i].tagName !== typeof undefined) {
        switch (nodes[i].getAttribute("slot")) {
          case "header":
            h.appendChild(nodes[i].cloneNode(true));
            break;
          default:
            c.appendChild(nodes[i].cloneNode(true));
            break;
        }
      }
    }
    const evt = new CustomEvent("simple-drawer-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        title: this.header,
        elements: { content: c, header: h },
        invokedBy: this.$.flyouttrigger,
        align: this.align,
        size: "30%",
        clone: false
      }
    });
    this.dispatchEvent(evt);
  },

  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  focusToggle: function(e) {
    this.fire("focus-changed", { focus: this.focusState });
    // see if it has hover classes
    if (typeof this.hoverClass !== typeof undefined) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          if (this.focusState) {
            this.$.flyouttrigger.classList.add(item);
          } else {
            this.$.flyouttrigger.classList.remove(item);
          }
        }
      });
    }
    this.focusState = !this.focusState;
  },

  /**
   * Find out if the text does not have an avatar or an icon to the left,
   * and add a class to remove the left margin.
   */
  _getTextLabelClass: function() {
    if (!this.avatar && !this.icon) {
      return "text-label-only";
    }
    return "text-label";
  }
});
