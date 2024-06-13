/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class ChatInterface extends DDD {

  static get tag() {
    return "chat-interface";
  }

  constructor() {
    super();
    
    this.developerModeEnabled = false; // set by chat-agent.js
    this.isAIOpen = false; // set by chat-agent.js
    this.isFullView = false; // set by chat-agent.js
    this.isInterfaceHidden = false; // set by chat-agent.js
    this.promptPlaceholder = "Type a message..."; // set by chat-agent.js
    this.userName = "guest"; // set by chat-agent.js
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
          z-index: 999999;
          width: 100%;
        }

        :host([isInterfaceHidden]) {
          display: none;
        }

        :host([_isFullView]) .chat-interface-wrapper {
          background-color: var(--ddd-theme-default-potentialMidnight);
        }

        .chat-interface-wrapper {
          background-color: transparent;
        }

        /* Does not work currently */
        :host([isFullView]) .chat-interface-wrapper {
          background-color: var(--ddd-theme-default-potentialMidnight);
          padding: var(--ddd-spacing-2);
        }

        /* TODO make it so when any element within the chat interface is focused, the opacity is 1.0 */
        .chat-wrapper {
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          padding: var(--ddd-spacing-0) var(--ddd-spacing-2) var(--ddd-spacing-2) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-xl);
        }

        :host([enableDeveloperPanel]), .chat-wrapper {
          padding-top: var(--ddd-spacing-1);
        }

        .chat-container {
          width: 100%;
          height: 100%;
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-sm);
        }

        .chat-messages {
          max-height: 300px;
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-width: thin;
        }
      `
    ];
  }

  // TODO chat-message tags should be rendered using array map
  render() {
    return html`
      <div class="chat-interface-wrapper">
        <div class="chat-wrapper">
          ${this.developerModeEnabled ? html`
            <div class="developer-panel-wrapper">
              <chat-developer-panel username="${this.userName}"></chat-developer-panel>
            </div>
          ` : ''}
          <div class="main-wrapper">
            <chat-control-bar></chat-control-bar>
            <div class="chat-container">
              <div class="chat-messages">
                <chat-message author="merlin-ai" message="Hello! My name is Merlin. How can I help you today?" suggested-prompts></chat-message>
                <chat-message sent-prompt author="${this.userName}" message="Hi Merlin! I could use some help with programming."></chat-message>
                <chat-message author="merlin-ai" message="Certainly. I love programming! This is some extra text to ensure that this message is extra long to show how the chat message text will wrap."></chat-message>
                <chat-message sent-prompt author="${this.userName}" message="This last message will cause the chat to scroll."></chat-message>
              </div>
              <chat-input placeholder="${this.promptPlaceholder}"></chat-input>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    const CHAT_CONTROL_BAR = this.shadowRoot.querySelector("chat-control-bar");
    const CHAT_MESSAGE = this.shadowRoot.querySelector("chat-message");
    const CHAT_INPUT = this.shadowRoot.querySelector("chat-input");

    if (this.developerModeEnabled) {
      CHAT_CONTROL_BAR.setAttribute("developer-mode", "");
      CHAT_MESSAGE.setAttribute("developer-mode", "");
      CHAT_INPUT.setAttribute("developer-mode", "");
    }
  }

  static get properties() {
    return {
      ...super.properties,
      developerModeEnabled: {
        type: Boolean,
        attribute: "developer-mode",
      },
      isAIOpen: {
        type: Boolean,
        attribute: "ai-open",
      },
      isFullView: {
        type: Boolean,
        attribute: "full-view",
      },
      isInterfaceHidden: {
        type: Boolean,
        attribute: "hidden",
        },
      promptPlaceholder: {
        type: String,
        attribute: "prompt-placeholder",
      },
      userName: {
        type: String,
        attribute: "username",
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

globalThis.customElements.define(ChatInterface.tag, ChatInterface);
export { ChatInterface };