/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
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
        paper-icon-button {
          color: var(--site-drawer-button-color, #ffffff);
        }
      `
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.align = "right";
    this.icon = "menu";
    import("@polymer/app-layout/app-drawer/app-drawer.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html`
      <custom-style>
        <style>
          app-drawer {
            --app-drawer-width: var(--site-drawer-width, 300px);
            --app-drawer-content-container: {
              background-color: #eeeeee;
            }
            @apply --site-drawer-drawer;
          }
          .drawer-contents {
            @apply --site-drawer-drawer-content;
          }
          paper-icon-button {
            @apply --site-drawer-button;
          }
        </style>
      </custom-style>
      <paper-icon-button
        icon="${this.icon}"
        @click="${this.toggle}"
      ></paper-icon-button>
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
        type: String
      },
      icon: {
        type: String
      }
    };
  }
}
window.customElements.define(SiteDrawer.tag, SiteDrawer);
export { SiteDrawer };
