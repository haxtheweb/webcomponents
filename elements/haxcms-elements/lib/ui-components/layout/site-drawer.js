/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
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
        :host {
          display: block;
        }
        .drawer-contents {
          height: 100%;
          overflow-y: auto;
          padding: var(--ddd-spacing-4);
        }
        simple-icon-button-lite {
          color: var(--site-drawer-button-color, var(--ddd-theme-default-white));
        }
        .drawer {
          position: fixed;
          top: 0;
          width: var(--site-drawer-width, 300px);
          height: 100vh;
          overflow-y: auto;
          background-color: var(--site-drawer-background-color, var(--ddd-theme-default-limestoneLight));
          z-index: 1000000;
          transition: transform 0.3s ease;
          box-shadow: var(--ddd-boxShadow-sm);
        }
        .drawer.left {
          left: 0;
          transform: translateX(-100%);
        }
        .drawer.right {
          right: 0;
          transform: translateX(100%);
        }
        .drawer.opened {
          transform: translateX(0);
        }
        .scrim {
          display: block;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .scrim.opened {
          opacity: 1;
          pointer-events: auto;
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
    this.opened = false;
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html`
      <simple-icon-button-lite
        icon="${this.icon}"
        @click="${this.toggle}"
      ></simple-icon-button-lite>
      <div class="scrim ${this.opened ? 'opened' : ''}" @click="${this.close}"></div>
      <div class="drawer ${this.align} ${this.opened ? 'opened' : ''}" aria-hidden="${!this.opened}">
        <div class="drawer-contents"><slot></slot></div>
      </div>
    `;
  }
  toggle(e) {
    this.opened = !this.opened;
  }
  close(e) {
    this.opened = false;
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
      opened: {
        type: Boolean,
        reflect: true,
      },
    };
  }
}
globalThis.customElements.define(SiteDrawer.tag, SiteDrawer);
export { SiteDrawer };
