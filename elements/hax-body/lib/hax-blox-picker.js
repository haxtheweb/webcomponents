import { LitElement, html, css } from "lit-element/lit-element.js";
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
class HaxPicker extends LitElement {
  constructor() {
    super();
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/app-layout/app-drawer/app-drawer.js");
  }
  /**
   * Dependencies
   */
  setupPicker(pickerProperty, pickerTag) {
    // fire an event that this is a core piece of the system
    this.dispatchEvent(
      new CustomEvent("hax-register-core-piece", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          piece: pickerProperty,
          object: this
        }
      })
    );
    this.appendChild(document.createElement(pickerTag));
  }
  static get styles() {
    return [
      css`
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
          z-index: 10000;
          margin-top: 56px;
        }
        #closedialog {
          float: right;
          top: 124px;
          right: 0;
          position: absolute;
          padding: 8px;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
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
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
          font-size: 18px;
          line-height: 18px;
          font-family: "Noto Serif", serif;
        }
        app-drawer {
          --app-drawer-width: 320px;
        }
        .pref-container {
          text-align: left;
          padding: 16px;
        }
      `
    ];
  }

  render() {
    return html`
      <app-drawer
        id="dialog"
        @opened-changed="${this.openedChanged}"
        align="left"
        transition-duration="300"
      >
        <h3 class="title">
          <iron-icon icon="${this.icon}"></iron-icon> ${this.title}
        </h3>
        <div style="height: 100%; overflow: auto;" class="pref-container">
          <slot></slot>
        </div>
        <paper-button id="closedialog" @click="${this.closeEvent}">
          <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
        </paper-button>
      </app-drawer>
    `;
  }
  openedChanged(e) {
    // force close event to align data model if clicking away
    if (e.detail.value === false) {
      this.closeEvent(e);
    }
  }
  closeEvent(e) {
    window.HaxStore.write("openDrawer", false, this);
  }
  static get properties() {
    return {
      /**
       * Header so it's variable
       */
      title: {
        type: String
      },
      icon: {
        type: String
      }
    };
  }
  /**
   * open the dialog
   */
  open() {
    this.shadowRoot.querySelector("#dialog").open();
  }
  /**
   * close the dialog
   */
  close() {
    this.shadowRoot.querySelector("#dialog").close();
  }
}

class HaxBloxPicker extends HaxPicker {
  constructor() {
    super();
    import("@lrnwebcomponents/hax-body/lib/hax-blox-browser.js");
    this.title = "Insert layout";
    this.icon = "icons:view-column";
    // this sets everything else in motion correctly
    this.setupPicker("haxBloxPicker", "hax-blox-browser");
  }
  static get tag() {
    return "hax-blox-picker";
  }
}
window.customElements.define(HaxBloxPicker.tag, HaxBloxPicker);
export { HaxPicker, HaxBloxPicker };
