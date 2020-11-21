import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js";
import "@lrnwebcomponents/simple-popover/lib/simple-popover-selection.js";

class HaxToolbarMenu extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          box-sizing: border-box;
        }
        simple-icon-lite {
          --simple-icon-height: 10px;
          --simple-icon-width: 10px;
          margin-left: -2px;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
      `,
    ];
  }
  render() {
    return html`
      <simple-popover-selection
        @simple-popover-selection-changed="${this.selectedChanged}"
        auto
        orientation="tb"
      >
        <style slot="style">
          simple-popover-manager hax-context-item {
            overflow: hidden;
            display: flex;
          }
          simple-popover-manager {
            --simple-popover-padding: 0;
          }
        </style>
        <hax-toolbar-item
          ?mini="${this.mini}"
          ?action="${this.action}"
          slot="button"
          icon="${this.icon}"
          .hidden="${!this.icon}"
          .class="${this.iconClass}"
          tooltip="${this.tooltip}"
        >
          <simple-icon-lite icon="hax:expand-more"></simple-icon-lite>
        </hax-toolbar-item>
        <div slot="options">
          <slot></slot>
        </div>
      </simple-popover-selection>
    `;
  }
  selectedChanged(e) {
    this.shadowRoot.querySelector("simple-popover-selection").opened = false;
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
    this.selected = "";
  }
}
window.customElements.define(HaxToolbarMenu.tag, HaxToolbarMenu);
export { HaxToolbarMenu };
