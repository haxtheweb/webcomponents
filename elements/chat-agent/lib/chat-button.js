/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class ChatButton extends DDD {

  static get tag() {
    return "chat-button";
  }

  constructor() {
    super();
    this.icon = "hax:wizard-hat";
    this.label = "Chat";
    this.hidingButton = false; // TODO needs functionality added for this. Becomes true when user enters full mode, and when user is in standard mode
    this.hidingInterface = false;
    this.developerModeEnabled = false;
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
          z-index: 999998;
        }

        :host([hidingButton]) {
          display: none;
          /* Will alter to animate it off screen and hiding, unfocusable */
        }

        .chat-button-wrapper {
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          display: flex;
          width: 96px;
          height: 96px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: var(--ddd-radius-lg);
          cursor: pointer;
          box-shadow: var(--ddd-boxShadow-xl);
        }

        .icon-wrapper {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-circle);
          margin-bottom: var(--ddd-spacing-1);
        }

        simple-icon-lite {
          color: var(--data-theme-primary, var(--ddd-primary-13));
          --simple-icon-height: var(--ddd-icon-md);
          --simple-icon-width: var(--ddd-icon-md);
        }

        .label-wrapper {
          padding: var(--ddd-spacing-1);
          background-color: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-potentialMidnight);
          border-radius: var(--ddd-radius-xs);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          max-width: var(--ddd-spacing-19);
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-button-wrapper" @click=${this.handleChatButton} @keypress=${this.keyPress}>
        <div class="icon-wrapper">
          <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
        </div>
        <div class="label-wrapper">
          <slot name="label">${this.label}</slot>
        </div>
      </div>
    `;
  }

  // TODO does not work, don't know why, not priority but should be fixed before PR to main
  keyPress(e) {
    if (e.key === "Enter") {
      if (this.developerModeEnabled) {
        console.info('HAX-DEV-MODE: Chat button pressed using Enter key.');
      }
      this.handleChatButton();
    }
  }

  handleChatButton() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: Chat button pressed.');
    }
  }

  static get properties() {
    return {
      ...super.properties,
      icon: {
        type: String,
      },
      label: {
        type: String,
      },
      hidingButton: {
        type: Boolean,
        attribute: "hide",
      },
      hidingInterface: {
        type: Boolean,
        attribute: "hiding-interface",
      },
      developerModeEnabled: {
        type: Boolean,
        attribute: "developer-mode",
      },
    };
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ChatButton.tag, ChatButton);
export { ChatButton };