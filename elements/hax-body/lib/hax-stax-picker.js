import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
/**
 *  `hax-stax-picker`
 * A picker for selecting an item from a list of apps / hax stax which require
 * a decision to be made. This is used when multiple things match either on upload
 * in the add operation of the app or in the stax selection to render through,
 * such as having multiple ways of presenting an image.
 * @microcopy - the mental model for this element
 * - data - this is the app data model for an element which expresses itself to hax
 */
class HaxStaxPicker extends PolymerElement {
  constructor() {
    super();
    import("@lrnwebcomponents/hax-body/lib/hax-stax-browser.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/app-layout/app-drawer/app-drawer.js");
  }
  static get template() {
    return html`
      <style include="hax-shared-styles">
        :host {
          display: block;
        }
        iron-icon:not(:defined),
        paper-button:not(:defined),
        app-drawer:not(:defined) {
          display: none;
        }
        #dialog {
          --app-drawer-width: 320px;
          z-index: 1000;
          margin-top: 56px;
          @apply --hax-stax-picker-dialog;
        }
        #closedialog {
          float: right;
          top: 124px;
          right: 0;
          position: absolute;
          padding: 8px;
          margin: 0;
          color: var(--hax-color-text);
          background-color: transparent;
          width: 40px;
          height: 40px;
          min-width: unset;
        }
        .title {
          position: relative;
          padding: 16px;
          outline: 0;
          font-weight: 600;
          text-align: left;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg);
          font-size: 18px;
          line-height: 18px;
          font-family: "Noto Serif", serif;
          color: var(--hax-color-text);
        }
        app-drawer {
          --app-drawer-content-container: {
            background-color: #ffffff;
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
          <hax-stax-browser id="staxbrowser"></hax-stax-browser>
        </div>
        <paper-button id="closedialog" on-click="close">
          <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
        </paper-button>
      </app-drawer>
    `;
  }
  static get tag() {
    return "hax-stax-picker";
  }
  static get properties() {
    return {
      /**
       * Header so it's variable
       */
      title: {
        type: String,
        value: "Templates"
      }
    };
  }
  /**
   * Attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(
      new CustomEvent("hax-register-stax-picker", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }

  /**
   * open the dialog
   */
  open() {
    this.shadowRoot.querySelector("#staxbrowser").resetBrowser();
    this.shadowRoot.querySelector("#dialog").open();
  }

  /**
   * close the dialog
   */
  close() {
    this.shadowRoot.querySelector("#dialog").close();
  }
  /**
   * Toggle state.
   */
  toggleDialog() {
    if (this.shadowRoot.querySelector("#dialog").opened) {
      this.close();
    } else {
      window.HaxStore.instance.closeAllDrawers(this);
    }
  }
}
window.customElements.define(HaxStaxPicker.tag, HaxStaxPicker);
export { HaxStaxPicker };
