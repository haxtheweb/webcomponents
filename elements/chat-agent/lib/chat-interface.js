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
    
    this.enableDeveloperPanel = false;
    this.isAIOpen = false;
    this.isFullView = false;
    this.isInterfaceHidden = false;
    this.promptPlaceholder = "Type a message...";

    // TODO: possible add developer option to toggle whether fading is enabled
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

  render() {
    return html`
      <div class="chat-interface-wrapper">
        <div class="chat-wrapper">
          ${this.enableDeveloperPanel ? html`
            <div class="developer-panel-wrapper">
              <chat-developer-panel></chat-developer-panel>
            </div>
          ` : ''}
          <div class="main-wrapper">
            ${this.enableDeveloperPanel ? html`
              <chat-control-bar developer-mode></chat-control-bar>
            ` : html`
              <chat-control-bar></chat-control-bar>
            `}
            
            <div class="chat-container">
              <div class="chat-messages">
                <chat-message author="merlin-ai" message="Hello! My name is Merlin. How can I help you today?" suggested-prompts></chat-message>
                <chat-message sent-message message="Hi Merlin! I could use some help with programming."></chat-message>
                <chat-message author="merlin-ai" message="Certainly. I love programming! This is some extra text to ensure that this message is extra long to show how the chat message text will wrap."></chat-message>
                <chat-message sent-message message="This last message will cause the chat to scroll."></chat-message>
              </div>
              ${this.enableDeveloperPanel ? html`
                <chat-input placeholder="${this.promptPlaceholder}" developer-mode></chat-input>
              ` : html`
                <chat-input placeholder="${this.promptPlaceholder}"></chat-input>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      enableDeveloperPanel: {
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