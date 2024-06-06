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
    this.developerModeEnabled = false;
    this.engine = "alfred";
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
          font-family: var(--ddd-font-primary);
        }

        .chat-input-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        }

        #user-input {
          border-radius: var(--ddd-radius-lg);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background-color: var(--ddd-theme-default-white);
          color: #000;
          resize: none;
          scrollbar-width: none;
          width: 85%;
        }

        .send-button {
          width: var(--ddd-spacing-13);
          height: var(--ddd-spacing-13);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        simple-icon-lite {
          color: var(
            --lowContrast-override,
            var(--ddd-theme-bgContrast, white)
          );
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-input-wrapper">
        <textarea name="" id="user-input" placeholder="${this.placeholder}"></textarea>
        <div class="send-button" @click=${this.handleSendButton}>
          <simple-icon-lite icon="icons:send"></simple-icon-lite>
        </div>
      </div>
    `;
  }

  handleSendButton() {
    const INPUTTED_PROMPT = this.shadowRoot.querySelector("#user-input").value

    this.developerModeEnabled ? console.info('HAX-DEV-MODE: Send button pressed. Prompt to send: ' + INPUTTED_PROMPT) : null;

    // TODO send the prompt to merlin engine

    this.shadowRoot.querySelector("#user-input").value = "";
  }

  // TODO when user presses SHIFT+ENTER, call handleSendButton()

  static get properties() {
    return {
      ...super.properties,
      placeholder: {
        type: String,
      },
      developerModeEnabled: {
        type: Boolean,
        attribute: "developer-mode",
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

globalThis.customElements.define(ChatInput.tag, ChatInput);
export { ChatInput };