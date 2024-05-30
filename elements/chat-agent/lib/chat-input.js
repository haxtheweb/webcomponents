/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class ChatInput extends DDD {

  static get tag() {
    return "chat-input";
  }

  constructor() {
    super();
    this.placeholder = "Type text here...";
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
        }

        .chat-input-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        #user-input {
          border-radius: 15px;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background-color: var(--ddd-theme-default-white);
          color: #000;
          resize: none;
          scrollbar-width: none;
          width: 75%;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-input-wrapper">
        <textarea name="" id="user-input" placeholder="${this.placeholder}"></textarea>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      placeholder: {
        type: String,
      }
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

globalThis.customElements.define(ChatInput.tag, ChatInput);
export { ChatInput };