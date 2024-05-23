/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
/**
 * `site-drawer`
 * `Basic off canvas drawer element`
 *

 * @demo demo/index.html
 */
class SiteDrawer extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        .drawer-contents {
          height: 100%;
          overflow-y: auto;
          padding: 16px;
        }
        simple-icon-button {
          color: var(--site-drawer-button-color, #ffffff);
        }
        app-drawer {
          background-color: #eeeeee;
          --app-drawer-scrim-background: #eeeeee;
          --app-drawer-width: var(--site-drawer-width, 300px);
        }
      `,
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.align = "right";
    this.icon = "menu";
    setTimeout(() => {
      import("@polymer/app-layout/app-drawer/app-drawer.js");
    }, 0);
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html`
      <simple-icon-button
        icon="${this.icon}"
        @click="${this.toggle}"
      ></simple-icon-button>
      <app-drawer align="${this.align}">
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
      },
      icon: {
        type: String,
      },
    };
  }
}
customElements.define(SiteDrawer.tag, SiteDrawer);
export { SiteDrawer };
