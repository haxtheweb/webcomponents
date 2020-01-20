import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js";
class HaxToolbarMenu extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          box-sizing: border-box;
        }
        paper-menu-button {
          color: rgba(0, 0, 0, 0.66);
          margin: 0;
          padding: 0;
          text-transform: none;
          background-color: #ffffff;
          display: flex;
          min-width: 24px;
        }

        paper-menu-button .label {
          font-size: 12px;
          margin-top: 4px;
        }

        paper-menu-button .button-inner {
          padding-top: 8px;
          text-align: center;
        }

        .flip-icon {
          transform: rotateY(180deg);
        }

        simple-tooltip {
          pointer-events: none;
        }
        paper-listbox {
          padding: 0;
        }
      `
    ];
  }
  render() {
    return html`
      <paper-menu-button>
        <hax-toolbar-item
          id="button"
          ?mini="${this.mini}"
          slot="dropdown-trigger"
          icon="${this.icon}"
          .hidden="${!this.icon}"
          .class="${this.iconClass}"
          tooltip="${this.tooltip}"
        ></hax-toolbar-item>
        <paper-listbox
          id="listbox"
          slot="dropdown-content"
          .selected="${this.selected}"
          @selected-changed="${this.selectedChanged}"
        >
          <slot></slot>
        </paper-listbox>
      </paper-menu-button>
    `;
  }
  selectedChanged(e) {
    this.selected = e.detail.value;
  }
  static get tag() {
    return "hax-toolbar-menu";
  }
  constructor() {
    super();
    this.corner = "";
    this.resetOnSelect = false;
    this.tooltip = "";
    this.tooltipDirection = "";
    this.selected = 0;
    setTimeout(() => {
      this.addEventListener("click", this._menubuttonTap.bind(this));
    }, 0);
  }
  static get properties() {
    return {
      /**
       * corner
       */
      corner: {
        type: String,
        reflect: true
      },
      mini: {
        type: Boolean,
        reflect: true
      },
      icon: {
        type: String
      },
      /**
       * Should we reset the selection after it is made
       */
      resetOnSelect: {
        type: Boolean,
        attribute: "reset-on-select"
      },
      tooltip: {
        type: String
      },
      tooltipDirection: {
        type: String,
        attribute: "tooltip-direction"
      },
      selected: {
        type: Number
      }
    };
  }
  /**
   * property changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "selected") {
        this.shadowRoot.querySelector("#button").focus();
        // fire an event that this is a core piece of the system
        this.dispatchEvent(
          new CustomEvent("selected-changed", {
            detail: this[propName]
          })
        );
      }
    });
  }
  /**
   * Ensure menu is visible / default'ed.
   */
  _menubuttonTap(e) {
    this.shadowRoot.querySelector("#listbox").style.display = "inherit";
    if (this.resetOnSelect) {
      this.selected = "";
    }
  }
  /**
   * Ensure menu is hidden.
   */
  hideMenu() {
    this.shadowRoot.querySelector("#listbox").style.display = "none";
  }
}
window.customElements.define(HaxToolbarMenu.tag, HaxToolbarMenu);
export { HaxToolbarMenu };
