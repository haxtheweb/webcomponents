import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icon/iron-icon.js";
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
        iron-icon {
          width: 10px;
        }
        paper-menu-button {
          margin: 0;
          padding: 0;
          text-transform: none;
          display: flex;
          min-width: unset;
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
      `,
    ];
  }
  render() {
    return html`
      <paper-menu-button>
        <hax-toolbar-item
          id="button"
          ?mini="${this.mini}"
          ?action="${this.action}"
          slot="dropdown-trigger"
          icon="${this.icon}"
          .hidden="${!this.icon}"
          .class="${this.iconClass}"
          tooltip="${this.tooltip}"
        >
          <iron-icon icon="icons:expand-more"></iron-icon>
        </hax-toolbar-item>
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
    this.action = false;
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
        reflect: true,
      },
      mini: {
        type: Boolean,
        reflect: true,
      },
      action: {
        type: Boolean,
      },
      icon: {
        type: String,
      },
      tooltip: {
        type: String,
      },
      tooltipDirection: {
        type: String,
        attribute: "tooltip-direction",
      },
      selected: {
        type: Number,
      },
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
            detail: this[propName],
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
    this.selected = "";
  }
  /**
   * Ensure menu is hidden.
   */
  hideMenu() {
    this.shadowRoot.querySelector("#listbox").style.display = "none";
    this.selected = "";
  }
}
window.customElements.define(HaxToolbarMenu.tag, HaxToolbarMenu);
export { HaxToolbarMenu };
