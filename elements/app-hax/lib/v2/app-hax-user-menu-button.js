// TODO: Text-overflow-ellipses

// dependencies / things imported
import { LitElement, html, css } from "lit";

export class AppHaxUserMenuButton extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-user-menu-button";
  }

  constructor() {
    super();
    this.icon = "account-circle";
    this.label = "Default";
  }

  static get properties() {
    return {
      icon: { type: String },
      label: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: "Press Start 2P", sans-serif;
        text-align: center;
        width: 100%;
        --background-color: var(--app-hax-background-color);
        --accent-color: var(--app-hax-accent-color);
      }

      .menu-button {
        display: block;
        width: 100%;
        border: 2px solid var(--accent-color);
        margin: 0;
        padding: 8px;
        font-size: 16px;
        text-align: left;
        color: var(--accent-color);
        background-color: var(--background-color);
        cursor: pointer;
      }

      .menu-button:hover,
      .menu-button:active,
      .menu-button:focus {
        background-color: var(--accent-color);
        color: var(--background-color);
      }

      .icon {
        padding-right: 16px;
      }
    `;
  }

  render() {
    return html`
      <button class="menu-button" part="menu-button">
        <simple-icon-lite class="icon" icon="${this.icon}"></simple-icon-lite
        >${this.label}
      </button>
    `;
  }
}
customElements.define(AppHaxUserMenuButton.tag, AppHaxUserMenuButton);
