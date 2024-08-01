/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@haxtheweb/type-writer/type-writer.js";
import { ChatStore } from "./chat-agent-store.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS, } from "mobx";
import { html, css } from "lit";

class ChatMessage extends DDD {

  static get tag() {
    return "chat-message";
  }

  constructor() {
    super();

    this.darkMode = null;
    this.editMode = null;

    this.hasSuggestedPrompts = false; // may be removed by by checking the length of this.suggestedPrompts
    this.isSentPrompt = false;
    this.message = "";
    this.messageWasSuggestedPrompt = false; 
    this.suggestedPrompts = ChatStore.currentSuggestions; // needs to remain this way that way it doesn't update.

    autorun(() => {
      this.darkMode = toJS(ChatStore.darkMode);
      this.editMode = toJS(ChatStore.editMode);
    })
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          container-type: inline-size;
          display: block;
        }

        .chat-message-wrapper {
          border-bottom-style: dashed;
          border-bottom: var(--ddd-border-md);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        }

        .sent-chat-message, .message {
          align-items: center;
          display: flex;
          flex-direction: row;
          gap: var(--ddd-spacing-3);
        }

        .received-chat-message {
          display: flex;
          flex-direction: column;
        }

        .author-icon {
          align-items: center;
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-md);
          border-color: var(--ddd-theme-default-coalyGray);
          display: flex;
          height: var(--ddd-spacing-18);
          justify-content: center;
          width: var(--ddd-spacing-18);
        }

        :host([dark-mode]) .author-icon {
          border-color: var(--ddd-theme-default-slateGray);
        }

        .received-chat-message .author-icon {
          border-radius: var(--ddd-radius-xl);
        }

        simple-icon-lite {
          color: var(--data-theme-primary, var(--ddd-primary-13));
          --simple-icon-height: var(--ddd-icon-md);
          --simple-icon-width: var(--ddd-icon-md);
        }

        rpg-character {
          height: var(--ddd-spacing-12);
          margin-bottom: var(--ddd-spacing-3);
          width: var(--ddd-spacing-12);
        }

        .message-content {
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-md);
          border-color: var(--ddd-theme-default-coalyGray);
          color: var(--ddd-theme-default-coalyGray);
          font: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-2);
          width: 80%;
        }

        :host([dark-mode]) .message-content {
          border-color: var(--ddd-theme-default-slateGray);
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-coalyGray);
        }

        .suggested-prompts {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          justify-content: center;
          padding-top: var(--ddd-spacing-3);
        }

        @container (max-width: 190px) {
          .author-icon {
            display: none;
          }

          .received-chat-message .message-content {
            background: rgba(73, 29, 112, 0.1);
          }

          .message {
            align-items: center;
            display: flex;
            justify-content: center;
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
          <type-writer class="message-content" text="${this.message}" speed="${ChatStore.merlinTypeWriterSpeed}"></type-writer>
        </div>
        <div class="suggested-prompts">
          ${this.suggestedPrompts.map((suggestion) => html`
            <chat-suggestion suggestion="${suggestion.suggestion}" prompt-type="${suggestion.type}" @click=${this.disableSuggestions} @keypress=${this.disableSuggestions}></chat-suggestion>
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
         <p class="message-content">${this.message}</p>
        <div class="author-icon">
          <rpg-character seed="${ChatStore.userName}"></rpg-character>
        </div>
      </div>
    `;
  }

  firstUpdated() {

    this.pickHat();
  }

  pickHat() {
    let hat;

    if (ChatStore.month === 2 && ChatStore.day === 12) {
      hat = "party";
    } else if (ChatStore.month === 6 && ChatStore.day === 6) { // Closest I could get for a consistent "cowboy" day. If you get the reference then that's awesome
      hat = "cowboy";
    } else if (ChatStore.month === 7 && ChatStore.day === 27) { // Birthday of a famous cartoon "wabbit"
      hat = "bunny";
    } else if (ChatStore.month === 8 && ChatStore.day === 15) { // International Watermelon Day
      hat = "watermelon"
    } else if (ChatStore.month === 9 && ChatStore.day === 19) { // International Talk Like a Pirate Day
      hat = "pirate"
    } else if (ChatStore.month === 10 && ChatStore.day === 1) { // International Coffee Day
      hat ="coffee";
    } else if (ChatStore.month === 10 && ChatStore.day === 5) { // International Teacher Day
      hat = "education"
    } else if (ChatStore.month === 12 && ChatStore.day === 5) { // Day of the Ninja
      hat = "ninja"
    } else if (ChatStore.month === 12 && ChatStore.day === 18) { // Fellowship of the Ring founded
      hat = "knight"
    } else {
      hat = "none";
    }

    if (this.editMode) hat = "construction";

    this.shadowRoot.querySelector("rpg-character").setAttribute("hat", hat);
  }

  /**
   * @description Disables the suggestions after one is clicked
   * @param {Event} e - click
   */
  disableSuggestions(e) {
    const SUGGESTIONS = this.shadowRoot.querySelectorAll("chat-suggestion");

    ChatStore.devStatement("Disabling previous suggestions.", "info");

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
      darkMode: {
        type: Boolean,
        attribute: "dark-mode",
        reflect: true,
      },
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