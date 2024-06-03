/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

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
          border-radius: 100%;
          width: var(--ddd-spacing-18);
          height: var(--ddd-spacing-18);
        }

        simple-icon-lite {
          color: var(--data-theme-primary, var(--ddd-primary-13));
          --simple-icon-height: var(--ddd-spacing-12);
          --simple-icon-width: var(--ddd-spacing-12);
        }

        .message-content {
          color: black;
          border: var(--ddd-border-md);
          border-color: var(--ddd-theme-default-potentialMidnight);
          border-radius: 8px;
          padding: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-0);
          width: 80%;
        }

      `
    ];
  }

  render() {
    return html`
      <div class="chat-message-wrapper">
        ${this.isSentMessage ? this.sentMessage() : this.receivedMessage()}
      </div>
    `;
  }

  receivedMessage() {
    return html`
      <div class="received-chat-message">
        <div class="author-icon">
          <simple-icon-lite icon="hax:wizard-hat"></simple-icon-lite>
        </div>
        <p class="message-content">
          <slot name="message">${this.message}</slot>
        </p>
      </div>
    `;
  }

  sentMessage() {
    return html`
      <div class="sent-chat-message">
        <p class="message-content">
          <slot name="message">${this.message}</slot>
        </p>
        <div class="author-icon">
          <rpg-character seed="${this.author}"></rpg-character>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,

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