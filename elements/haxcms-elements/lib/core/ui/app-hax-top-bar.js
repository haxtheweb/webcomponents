// dependencies / things imported
import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// top bar of the UI
export class AppHaxTopBar extends I18NMixin(LitElement) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-top-bar";
  }

  constructor() {
    super();
    this.editMode = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      applicationHeader: "Application header",
      navigationAndHome: "Navigation and home",
      mainActions: "Main actions",
      userControls: "User controls",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
    };
  }

  static get styles() {
    return css`
      :host {
        --bg-color: var(--app-hax-background-color);
        --accent-color: var(--app-hax-accent-color);
        --top-bar-height: 64px;
        display: block;
        height: var(--top-bar-height);
      }

      /* @media (prefers-color-scheme: dark) {
        :root {
          --accent-color: white;
          color: var(--accent-color);
          
        }

        :host {
          background-color: black;
        } 
      } */

      .topBar {
        overflow: hidden;
        background-color: var(--bg-color);
        color: var(--accent-color);
        height: var(--top-bar-height);
        text-align: center;
        vertical-align: middle;
        border-bottom: 2px solid var(--app-hax-accent-color);
        display: grid;
        grid-template-columns: 32.5% 35% 32.5%;
        transition: border-bottom var(--ddd-duration-slow, 0.6s) ease-in-out;
      }

      /* .topBar > div {
        background-color: rgba(255, 255, 255, 0.8);
        border: 1px solid black;
      } */

      .topBar .left {
        text-align: left;
        height: var(--top-bar-height);
        vertical-align: text-top;
      }

      .topBar .center {
        text-align: center;
        height: var(--top-bar-height);
        vertical-align: text-top;
      }

      .topBar .right {
        text-align: right;
        height: var(--top-bar-height);
        vertical-align: text-top;
      }
      @media (max-width: 640px) {
        #home {
          display: none;
        }
      }
    `;
  }

  render() {
    return html`
      <div
        class="topBar"
        part="top-bar"
        role="banner"
        aria-label="${this.t.applicationHeader}"
      >
        <div class="left" part="left" aria-label="${this.t.navigationAndHome}">
          <slot name="left"></slot>
        </div>
        <div class="center" part="center" aria-label="${this.t.mainActions}">
          <slot name="center"></slot>
        </div>
        <div class="right" part="right" aria-label="${this.t.userControls}">
          <slot name="right"></slot>
        </div>
      </div>
    `;
  }
}
customElements.define(AppHaxTopBar.tag, AppHaxTopBar);
