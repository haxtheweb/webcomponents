/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { ChatAgentModalStore } from "../chat-agent.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS, } from "mobx";
import { html, css } from "lit";

class ChatInput extends DDD {

  static get tag() {
    return "chat-input";
  }

  constructor() {
    super();

    this.chatLog = [];
    this.messageIndex = null;
    this.userIndex = null;
    this.previousMessageIndex = null;
    this.userName = null;

    autorun(() => {
      this.chatLog = toJS(ChatAgentModalStore.chatLog);
      this.messageIndex = toJS(ChatAgentModalStore.messageIndex);
      this.userIndex = toJS(ChatAgentModalStore.userIndex);
      this.previousMessageIndex = toJS(this.messageIndex - 1);
      this.userName = toJS(ChatAgentModalStore.userName);
    })
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
          align-items: center;
          display: flex;
          gap: var(--ddd-spacing-3);
          justify-content: center;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        }

        #user-input {
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-lg);
          color: #000;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          resize: none;
          scrollbar-width: none;
          width: 85%;
        }

        /* TODO icon shifts slightly when doing the click sequence */
        .send-button {
          align-items: center;
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          border-radius: var(--ddd-radius-circle);
          box-shadow: 0 4px rgba(0, 3, 33, 0.2);
          cursor: pointer;
          display: flex;
          height: 52px;
          justify-content: center;
          width: 52px;
        }

        .send-button:hover, .send-button:focus-visible {
          box-shadow: 0 6px rgba(0, 3, 33, 0.2);
          transform: translateY(-2px);
        }

        .send-button:active {
          box-shadow: 0 1px rgba(0, 3, 33, 0.2);
          transform: translateY(3px);
        }

        simple-icon-lite {
          color: var(
            --lowContrast-override,
            var(--ddd-theme-bgContrast, white)
          );
        }

        simple-tooltip {
          --simple-tooltip-delay-in: 1000ms;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-input-wrapper">
        <textarea name="prompt-input" id="user-input" placeholder="${ChatAgentModalStore.promptPlaceholder}" @keydown=${this.handleKeyPress}></textarea>
        <div class="send-button" id="send-button" @click=${this.handleSendButton} tabindex="0" aria-label="Send Prompt">
          <simple-icon-lite icon="icons:send"></simple-icon-lite>
        </div>
        <simple-tooltip for="send-button" position="left">Send Prompt to Merlin</simple-tooltip></simple-tooltip>
      </div>
    `;
  }
  
  /**
   * @description - handles key presses
   * @param {event} e - event
   */
  handleKeyPress(e) {
    let textArea = this.shadowRoot.querySelector("#user-input");
    // this.previousMessageIndex = this.messageIndex - 1;
    
    switch (e.key) {
      case "Enter":
        ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Enter key pressed.') : null;
        e.preventDefault();
        this.handleSendButton();
        break;

      case "ArrowUp": // TODO finish this, careful, it's fragile
        ChatAgentModalStore.developerModeEnabled ? console.info(`HAX-DEV-MODE: Arrow Up pressed. Previous message index = ${this.previousMessageIndex} and message index = ${this.messageIndex}`) : null;
        e.preventDefault();
        if (this.previousMessageIndex > 0) {
          while (this.chatLog[this.previousMessageIndex].author !== this.userName) {
            this.previousMessageIndex--;
            if (this.previousMessageIndex === 0) {
              break;
            }
          }
          textArea.value = this.chatLog[this.previousMessageIndex].message;
        }
        break;

      case "ArrowDown":
        ChatAgentModalStore.developerModeEnabled ? console.info(`HAX-DEV-MODE: Arrow Down pressed. Previous message index = ${this.previousMessageIndex} and message index = ${this.messageIndex}`) : null;
        e.preventDefault();
        if (this.previousMessageIndex < this.messageIndex - 1) {
          while (this.chatLog[this.previousMessageIndex].author !== this.userName) {
            this.previousMessageIndex++;
          }
          textArea.value = this.chatLog[this.previousMessageIndex].message;
          this.previousMessageIndex++;
        } else {
          textArea.value = "";
        }
        break;
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

      ChatAgentModalStore.handleMessage(ChatAgentModalStore.userName, INPUTTED_PROMPT);

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