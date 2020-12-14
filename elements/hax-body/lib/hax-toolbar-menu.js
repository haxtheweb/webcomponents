import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js";
import "@lrnwebcomponents/simple-popover/lib/simple-popover-selection.js";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";

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
        ?disabled="${this.disabled}"
        auto
        orientation="tb"
      >
        <div slot="style">
          simple-popover-manager hax-context-item { overflow: hidden; display:
          flex; } simple-popover-manager { --simple-popover-padding: 0; }
          hax-context-item-textop[hidden] { opacity: 0; display: none;
          visibility: hidden; }
        </div>
        <hax-toolbar-item
          ?mini="${this.mini}"
          ?disabled="${this.disabled}"
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
    this.disabled = false;
    this.tooltip = "";
    this.tooltipDirection = "";
    this.selected = 0;
    setTimeout(() => {
      this.addEventListener("click", this._menubuttonTap.bind(this));
    }, 0);
    autorun(() => {
      // this just forces this block to run when editMode is modified
      const editMode = toJS(HAXStore.editMode);
      const activeNode = toJS(HAXStore.activeNode);
      if (
        this.shadowRoot &&
        this.shadowRoot.querySelector("simple-popover-selection")
      ) {
        this.shadowRoot.querySelector(
          "simple-popover-selection"
        ).opened = false;
      }
    });
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
      /**
       * disabled state
       */
      disabled: {
        type: Boolean,
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
    if (!this.disabled) {
      this.selected = "";
    }
  }
}
window.customElements.define(HaxToolbarMenu.tag, HaxToolbarMenu);
export { HaxToolbarMenu };
