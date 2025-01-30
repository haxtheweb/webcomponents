// dependencies / things imported
import { LitElement, html, css } from "lit";
import "./app-hax-wired-toggle.js";
import { SimpleTourFinder } from "@haxtheweb/simple-popover/lib/SimpleTourFinder.js";

// top bar of the UI
export class AppHaxTopBar extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-top-bar";
  }

  constructor() {
    super();
    this.editMode = false;
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
        --top-bar-height: 48px;
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
        border-bottom: 3px solid var(--app-hax-accent-color);
        display: grid;
        grid-template-columns: 32.5% 35% 32.5%;
        transition: border-bottom 0.6s ease-in-out;
      }

      :host([edit-mode]) .topBar {
        border-bottom: 6px solid black;
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
        .topBar .left {
          opacity: 0;
          pointer-events: none;
        }
        .topBar .center {
          text-align: left;
        }
        .topBar .right {
          text-align: left;
        }
        #home {
          display: none;
        }
        app-hax-search-bar {
          display: none;
        }
        .topBar {
          grid-template-columns: 0% 35% 65%;
          display: inline-grid;
        }
      }
    `;
  }

  render() {
    return html`
      <div class="topBar" part="top-bar">
        <div class="left" part="left">
          <slot name="left"></slot>
        </div>
        <div class="center" part="center">
          <slot name="center"></slot>
        </div>
        <div class="right" part="right">
          <slot name="right"></slot>
        </div>
      </div>
    `;
  }
}
customElements.define(AppHaxTopBar.tag, AppHaxTopBar);
