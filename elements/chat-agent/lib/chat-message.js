/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@haxtheweb/type-writer/type-writer.js";
import { ChatAgentModalStore } from "../chat-agent.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";
import { autorun, toJS, } from "mobx";

class ChatMessage extends DDD {

  static get tag() {
    return "chat-message";
  }

  constructor() {
    super();

    this.hasSuggestedPrompts = false; // may be removed by by checking the length of this.suggestedPrompts
    this.isSentPrompt = false;
    this.message = "";
    this.messageWasSuggestedPrompt = false; 
    this.suggestedPrompts = ChatAgentModalStore.currentSuggestions; // needs to remain this way that way it doesn't update.
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
          container-type: inline-size;
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
          /* gap: var(--ddd-spacing-1); */
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
          gap: var(--ddd-spacing-3);
          justify-content: center;
          padding-top: var(--ddd-spacing-2);
        }

        @container (max-width: 190px) {
          .author-icon {
            display: none;
          }

          .received-chat-message .message-content {
            background: rgba(73, 29, 112, 0.1);
          }

          .message {
            display: flex;
            justify-content: center;
            align-items: center;
          }
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
        <div class="suggested-prompts">
          ${this.suggestedPrompts.map((suggestion) => html`
            <chat-suggestion suggestion="${suggestion}" @click=${this.disableSuggestions} @keypress=${this.disableSuggestions}></chat-suggestion>
          `)}
        </div>
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

  /**
   * @description Disables the suggestions after one is clicked
   * @param {Event} e - click
   */
  disableSuggestions(e) {
    const SUGGESTIONS = this.shadowRoot.querySelectorAll("chat-suggestion");

    SUGGESTIONS.forEach((suggestion) => {
      if (!suggestion.hasAttribute("disabled")) {
        suggestion.setAttribute("disabled", "");
      }
    });

    if (!e.currentTarget.hasAttribute("chosen-prompt")) {
      let existingChosenPrompt = false;
      SUGGESTIONS.forEach((suggestion) => {
        if (suggestion.hasAttribute("chosen-prompt")) {
          existingChosenPrompt = true;
        }
      })

      if (!existingChosenPrompt) {
        e.currentTarget.setAttribute("chosen-prompt", "");
      }
    }
  }

  static get properties() {
    return {
      ...super.properties,
      hasSuggestedPrompts: {
        type: Boolean,
        attribute: "suggested-prompts",
      },
      isSentPrompt: {
        type: Boolean,
        attribute: "sent-prompt",
      },
      message: {
        type: String,
      },
      messageWasSuggestedPrompt: {
        type: Boolean,
        attribute: "suggested-message",
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