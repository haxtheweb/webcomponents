import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
class HaxToolbarMenu extends PolymerElement {
  constructor() {
    super();
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@polymer/iron-icons/device-icons.js");
    import("@polymer/iron-icons/hardware-icons.js");
    import("@polymer/iron-icons/social-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@polymer/iron-icons/maps-icons.js");
    import("@polymer/paper-item/paper-item.js");
    import("@polymer/paper-listbox/paper-listbox.js");
    import("@polymer/paper-menu-button/paper-menu-button.js");
    import("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js");
  }
  static get template() {
    return html`
      <style>
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

        paper-tooltip {
          pointer-events: none;
        }
        paper-listbox {
          padding: 0;
        }
      </style>
      <paper-menu-button>
        <hax-toolbar-item
          id="button"
          slot="dropdown-trigger"
          icon="[[icon]]"
          hidden\$="[[!icon]]"
          class\$="[[iconClass]]"
          tooltip="[[tooltip]]"
        ></hax-toolbar-item>
        <paper-listbox
          id="listbox"
          slot="dropdown-content"
          selected="{{selected}}"
        >
          <slot></slot>
        </paper-listbox>
      </paper-menu-button>
    `;
  }

  static get tag() {
    return "hax-toolbar-menu";
  }

  static get properties() {
    return {
      /**
       * corner
       */
      corner: {
        type: String,
        reflectToAttribute: true,
        value: ""
      },
      /**
       * Should we reset the selection after it is made
       */
      resetOnSelect: {
        type: Boolean,
        value: false
      },
      tooltip: {
        type: String,
        value: ""
      },
      tooltipDirection: {
        type: String,
        value: ""
      },
      selected: {
        type: String,
        value: "",
        notify: true,
        observer: "_selectChanged"
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("tap", this._menubuttonTap.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("tap", this._menubuttonTap.bind(this));
    super.disconnectedCallback();
  }

  /**
   * Select changed to trip button.
   */
  _selectChanged(e) {
    this.shadowRoot.querySelector("#button").focus();
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
