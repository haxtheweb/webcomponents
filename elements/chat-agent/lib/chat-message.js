/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@haxtheweb/type-writer/type-writer.js";
import { ChatAgentModalStore } from "../chat-agent";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";

class ChatMessage extends DDD {

  static get tag() {
    return "chat-message";
  }

  constructor() {
    super();

    this.hasSuggestedPrompts = false;
    this.isSentPrompt = false;
    this.message = "";
    this.messageWasSuggestedPrompt = false; 
    this.suggestionsDisabled = false;
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
          border-bottom: var(--ddd-border-md);
          border-bottom-style: dashed;
        }

        .sent-chat-message, .message {
          display: flex;
          flex-direction: row;
          gap: var(--ddd-spacing-3);
          align-items: center;
        }

        .received-chat-message {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
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
          font-size: var(--ddd-font-size-4xs);
        }

        .suggested-prompts {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-5);
          justify-content: center;
        }
      `
    ];
  }

  /**
   * @description Render chat message
   */
  render() {
    return html`
      <div class="chat-message-wrapper">
        ${this.isSentPrompt ? this.renderSentMessage() : this.renderReceivedMessage()}
      </div>
    `;
  }

  // TODO want the chat-suggestions to load after the type-writer is done writing out the text
  // TODO remove the this.hasSuggestedPrompts ternary operator when moving out of demo phase, leave .suggested-prompts
  // TODO chat suggestions should be rendered using Array Map maybe?
  /**
   * @description Renders a message recevied from Merlin-AI
   */
  renderReceivedMessage() {
    return html`
      <div class="received-chat-message">
        <div class="message">
          <div class="author-icon">
            <simple-icon-lite icon="hax:wizard-hat"></simple-icon-lite>
          </div>
          <type-writer class="message-content" text="${this.message}" speed="${ChatAgentModalStore.merlinTypeWriterSpeed}"></type-writer>
        </div>
        ${this.hasSuggestedPrompts ? html`
          <div class="suggested-prompts">
            <chat-suggestion suggestion="This is a suggestion" @click=${this.disableSuggestions} @keypress=${this.disableSuggestions}></chat-suggestion>
            <chat-suggestion suggestion="This is a second suggestion" @click=${this.disableSuggestions} @keypress=${this.disableSuggestions}></chat-suggestion>
            <chat-suggestion suggestion="This is a longer suggestion because testing weeeeeee" @click=${this.disableSuggestions} @keypress=${this.disableSuggestions}></chat-suggestion>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * @description Renders a message sent by the end user
   */
  renderSentMessage() {
    return html`
      <div class="sent-chat-message">
        <type-writer class="message-content" speed="${ChatAgentModalStore.userTypeWriterSpeed}" text="${this.message}"></type-writer>
        <div class="author-icon">
          <rpg-character seed="${ChatAgentModalStore.userName}"></rpg-character>
        </div>
      </div>
    `;
  }

  disableSuggestions(e) {
    if (!this.suggestionsDisabled) {
      const SUGGESTIONS = this.shadowRoot.querySelectorAll("chat-suggestion");

      SUGGESTIONS.forEach((suggestion) => {
        suggestion.setAttribute("disabled", "");
      });

      e.target.setAttribute("chosen-prompt", "");

      this.suggestionsDisabled = true;
    }
  }

  // TODO ensure properties matches constructor
  static get properties() {
    return {
      ...super.properties,
      developerModeEnabled: {
        type: Boolean,
        attribute: "developer-mode",
      },
      hasSuggestedPrompts: {
        type: Boolean,
        attribute: "suggested-prompts",
      },
      isSentPrompt: {
        type: Boolean,
        attribute: "sent-prompt",
      },
      messageWasSuggestedPrompt: {
        type: Boolean,
        attribute: "suggested-message",
      },
      message: {
        type: String,
      },
      suggestedPrompts: {
        type: Array,
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