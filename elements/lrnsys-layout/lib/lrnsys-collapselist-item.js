import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-collapse/iron-collapse.js";
/**
`lrnsys-collapselist-item`


* @demo demo/index.html
*/
class LrnsysCollapselistItem extends PolymerElement {
  static get template() {
    return html`
      <style>
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
      </style>
      <paper-button
        on-tap="collapseToggle"
        id="collapse-trigger"
        aria-controls="collapse"
      >
        <span class="collapse-label"> <slot name="label"></slot> </span>
      </paper-button>
      <iron-collapse id="collapse" opened="{{opened}}">
        <div class="collapse-content"><slot name="content"></slot></div>
      </iron-collapse>
    `;
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
        value: false,
        reflectToAttribute: true,
        notify: true
      }
    };
  }

  /**
   * Toggling collapse on an iron element.
   */
  collapseToggle(e) {
    this.$.collapse.toggle();
  }
}
window.customElements.define(
  LrnsysCollapselistItem.tag,
  LrnsysCollapselistItem
);
export { LrnsysCollapselistItem };
