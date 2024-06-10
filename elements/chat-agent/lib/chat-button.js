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
    this.buttonIcon = "hax:loading";
    this.buttonLabel = "Chat";
    this.isFullView = false; // TODO needs functionality added for this. Becomes true when user enters full mode, and when user is in standard mode
    this.isInterfaceHidden = false; // TODO make it this value is grabbed from the interface rather than being set separately
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

        .chat-button-wrapper[full-view][hiding-interface = "false"]  {
          display: none;
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

  // TODO might need to switch to key down
  render() {
    return html`
      <div class="chat-button-wrapper" @click=${this.handleChatButton} @keypress=${this.keyPress}>
        <div class="icon-wrapper">
          <simple-icon-lite icon="${this.buttonIcon}"></simple-icon-lite>
        </div>
        <div class="label-wrapper">
          <slot name="label">${this.buttonLabel}</slot>
        </div>
      </div>
    `;
  }

  // TODO does not work, don't know why, not priority but should be fixed before PR to main
  keyPress(e) {
    if (e.key === "Enter") {
      this.developerModeEnabled ? console.info('HAX-DEV-MODE: Chat button pressed using Enter key.') : null;
      e.preventDefault();
      this.handleChatButton();
    }
    
  }

  /*
    TODO:
    * Check if chat interface is open, if not, open it
    * Flip hidden state.
    * Add developer mode console statements
  */

  // TODO: Make all attribute changes occur through chat-agent, making all attributes easier to find and pass through to lower components
  handleChatButton() {
    const CHAT_INTERFACE = document.querySelector("chat-agent").shadowRoot().querySelector("chat-interface"); // TODO doesn't work right now, need to find a fix
    
    this.developerModeEnabled ? console.info('HAX-DEV-MODE: Chat button pressed.') : null;

    if (CHAT_INTERFACE.isOpen === false) {
      CHAT_INTERFACE.isOpen = true; // loads AI
      CHAT_INTERFACE.isHidden = false; // removes interface from hiding
      this.isInterfaceHidden = false;
    } else {
      if (CHAT_INTERFACE.isHidden === true) {
        CHAT_INTERFACE.isHidden = false;
        this.isInterfaceHidden = false;
      } else {
        CHAT_INTERFACE.isHidden = true;
        this.isInterfaceHidden = true;
      }
    }

  }

  static get properties() {
    return {
      ...super.properties,
      buttonIcon: {
        type: String,
        attribute: "icon",
      },
      buttonLabel: {
        type: String,
        attribute: "label",
      },
      isFullView: {
        type: Boolean,
        attribute: "full-view",
      },
      isInterfaceHidden: {
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