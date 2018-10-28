import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "./lrnsys-button-inner.js";
import "./lrnsys-drawer-modal.js";
/**
`lrnsys-drawer`


@demo demo/index.html
*/
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
        --lrnsys-drawer-color: var(--simple-colors-foreground1);
        --lrnsys-drawer-background-color: var(--simple-colors-background1);
      }
      lrnsys-drawer-modal {
        --lrnsys-drawer-width: 30%;
      }
    </style>
    <paper-button class\$="[[class]]" id="flyouttrigger" on-tap="toggleDrawer" raised="[[raised]]" disabled\$="[[disabled]]" title="[[alt]]">
      <lrnsys-button-inner avatar="[[avatar]]" icon="[[icon]]" text="[[text]]">
        <slot name="button"></slot>
      </lrnsys-button-inner>
    </paper-button>
    <paper-tooltip for="flyouttrigger" animation-delay="0">[[alt]]</paper-tooltip>
    <lrnsys-drawer-modal id="modal" body-append="[[bodyAppend]]" opened="[[opened]]" align="[[align]]" header="[[header]]" heading-class="[[headingClass]]">
      <slot name="header" slot="header"></slot>
      <slot></slot>
    </lrnsys-drawer-modal>
`,

  is: "lrnsys-drawer",

  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    "flyouttrigger.focused-changed": "focusToggle"
  },

  behaviors: [simpleColorsBehaviors],

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
     * Support for body-appending which is a hack for stacking context
     * correction but breaks scoped styles / shadowDOM
     */
    bodyAppend: {
      type: Boolean,
      value: true
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
    this.__modal = this.$.modal;
  },

  /**
   * Attached lifecycle
   */
  attached: function() {
    document.body.addEventListener(
      "lrnsys-drawer-modal-closed",
      this._accessibleFocus.bind(this)
    );
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
      // focus on our flyout triggering button
      this.$.flyouttrigger.focus();
    }
  },

  /**
   * Handle a mouse on event and add the hoverclasses
   * to the classList array for paper-button.
   */
  tapEventOn: function(e) {
    const root = this;
    if (typeof root.hoverClass !== typeof undefined) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item, index) {
        if (item != "") {
          root.$.flyouttrigger.classList.add(item);
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
          root.$.flyouttrigger.classList.remove(item);
        }
      });
    }
  },

  /**
   * Toggle the drawer to open / close.
   */
  toggleDrawer: function() {
    this.$.modal.open();
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
            root.$.flyouttrigger.classList.add(item);
          } else {
            root.$.flyouttrigger.classList.remove(item);
          }
        }
      });
    }
    root.focusState = !root.focusState;
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
