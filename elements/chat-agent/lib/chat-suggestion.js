/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { ChatAgentModalStore } from "../chat-agent";
import { ChatMessage } from "./chat-message";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";

class ChatSuggestion extends DDD {
  
  static get tag() {
    return "chat-suggestion";
  }

  constructor() {
    super();
    
    this.chosenPrompt = false;
    this.disabled = false;
    this.suggestion = "";
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          display: block;
          border-radius: var(--ddd-radius-rounded);
        }

        .chat-suggestion-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--ddd-theme-default-successLight);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-rounded);
          border-color: var(--ddd-theme-default-potentialMidnight);
          opacity: 1.0;
          cursor: pointer;
          box-shadow: var(--ddd-boxShadow-xl);
        }

        /* TODO create CSS that will set background-color to a faded red, along with lower opacity when this.disabled = true */
        :host([disabled]) .chat-suggestion-wrapper {
          background-color: var(--ddd-theme-default-discoveryCoral);
          opacity: 0.6;
          cursor: default;
        }

        /* TODO chosen prompt css sets background color to keystoneYellow */
        :host([chosen-prompt]) .chat-suggestion-wrapper {
          background-color: var(--ddd-theme-default-futureLime);
        }

        .chat-suggestion-wrapper:hover, .chat-suggestion-wrapper:focus {
          background-color: var(--ddd-theme-default-futureLime);
        }

        .chat-suggestion-wrapper:hover p, .chat-suggestion-wrapper:focus p {
          text-decoration: underline;
        }
        
        :host([disabled]) p {
          text-decoration: none;
        }

        p {
          color: var(--ddd-theme-default-potentialMidnight);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          width: 80%;
          text-align: center;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-suggestion-wrapper" @click=${this.handleSuggestion} @keypress=${this.handleSuggestion} tabindex="0">
        <p class="chat-suggestion">
          ${this.suggestion}
        </p>  
      </div>
    `;
  }

  /**
   * @description Event handler for the suggestion button
   */
  handleSuggestion() {
    if (!this.disabled) {
      ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Suggestion button pressed. Suggested prompt to send to Merlin: ' + this.suggestion) : null;
      
      // TODO replace code below with handleMessages()
      ChatAgentModalStore.messageIndex++;
      ChatAgentModalStore.userIndex++;
  
      let date = new Date();
      let dateString = date.toString().replace(/\s/g, '-');
      
      const chatLogObject = {
        messageID: ChatAgentModalStore.messageIndex,
        author: ChatAgentModalStore.userName,
        message: this.suggestion,
        authorMessageIndex: ChatAgentModalStore.userIndex,
        timestamp: dateString,
      }
  
      ChatAgentModalStore.chatLog.push(chatLogObject);
  
      // TODO Send message to AI for response
    } else {
      ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Suggestion buttons disabled, ignoring request') : null;
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }

    if (this.disabled) {
      this.shadowRoot.querySelector(".chat-suggestion-wrapper").removeAttribute("tabindex");
    }
  }

  static get properties() {
    return {
      ...super.properties,
      chosenPrompt: {
        type: Boolean,
        attribute: "chosen-prompt",
      },
      disabled: { type: Boolean },
      suggestion: { type: String },
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

globalThis.customElements.define(ChatSuggestion.tag, ChatSuggestion);
export { ChatSuggestion };