import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "paper-avatar/paper-avatar.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/neon-animation/web-animations.js";
import "@polymer/neon-animation/neon-animations.js";
import "simple-colors/simple-colors.js";
import "@polymer/iron-icons/iron-icons.js";
import "./lrnsys-dialog-modal.js";
import "./lrnsys-button-inner.js";
/**
`lrnsys-dialog`

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: inline-block;
        --lrnsys-dialog-color: var(--simple-colors-foreground1,#000);
        --lrnsys-dialog-background-color: var(--simple-colors-background1);
        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background3);
        --lrnsys-dialog-secondary-background-color: rgba(255,255,255, 0.7);
      }
      :host[dark] {
        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background1);
        --lrnsys-dialog-background-color: var(--simple-colors-background3);
        --lrnsys-dialog-secondary-background-color: rgba(0, 0, 0, 0.7);
      }
    </style>
    <paper-button class\$="[[class]]" id="dialogtrigger" on-tap="toggleDialog" raised="[[raised]]" disabled\$="[[disabled]]" title="[[alt]]" aria-label\$="[[alt]]">
      <lrnsys-button-inner avatar\$="[[avatar]]" icon\$="[[icon]]" text\$="[[text]]">
        <slot name="button"></slot>
      </lrnsys-button-inner>
    </paper-button>
    <paper-tooltip for="dialogtrigger" animation-delay="0" hidden\$="[[!alt]]">[[alt]]</paper-tooltip>
    <lrnsys-dialog-modal id="modal" dynamic-images="[[dynamicImages]]" body-append="[[bodyAppend]]" header="[[header]]" modal="[[modal]]" heading-class="[[headingClass]]" opened\$="[[opened]]">
      <slot name="toolbar-primary" slot="primary"></slot>
      <slot name="toolbar-secondary" slot="secondary"></slot>
      <slot name="header" slot="header"></slot>
      <slot></slot>
    </lrnsys-dialog-modal>
`,

  is: "lrnsys-dialog",

  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    "dialogtrigger.focused-changed": "focusToggle"
  },

  behaviors: [simpleColorsBehaviors],

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
     * Modal state for pop over.
     */
    modal: {
      type: Boolean,
      value: false
    },
    /**
     * Is dialog opened?
     */
    opened: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      notify: true
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
     * Support for body-appending which is a hack for stacking context
     * correction but breaks scoped styles / shadowDOM
     */
    bodyAppend: {
      type: Boolean,
      value: true
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
    },
    /**
     * Ability to disable the auto focus mode
     * this is useful if something else is picking up this capability.
     */
    disableAutoFocus: {
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
  toggleDialog: function() {
    this.$.modal.toggleDialog();
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
    this.__modal = this.$.modal;
  },

  /**
   * Attached lifecycle
   */
  attached: function() {
    document.body.addEventListener(
      "lrnsys-dialog-modal-changed",
      this._changeOpen.bind(this)
    );
    if (!this.disableAutoFocus) {
      document.body.addEventListener(
        "lrnsys-dialog-modal-closed",
        this._accessibleFocus.bind(this)
      );
    }
  },

  /**
   * Set ourselves as having focus after the modal closes.
   */
  _accessibleFocus: function(e) {
    // this is OUR modal, we found her, oh modal, We've missed
    // you so much. thank you for coming home. We're so, so, so
    // sorry that we appended you to the body. We'll never do it
    // again (until the next time you open).
    if (e.detail === this.__modal) {
      // focus on our dialog triggering button
      this.$.dialogtrigger.focus();
    }
  },

  /**
   * Attached lifecyce
   */
  _changeOpen: function(e) {
    e.stopPropagation();
    if (e.detail === this.$.modal) {
      this.opened = e.type === "iron-overlay-opened";
      this.fire("lrnsys-dialog-changed", this);
    }
  }
});
