// dependencies / things imported
import { LitElement, html, css } from "lit";
import "./app-hax-wired-toggle.js";

// top bar of the UI
export class AppHaxTopBar extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-top-bar";
  }

  // constructor() {
  //   super();
  // }

  // static get properties() {
  //   return {
  //   };
  // }

  static get styles() {
    return css`
      :host {
        --bg-color: orange;
        --accent-color: white;
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
        font-size: 2vw;

        display: grid;
        grid-template-columns: 30% 40% 30%;
      }
      @media (max-width: 780px) {
        .topBar {
          grid-template-columns: 20% 20% 60%;
        }
      }
      @media (max-width: 600px) {
        .topBar {
          grid-template-columns: 10% 30% 60%;
        }
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
    `;
  }

  render() {
    return html`
      <div class="topBar">
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
