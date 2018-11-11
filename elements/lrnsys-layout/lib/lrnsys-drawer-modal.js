import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./lrnsys-button-inner.js";
/**
`lrnsys-drawer-modal`

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
        z-index: 1000;
      }
      app-drawer {
        --app-drawer-width: var(--lrnsys-drawer-width);
        --app-drawer-content-container: {
          padding: 0;
          overflow-y: scroll;
          position: fixed;
          color: var(--lrnsys-drawer-color);
          background-color: var(--lrnsys-drawer-background-color);
        }
      }
      .drawer-header {
        width: 100%;
        padding: 0;
        margin: 0 0 8px 0;
        text-align: left;
        @apply --lrnsys-drawer-header;
      }
      .drawer-header-slot {
      }
      .drawer-heading {
        font-size: 24px;
        margin: 0;
        padding: 0 15px;
        height: 40px;
        line-height: 48px;
      }
      .drawer-content {
        padding: 0 15px;
        text-align: left;
      }

      #close {
        position: absolute;
        right: 8px;
        top: 8px;
        padding: 0 0 0 4px;
        margin: 0;
        min-width: .16px;
        text-transform: none;
      }
      .drawer-header-slot ::slotted(*) {
        font-size: 24px;
        margin: 0;
        padding: 0 15px;
        height: 40px;
        line-height: 48px;
      }
    </style>
    <app-drawer tabindex="0" id="flyoutcontent" opened="[[opened]]" align="[[align]]" role="dialog">
      <div class="drawer-contents">
        <div class="drawer-header">
          <div class\$="[[headingClass]] drawer-header-slot">
            <slot name="header"></slot>
          </div>
          <h3 class\$="[[headingClass]] drawer-heading" hidden\$="[[!header]]">[[header]]</h3>
        </div>
        <div class="drawer-content">
          <slot></slot>
        </div>
      </div>
      <paper-icon-button raised="" icon="close" on-tap="closeDrawer" id="close" aria-label="close dialog" class\$="[[headingClass]]"></paper-icon-button>
      <paper-tooltip for="close" animation-delay="500">Close dialog</paper-tooltip>
    </app-drawer>
`,

  is: "lrnsys-drawer-modal",

  properties: {
    /**
     * State for if it is currently open.
     */
    opened: {
      type: Boolean,
      value: false
    },
    /**
     * Side of the screen to align the flyout (right or left)
     */
    align: {
      type: String,
      value: "left"
    },
    /**
     * Header for the drawer
     */
    header: {
      type: String,
      value: false
    },
    /**
     * Disabled state.
     */
    disabled: {
      type: Boolean,
      value: false
    },
    /**
     * Heading classes.
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
     * Ensure we only attach once in this manner
     */
    _bodyAppended: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Toggle the drawer to open / close.
   */
  open: function() {
    this.$.flyoutcontent.open();
    this.$.close.focus();
  },

  /**
   * Toggle the drawer to open / close.
   */
  close: function() {
    this.$.flyoutcontent.close();
  },

  /**
   * Attached lifecyce
   */
  attached: function() {
    // support for appending to the light document
    // while also making sure we don't loop in attach
    if (this.bodyAppend && !this._bodyAppended) {
      this._bodyAppended = true;
      // @todo investigate why this doesn't actually work anymore
      document.body.appendChild(this);
    }
    this.$.flyoutcontent.addEventListener(
      "opened-changed",
      this._drawerClosed.bind(this)
    );
  },

  /**
   * detached lifecyce
   */
  detached: function() {
    this.$.flyoutcontent.removeEventListener(
      "opened-changed",
      this._drawerClosed.bind(this)
    );
  },
  /**
   * Close the drawer.
   */
  _drawerClosed: function(e) {
    if (!this.$.flyoutcontent.opened) {
      this.fire("lrnsys-drawer-modal-closed", this);
    }
  },

  /**
   * Close the drawer.
   */
  closeDrawer: function(e) {
    this.$.flyoutcontent.close();
  }
});
