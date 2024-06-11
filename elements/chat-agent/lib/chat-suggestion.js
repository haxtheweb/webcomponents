/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class ChatSuggestion extends DDD {
  
  static get tag() {
    return "chat-suggestion";
  }

  constructor() {
    super();
    this.developerModeEnabled = false;
    this.disabled = false;
    this.engine = "alfred";
    this.suggestion = ""; 
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          display: block;
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

        .chat-suggestion-wrapper:hover, .chat-suggestion-wrapper:focus {
          background-color: var(--ddd-theme-default-futureLime);
        }

        .chat-suggestion-wrapper:hover p, .chat-suggestion-wrapper:focus p {
          text-decoration: underline;
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

  // ! slot has to be this way as it makes it easier to both dynamically create this tag using .setAttribute(), as well as grabbing the variable for other purposes
  render() {
    return html`
      <div class="chat-suggestion-wrapper" @click=${this.handleSuggestion}>
        <p class="chat-suggestion">
          <slot>${this.suggestion}</slot>
        </p>  
      </div>
    `;
  }

  handleSuggestion() {
    this.developerModeEnabled ? console.info('HAX-DEV-MODE: Suggestion button pressed. Suggested prompt to send to Merlin: ' + this.suggestion) : null;

    // send user chat-messaage with a suggested-prompt attribute

    
    // write message to chat log while signifying in the chat log that the message is a suggestion


    // Send message to AI for response
  }

  static get properties() {
    return {
      ...super.properties,
      developerModeEnabled: { 
        type: Boolean, 
        attribute: "developer-mode",
      },
      disabled: { type: Boolean },
      engine: { type: String },
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