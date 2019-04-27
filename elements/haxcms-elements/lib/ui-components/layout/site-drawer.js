/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `site-drawer`
 * `Basic off canvas drawer element`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteDrawer extends PolymerElement {
  constructor() {
    super();
    import("@polymer/app-layout/app-drawer/app-drawer.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
  }
  static get template() {
    return html`
      <style>
        app-drawer {
          --app-drawer-width: var(--site-drawer-width, 300px);
          --app-drawer-content-container: {
            background-color: #eeeeee;
          }
          @apply --site-drawer-drawer;
        }
        .drawer-contents {
          height: 100%;
          overflow-y: auto;
          padding: 16px;
          @apply --site-drawer-drawer-content;
        }
        paper-icon-button {
          color: var(--site-drawer-button-color, #ffffff);
          @apply --site-drawer-button;
        }
      </style>
      <paper-icon-button icon="[[icon]]" on-tap="toggle"></paper-icon-button>
      <app-drawer align="[[align]]">
        <div class="drawer-contents"><slot></slot></div>
      </app-drawer>
    `;
  }
  toggle(e) {
    this.shadowRoot.querySelector("app-drawer").toggle();
  }
  static get tag() {
    return "site-drawer";
  }
  static get properties() {
    return {
      align: {
        type: String,
        value: "right"
      },
      icon: {
        type: String,
        value: "menu"
      }
    };
  }
}
window.customElements.define(SiteDrawer.tag, SiteDrawer);
export { SiteDrawer };
