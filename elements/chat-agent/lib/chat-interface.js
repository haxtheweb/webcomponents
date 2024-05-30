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
    this.isOpen = false;
    this._isFullView = false;
    this.textAreaPlaceholder = "Type a message...";
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
          z-index: 999999;
        }

        :host([_isFullView]) .chat-interface-wrapper {
          background-color: var(--ddd-theme-default-potentialMidnight);
        }

        .chat-interface-wrapper {
          width: 25%;
          height: 25%;
          background-color: transparent;
        }

        .chat-wrapper {
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          padding: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-sm);
        }

        .chat-container {
          width: 100%;
          height: 100%;
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-sm);
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-interface-wrapper">
        <div class="chat-wrapper">
          <chat-control-bar></chat-control-bar>
          <div class="chat-container">
            <chat-message author="merlin-ai">Hello! My name is Merlin. How can I help you today?</chat-message>
            <chat-input placeholder="${this.textAreaPlaceholder}"></chat-input>
          </div>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      textAreaPlaceholder: {
        type: String,
        attribute: "placeholder",
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