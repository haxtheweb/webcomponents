import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "../elmsln-base-deps.js";
class LrnappStudioBlock extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-size: 12px;
        }
        .studio-block__header {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border: 1px solid lightgray;
          border-bottom: none;
        }
        .studio-block__content {
          padding: 0 16px;
          border: 1px solid lightgray;
        }
        .studio-block__icon-wrapper {
          width: 32px;
        }
        .studio-block__header h3 {
          margin: 0;
          font-style: none;
          font-size: inherit;
        }
      </style>
      <div class="studio-block__header">
        <div class="studio-block__icon-wrapper">
          <simple-icon icon="[[icon]]" hidden$="[[!icon]]"></simple-icon>
        </div>
        <h3 hidden$="[[!title]]">[[title]]</h3>
      </div>
      <div class="studio-block__content"><slot></slot></div>
    `;
  }

  static get tag() {
    return "lrnapp-studio-block";
  }
  static get properties() {
    return {
      title: {
        type: String,
        value: null,
      },
      icons: {
        type: String,
        value: null,
      },
    };
  }
}
window.customElements.define(LrnappStudioBlock.tag, LrnappStudioBlock);
export { LrnappStudioBlock };
