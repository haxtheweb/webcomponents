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
    this.developerModeEnabled = false;
    this.isButtonHiding = false;
    this.isFullView = false; // TODO needs functionality added for this. Becomes true when user enters full mode, and when user is in standard mode
    this.isInterfaceHidden = false; // TODO make it this value is grabbed from the interface rather than being set separately
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


  // TODO: Make all attribute changes occur through chat-agent, making all attributes easier to find and pass through to lower components
  handleChatButton() {
    this.developerModeEnabled ? console.info('HAX-DEV-MODE: Chat button pressed.') : null;
    
    const CHAT_AGENT = document.querySelector(); // TODO modify

    // ! The following is essentiall pseudo-code with the intent of showing how this can work, but element pathes and other aspects will need to be modified for actual test environment
    
    // If being clicked for the first time, start AI, will never be switched back to false unless page is reloaded
    if (!CHAT_AGENT.isAIOpen) { // ? unsure if this will work, may have to switch to .hasAttribute("ai-open")
      CHAT_AGENT.isAIOpen = true;
    }

    // Open or close interface
    CHAT_AGENT.isInterfaceHidden = !CHAT_AGENT.isInterfaceHidden;

    // Hide or show button
    if (CHAT_AGENT.isFullView && !CHAT_AGENT.isInterfaceHidden) {
      CHAT_AGENT.isButtonHidden = true;
    } else {
      CHAT_AGENT.isButtonHidden = false;
    } // TODO: Check if this if-else needs to be moved elsewhere

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
      developerModeEnabled: {
        type: Boolean,
        attribute: "developer-mode",
      },
      isButtonHiding: {
        type: Boolean,
        attribute: "hidden",
      },
      isFullView: {
        type: Boolean,
        attribute: "full-view",
      },
      isInterfaceHidden: {
        type: Boolean,
        attribute: "hiding-interface",
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