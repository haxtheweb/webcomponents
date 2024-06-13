/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-cta/simple-cta.js"; // TODO remove if not used

class ChatInput extends DDD {

  static get tag() {
    return "chat-input";
  }

  constructor() {
    super();

    this.characterLimit;
    this.developerModeEnabled = false; // set by chat-agent.js
    this.engine = "alfred"; // set by chat-agent.js
    this.promptPlaceholder = "Type text here..."; // set by chat-agent.js
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

  // TODO change the send button to simple-cta, will have to ensure coloring works properly.
  // TODO set maxlength attribute on text area, ask Dave what the character limit is
  render() {
    return html`
      <div class="chat-input-wrapper">
        <textarea name="" id="user-input" placeholder="${this.promptPlaceholder}" @keypress=${this.handleKeyPress}></textarea>
        <div class="send-button" @click=${this.handleSendButton} tabindex="0">
          <simple-icon-lite icon="icons:send"></simple-icon-lite>
        </div>
      </div>
    `;
  }
  
  handleKeyPress(e) {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      this.handleSendButton();
    }
  }

  handleSendButton() {
    const INPUTTED_PROMPT = this.shadowRoot.querySelector("#user-input").value;
    // TODO may need to format this variable (change it to let) to make it modifiable.

    // TODO if prompt has character amount greater than character length, alert user that they need to shorten their prompt (this is in case the user goes into browser dev tools and changes maxlength attribute)

    if (INPUTTED_PROMPT !== "") {
      this.developerModeEnabled ? console.info('HAX-DEV-MODE: Send button activated. Prompt to send: ' + INPUTTED_PROMPT) : null;

      // TODO write message to chat log, which should update the interface to make it appear via Array Map

      // TODO send the prompt to merlin engine, write response to chat log which will update interface via Array Map

      this.shadowRoot.querySelector("#user-input").value = "";
    } else {
      this.developerModeEnabled ? console.info('HAX-DEV-MODE: Send button activated. No prompt to send') : null;
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    if (this.characterLimit > 0) {
      this.shadowRoot.querySelector("#user-input").setAttribute("maxlength", this.characterLimit);
    }
  }

  static get properties() {
    return {
      ...super.properties,
      characterLimit: { 
        type: Number,
        attribute: "maxlength",
      },
      developerModeEnabled: {
        type: Boolean,
        attribute: "developer-mode",
      },
      engine: { type: String },
      promptPlaceholder: {
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

globalThis.customElements.define(ChatInput.tag, ChatInput);
export { ChatInput };