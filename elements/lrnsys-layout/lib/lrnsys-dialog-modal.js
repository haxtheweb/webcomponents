import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/neon-animation/neon-animations.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./lrnsys-dialog-toolbar.js";
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
        z-index: 1000;
      }

      paper-dialog {
        position: fixed;
        top: 5%;
        right: 5%;
        bottom: 5%;
        left: 5%;
        overflow: auto;
        border-radius: 3px;
        color: var(--lrnsys-dialog-color, black);
        background-color: var(--lrnsys-dialog-background-color, white);
      }
      paper-dialog-scrollable {
        margin-top:0;
        @apply --layout-flex;
      }

      paper-dialog>*:first-child {
        margin-top: 0;
      }

      .dialog-header {
        width: 100%;
        padding: 0;
        margin: 0;
      }
      .dialog-heading {
        padding: 0;
        margin: 0;
      }
      .dialog-header-slot ::slotted(*) {
        margin: 0;
        padding: 0 15px;
        line-height: 200%;
      }
    </style>
    <paper-dialog modal="[[modal]]" id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" with-backdrop="" opened\$="[[opened]]">
      <lrnsys-dialog-toolbar on-button-clicked="_toolbarButtonClickedHandler">
        <slot slot="primary" name="toolbar-primary"></slot>
        <slot slot="secondary" name="toolbar-secondary"></slot>
      </lrnsys-dialog-toolbar>  
      <div class$="[[headingClass]] dialog-header">
        <div class$="[[headingClass]] dialog-heading" hidden$="[[!header]]">[[header]]</div>
        <span class="dialog-header-slot"><slot name="header"></slot></span>
      </div>
      <paper-dialog-scrollable class="dialog-contents" id="dialogcontent">
        <slot></slot>
      </paper-dialog-scrollable>
    </paper-dialog>
`,

  is: "lrnsys-dialog-modal",

  listeners: {
    "iron-overlay-closed": "_modalClosed",
    "iron-overlay-opened": "_resizeContent",
    "iron-overlay-canceled": "_changeOpen"
  },

  properties: {
    /**
     * Header for the dialog
     */
    header: {
      type: String,
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
    }
  },

  /**
   * Toggle the drawer to open / close.
   */
  toggleDialog: function() {
    // support for loading iron-images dynamically
    if (this.dynamicImages) {
      var images = this.$.dialogcontent.getElementsByTagName("IRON-IMAGE");
      // make sure these are
      for (var i = 0; i < images.length; i++) {
        images[i].preventLoad = false;
      }
    }
    this.$.dialog.toggle();
  },

  /**
   * Specifcally handle the click on an item in the toolbar.
   * This allows us to issue events elsewhere or to close the
   * modal if that button has been pressed.
   */
  _toolbarButtonClickedHandler: function(e) {
    if (e.detail.id === "close") {
      this.$.dialog.cancel();
    }
    this.fire("toolbar-button-clicked", e.detail);
  },

  /**
   * Modal has closed, let's react appropriately.
   */
  _modalClosed: function(e) {
    // fire so we can react to accessibly; don't care who invoked this
    // just that it has happened
    this._changeOpen(e);
    this.fire("lrnsys-dialog-modal-closed", this);
  },

  /**
   * Ensure everything is visible in what's been expanded.
   */
  _resizeContent: function(e) {
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
    this._changeOpen(e);
  },
  /**
   * Attached lifecyce
   */
  attached: function() {
    const toolbar = this.shadowRoot.querySelector("lrnsys-dialog-toolbar");
    this.$.dialog.addEventListener("mouseover", e => {
      toolbar.setAttribute("secondary-visible", true);
    });
    this.$.dialog.addEventListener("mouseout", e => {
      toolbar.removeAttribute("secondary-visible");
    });
  },
  /**
   * detached lifecyce
   */
  detached: function() {
    const toolbar = this.shadowRoot.querySelector("lrnsys-dialog-toolbar");
    this.$.dialog.removeEventListener("mouseover", e => {
      toolbar.setAttribute("secondary-visible", true);
    });
    this.$.dialog.removeEventListener("mouseout", e => {
      toolbar.removeAttribute("secondary-visible");
    });
  },

  /**
   * change state
   */
  _changeOpen: function(e) {
    e.stopPropagation();
    if (e.srcElement === this.$.dialog) {
      this.opened = e.type === "iron-overlay-opened";
      this.fire("lrnsys-dialog-modal-changed", this);
    }
  }
});
