import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/app-layout/app-layout.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-collapse/iron-collapse.js";
import "./lrnsys-collapselist-item.js";
/**
 * `lrnsys-collapselist`
 */
class LrnsysCollapselist extends PolymerElement {
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
          background-color: var(--simple-colors-background1);
          --lrnsys-collapselist-text-color: var(--simple-colors-foreground1);
          --lrnsys-collapselist-item-color: var(--simple-colors-background1);
          --lrnsys-collapselist-item-active-color: var(
            --simple-colors-background2
          );
          --lrnsys-collapselist-item-border: var(--simple-colors-background5);
        }
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        ul li {
          width: 100%;
          border: 1px solid var(--lrnsys-collapselist-item-border);
          margin-bottom: -1px;
        }
        ul li paper-button {
          height: 32px;
          padding: 8px;
          margin: 0;
          min-width: 0.16px;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          text-transform: unset;
          border-radius: 0;
        }
        ul li paper-button iron-icon,
        ul li paper-button span {
          pointer-events: none;
        }
        iron-icon {
          display: inline-block;
        }
        .collapse-label {
          margin-left: 8px;
        }
        .collapse-content {
          padding: 16px;
        }
      </style>
      <ul>
        <template is="dom-repeat" items="[[items]]" as="row">
          <li>
            <lrnsys-collapselist-item>
              <span slot="label">
                <iron-icon icon="[[row.icon]]"></iron-icon>
                <span class="collapse-label">[[row.label]]</span>
              </span>
              <span slot="content"> [[row.content]] </span>
            </lrnsys-collapselist-item>
          </li>
        </template>
      </ul>
    `;
  }
  static get tag() {
    return "lrnsys-collapselist";
  }

  static get properties() {
    return {
      /**
       * Array of items to present with label and content for the list of collapses.
       */
      items: {
        type: Array
      }
    };
  }
}
window.customElements.define(LrnsysCollapselist.tag, LrnsysCollapselist);
export { LrnsysCollapselist };
