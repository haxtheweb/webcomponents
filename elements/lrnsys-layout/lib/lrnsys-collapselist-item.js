import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `lrnsys-collapselist-item`
 * @customElement lrnsys-collapselist-item
 * @demo demo/index.html
 */
class LrnsysCollapselistItem extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          color: var(--lrnsys-collapselist-text-color, #000);
        }
        paper-button {
          height: 48px;
          padding: 0;
          margin: 0;
          min-width: 0.16px;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          text-transform: unset;
          border-radius: 0;
          background-color: var(--lrnsys-collapselist-item-color, #fff);
        }
        paper-button span {
          pointer-events: none;
        }
        .collapse-label {
          padding: 12px 8px 4px 8px;
          width: 100%;
          height: 32px;
        }
        :host([opened]) #collapse {
          border-top: 1px solid var(--lrnsys-collapselist-item-border, #bbb);
          background-color: var(--lrnsys-collapselist-item-active-color, #eee);
        }
        :host([opened]) .collapse-label {
          font-weight: bold;
          background-color: var(--lrnsys-collapselist-item-active-color, #eee);
        }
        .collapse-content {
          padding: 16px;
        }
      `
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.value = false;
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-collapse/iron-collapse.js");
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <paper-button
        @click="${this.collapseToggle}"
        id="collapse-trigger"
        aria-controls="collapse"
      >
        <span class="collapse-label"> <slot name="label"></slot> </span>
      </paper-button>
      <iron-collapse
        id="collapse"
        .opened="${this.opened}"
        @opened-changed="${this.__openedChanged}"
      >
        <div class="collapse-content"><slot name="content"></slot></div>
      </iron-collapse>
    `;
  }
  __openedChanged(e) {
    this.opened = e.detail.value;
  }
  static get tag() {
    return "lrnsys-collapselist-item";
  }

  static get properties() {
    return {
      /**
       * Whether or not this is default open on render.
       */
      opened: {
        type: Boolean,
        reflect: true
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "opened") {
        // notify
        this.dispatchEvent(
          new CustomEvent("opened-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  /**
   * Toggling collapse on an iron element.
   */
  collapseToggle(e) {
    this.shadowRoot.querySelector("#collapse").toggle();
  }
}
window.customElements.define(
  LrnsysCollapselistItem.tag,
  LrnsysCollapselistItem
);
export { LrnsysCollapselistItem };
