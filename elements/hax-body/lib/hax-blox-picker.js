import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "./hax-blox-browser.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 `hax-blox-picker`
 A picker for selecting an item from a list of apps / hax blox which require
 a decision to be made. This is used when multiple things match either on upload
 in the add operation of the app or in the blox selection to render through,
 such as having multiple ways of presenting an image.

* @demo demo/index.html

@microcopy - the mental model for this element
 - data - this is the app data model for an element which expresses itself to hax
*/
Polymer({
  _template: html`
    <style include="simple-colors">
      :host {
        display: block;
      }
      #dialog {
        --app-drawer-width: 320px;
        z-index: 1000;
        margin-top: 40px;
        @apply --hax-blox-picker-dialog;
      }
      #closedialog {
        float: right;
        top: 135px;
        right: 0;
        position: absolute;
        padding: 4px;
        margin: 0;
        color: var(--simple-colors-default-theme-light-green-1, green);
        background-color: transparent;
        width: 40px;
        height: 40px;
        min-width: unset;
      }
      .title {
        margin-top: 32px;
        text-align: center;
        padding: 16px;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 32px;
        font-weight: bold;
        font-family: sans-serif;
        text-transform: uppercase;
        color: var(--simple-colors-default-theme-light-green-1);
      }
      app-drawer {
        --app-drawer-content-container: {
          background-color: rgba(0, 0, 0, 0.7);
        }
        --app-drawer-width: 320px;
      }
      .pref-container {
        text-align: left;
        padding: 16px;
      }
    </style>
    <app-drawer id="dialog" align="left" transition-duration="300">
      <h3 class="title">[[title]]</h3>
      <div style="height: 100%; overflow: auto;" class="pref-container">
        <hax-blox-browser id="bloxbrowser"></hax-blox-browser>
      </div>
      <paper-button id="closedialog" on-tap="close">
        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
      </paper-button>
    </app-drawer>
  `,

  is: "hax-blox-picker",

  properties: {
    /**
     * Header so it's variable
     */
    title: {
      type: String,
      value: "Layouts"
    }
  },

  /**
   * Attached life cycle
   */
  attached: function() {
    this.fire("hax-register-blox-picker", this);
  },

  /**
   * open the dialog
   */
  open: function() {
    this.$.bloxbrowser.resetBrowser();
    this.$.dialog.open();
  },

  /**
   * close the dialog
   */
  close: function() {
    this.$.dialog.close();
  },

  /**
   * Toggle state.
   */
  toggleDialog: function() {
    if (this.$.dialog.opened) {
      this.close();
    } else {
      window.HaxStore.instance.closeAllDrawers(this);
    }
  }
});
