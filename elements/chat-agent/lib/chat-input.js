/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@haxtheweb/simple-cta/simple-cta.js"; // TODO remove if not used
import { ChatAgentModalStore } from "../chat-agent.js";
import { ChatInterface } from "./chat-interface";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";

class ChatInput extends DDD {

  static get tag() {
    return "chat-input";
  }

  constructor() {
    super();
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
          width: 52px;
          height: 52px;
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
  render() {
    return html`
      <div class="chat-input-wrapper">
        <textarea name="prompt-input" id="user-input" placeholder="${ChatAgentModalStore.promptPlaceholder}" @keypress=${this.handleKeyPress}></textarea>
        <div class="send-button" @click=${this.handleSendButton} tabindex="0">
          <simple-icon-lite icon="icons:send"></simple-icon-lite>
        </div>
      </div>
    `;
  }
  
  /**
   * @description handles key presses enter and shift + enter
   */
  handleKeyPress(e) {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      this.handleSendButton();
    }

    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  /**
   * @description handles "send" events, writing entered prompt to chat log
   */
  handleSendButton() {
    const INPUTTED_PROMPT = this.shadowRoot.querySelector("#user-input").value;

    if (ChatAgentModalStore.promptCharacterLimit > 0 && INPUTTED_PROMPT.length > ChatAgentModalStore.promptCharacterLimit) { // ensures prompt is within character limit, even if user changes "maxlength" attribute in dev tools
      alert(`Please shorten your prompt to no more than ${ChatAgentModalStore.promptCharacterLimit} characters.`)
    }

    if (INPUTTED_PROMPT !== "") {
      ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Send button activated. Prompt to send: ' + INPUTTED_PROMPT) : null;

      ChatAgentModalStore.messageIndex++;
      ChatAgentModalStore.userIndex++;

      let date = new Date();

      const chatLogObject = {
        messageID: ChatAgentModalStore.messageIndex,
        author: ChatAgentModalStore.userName,
        message: INPUTTED_PROMPT,
        authorMessageIndex: ChatAgentModalStore.userIndex,
        timestamp: date.toString().replace(/\s/g, '-'),
      }

      ChatAgentModalStore.chatLog.push(chatLogObject);

      // TODO ensure message sent to chat log renders via array map in chat-interface.js, probably an update function


      // TODO Send message to AI for response

      this.shadowRoot.querySelector("#user-input").value = "";

    } else {
      ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Send button activated. No prompt to send') : null;
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    if (ChatAgentModalStore.promptCharacterLimit > 0) {
      this.shadowRoot.querySelector("#user-input").setAttribute("maxlength", `${ChatAgentModalStore.promptCharacterLimit}`);
    }
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

globalThis.customElements.define(ChatInput.tag, ChatInput);
export { ChatInput };