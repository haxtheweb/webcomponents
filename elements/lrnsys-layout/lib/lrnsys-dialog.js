import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/neon-animation/neon-animations.js";
import "@polymer/iron-icons/iron-icons.js";
import "./lrnsys-button-inner.js";
/**
`lrnsys-dialog`

* @demo demo/index.html
*/
Polymer({
  _template: html`
    <custom-style>
      <style is="custom-style" include="simple-colors">
        :host {
          display: inline-block;
          --lrnsys-dialog-color: var(--simple-colors-foreground1, #000);
          --lrnsys-dialog-background-color: var(--simple-colors-background1);
          --lrnsys-dialog-toolbar-background-color: var(
            --simple-colors-background3
          );
          --lrnsys-dialog-secondary-background-color: rgba(255, 255, 255, 0.7);
        }
        :host([dark]) {
          --lrnsys-dialog-toolbar-background-color: var(
            --simple-colors-background1
          );
          --lrnsys-dialog-background-color: var(--simple-colors-background3);
          --lrnsys-dialog-secondary-background-color: rgba(0, 0, 0, 0.7);
        }
        #dialogtrigger {
          display: inline-block;
        }
      </style>
    </custom-style>
    <paper-button
      class$="[[class]]"
      id="dialogtrigger"
      on-tap="openDialog"
      raised="[[raised]]"
      disabled$="[[disabled]]"
      title="[[alt]]"
      aria-label$="[[alt]]"
    >
      <lrnsys-button-inner
        avatar$="[[avatar]]"
        icon$="[[icon]]"
        text$="[[text]]"
      >
        <slot name="button" slot="button"></slot>
      </lrnsys-button-inner>
    </paper-button>
    <paper-tooltip for="dialogtrigger" animation-delay="0" hidden$="[[!alt]]"
      >[[alt]]</paper-tooltip
    >
  `,

  is: "lrnsys-dialog",

  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff"
  },

  properties: {
    /**
     * Icon to present for clicking.
     */
    icon: {
      type: String
    },
    /**
     * If the button should be visually lifted off the UI.
     */
    raised: {
      type: Boolean
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
     * Alt / hover text for this link
     */
    alt: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Header for the dialog
     */
    header: {
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
     * Classes to add / subtract based on the item being hovered
     */
    hoverClass: {
      type: String
    },
    /**
     * Default heading classes.
     */
    headingClass: {
      type: String,
      value: "white-text black"
    },
    /**
     * Support for dynamic loading of iron-image elements that are in the content slot.
     */
    dynamicImages: {
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
   * Handle a focus/tap event and add the hoverclasses
   * to the classList array for paper-button.
   */
  tapEventOn: function(e) {
    const root = this;
    if (typeof root.hoverClass !== typeof undefined) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item, index) {
        if (item != "") {
          root.$.dialogtrigger.classList.add(item);
        }
      });
    }
  },

  /**
   * Handle a mouse out event and remove the hoverclasses
   * from the classList array for paper-button.
   */
  tapEventOff: function(e) {
    const root = this;
    if (typeof root.hoverClass !== typeof undefined) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item, index) {
        if (item != "") {
          root.$.dialogtrigger.classList.remove(item);
        }
      });
    }
  },

  /**
   * Toggle the drawer to open / close.
   */
  openDialog: function() {
    // assemble everything in the slot
    let nodes = dom(this).getEffectiveChildNodes();
    let h = document.createElement("span");
    let c = document.createElement("span");
    let node = {};
    for (var i in nodes) {
      if (typeof nodes[i].tagName !== typeof undefined) {
        switch (nodes[i].getAttribute("slot")) {
          case "toolbar-primary":
          case "toolbar-secondary":
          case "toolbar":
          case "header":
            node = nodes[i].cloneNode(true);
            h.appendChild(node);
            break;
          case "button":
            // do nothing
            break;
          default:
            node = nodes[i].cloneNode(true);
            if (this.dynamicImages && node.tagName === "IRON-IMAGE") {
              node.preventLoad = false;
              node.removeAttribute("prevent-load");
            }
            c.appendChild(node);
            break;
        }
      }
    }
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        title: this.header,
        elements: {
          header: h,
          content: c
        },
        invokedBy: this.$.dialogtrigger
      }
    });
    this.dispatchEvent(evt);
  },

  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  focusToggle: function(e) {
    const root = this;
    root.fire("focus-changed", { focus: root.focusState });
    // see if it has hover classes
    if (typeof root.hoverClass !== typeof undefined) {
      // break class into array
      var classes = root.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach(function(item, index) {
        if (item != "") {
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

  /**
   * Ready lifecycle
   */
  ready: function() {
    this.__modal = window.SimpleModal.requestAvailability();
  },

  /**
   * Attached lifecycle
   */
  attached: function() {
    this.$.dialogtrigger.addEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
  },
  /**
   * detached lifecycle
   */
  detached: function() {
    this.$.dialogtrigger.removeEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
  }
});
