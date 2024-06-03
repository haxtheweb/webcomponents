/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/type-writer/type-writer.js";

class ChatMessage extends DDD {

  static get tag() {
    return "chat-message";
  }

  constructor() {
    super();
    // TODO suggested prompt disable state

    this.author = "guest";
    this.message = "";
    this.isSentMessage = false;
    this.hasSuggestedPrompts = false;

  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
        }

        .chat-message-wrapper {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        }

        .received-chat-message, .sent-chat-message {
          display: flex;
          flex-direction: row;
          gap: var(--ddd-spacing-3);
        }

        .author-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border: var(--ddd-border-md);
          border-color: var(--ddd-theme-default-potentialMidnight);
          border-radius: var(--ddd-radius-circle);
          width: var(--ddd-spacing-18);
          height: var(--ddd-spacing-18);
        }

        simple-icon-lite {
          color: var(--data-theme-primary, var(--ddd-primary-13));
          --simple-icon-height: var(--ddd-icon-md);
          --simple-icon-width: var(--ddd-icon-md);
        }

        rpg-character {
          width: var(--ddd-spacing-12);
          height: var(--ddd-spacing-12);
          margin-bottom: var(--ddd-spacing-3);
        }

        .message-content {
          color: #000;
          border: var(--ddd-border-md);
          border-color: var(--ddd-theme-default-potentialMidnight);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-0);
          width: 80%;
          font-family: var(--ddd-font-primary);
        }

      `
    ];
  }

  /**
   * Render chat message
   */
  render() {
    return html`
      <div class="chat-message-wrapper">
        ${this.isSentMessage ? this.renderSentMessage() : this.renderReceivedMessage()}
      </div>
    `;
  }

  /**
   * Renders a message recevied from Merlin-AI
   */
  renderReceivedMessage() {
    return html`
      <div class="received-chat-message">
        <div class="author-icon">
          <simple-icon-lite icon="hax:wizard-hat"></simple-icon-lite>
        </div>
        <type-writer class="message-content" text="${this.message}" speed="30"></type-writer>
      </div>
      ${this.hasSuggestedPrompts ? html`
        <div class="suggested-prompts">
          <!-- TODO create suggested prompts component and input samples here -->
        </div>
      ` : ''}
    `;
  }

  /**
   * Renders a message sent by the end user
   */
  renderSentMessage() {
    return html`
      <div class="sent-chat-message">
        <type-writer class="message-content" speed="1" text="${this.message}"></type-writer>
        <div class="author-icon">
          <rpg-character seed="${this.author}"></rpg-character>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      author: {
        type: String,
      },
      message: {
        type: String,
      },
      isSentMessage: {
        type: Boolean,
        attribute: "sent-message",
      },
      hasSuggestedPrompts: {
        type: Boolean,
        attribute: "suggested-prompts",
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

globalThis.customElements.define(ChatMessage.tag, ChatMessage);
export { ChatMessage };