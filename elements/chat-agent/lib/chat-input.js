/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { ChatStore } from "./chat-agent-store.js";
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
    this.darkMode = null;
    this.messageIndex = null;
    this.userIndex = null;
    this.previousMessagesIndex = null;
    this.userName = null;

    autorun(() => {
      this.chatLog = toJS(ChatStore.chatLog);
      this.darkMode = toJS(ChatStore.darkMode);
      this.messageIndex = toJS(ChatStore.messageIndex);
      this.userIndex = toJS(ChatStore.userIndex);
      this.previousMessagesIndex = toJS(this.messageIndex);
      this.userName = toJS(ChatStore.userName);
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
          border-radius: var(--ddd-radius-lg);
        }

        :host([dark-mode]) .chat-input-wrapper {
          background-color: var(--ddd-theme-default-coalyGray);
          color: var(--ddd-theme-default-white);
        }

        #user-input {
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-lg);
          color: var(--ddd-theme-default-coalyGray);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          resize: none;
          scrollbar-width: none;
          width: 85%;
        }

        :host([dark-mode]) #user-input {
          background-color: var(--ddd-theme-default-coalyGray);
          color: var(--ddd-theme-default-white);
        }

        button {
          align-items: center;
          background-color: #2b2a33;
          border-radius: var(--ddd-radius-sm);
          color: var(--ddd-theme-default-white);
          cursor: pointer;
          display: flex;
          gap: var(--ddd-spacing-1);
          justify-content: center;
        }
        
        button:hover, button:focus-visible {
          background-color: #52525e;
        }

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
        <textarea name="prompt-input" id="user-input" placeholder="${ChatStore.promptPlaceholder}" @keydown=${this.handleKeyPress}></textarea>
        <div class="up-down-btns">
          <button id="input-up-btn" @click=${this.handleDirectionButtons}><simple-icon-lite icon="hardware:keyboard-arrow-up"></simple-icon-lite></button>
          <button id="input-down-btn" @click=${this.handleDirectionButtons}><simple-icon-lite icon="hardware:keyboard-arrow-down"></simple-icon-lite></button>
        </div>
        <div class="send-button" id="send-button" @click=${this.handleSendButton} tabindex="0" aria-label="Send Prompt">
          <simple-icon-lite icon="icons:send"></simple-icon-lite>
        </div>
        <simple-tooltip for="send-button" position="left">Send Prompt to Merlin</simple-tooltip>
      </div>
    `;
  }
  
  /**
   * @description - handles key presses in textarea
   * @param {event} e - event
   */
  handleKeyPress(e) {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        this.handleSendButton();
        break;

      case "ArrowUp": // ! don't touch; it's working >:(
        e.preventDefault();
        this.displayPreviousMessages("up");
        break;

      case "ArrowDown": // TODO have Bryan look at this but also work on see if can get working before that
        e.preventDefault();
        this.displayPreviousMessages("down");
        break;
    }
  }

  /**
   * @description - handles direction buttons
   * @param {event} e - event
   */
  handleDirectionButtons(e) {
    const BUTTON_ID = e.currentTarget.id;

    ChatStore.devStatement(`${BUTTON_ID} button pressed.`, 'info');

    switch (BUTTON_ID) {
      case "input-up-btn":
        this.displayPreviousMessages("up");
        break;
      case "input-down-btn":
        this.displayPreviousMessages("down");
        break;
    }
  }

  /**
   * @description handles "send" events, writing entered prompt to chat log
   */
  handleSendButton() {
    const INPUTTED_PROMPT = this.shadowRoot.querySelector("#user-input").value;

    if (ChatStore.promptCharacterLimit > 0 && INPUTTED_PROMPT.length > ChatStore.promptCharacterLimit) { // ensures prompt is within character limit, even if user changes "maxlength" attribute in dev tools
      alert(`Please shorten your prompt to no more than ${ChatStore.promptCharacterLimit} characters.`)
    }

    if (INPUTTED_PROMPT !== "") {
      ChatStore.devStatement(`Send function activated. "${INPUTTED_PROMPT}" sent to Merlin.`, 'info');

      ChatStore.handleMessage(ChatStore.userName, INPUTTED_PROMPT);

      this.shadowRoot.querySelector("#user-input").value = "";

    } else {
      ChatStore.devStatement(`Send button activated. No prompt to send.`, 'warn');
    }
  }

  /**
   * @description changed <textarea> text when using up and down buttons or up and down arrow keys (when focused in textarea) 
   */
  displayPreviousMessages(direction) {
    let textArea = this.shadowRoot.querySelector("#user-input");
    
    switch (direction) {
      case "up":
        if (this.previousMessagesIndex > 1) {
          this.previousMessagesIndex--;
          ChatStore.devStatement(`Arrow Up pressed. Previous message index = ${this.previousMessagesIndex} and message index = ${this.messageIndex}`, 'info');
          
          while (this.chatLog[this.previousMessagesIndex].author !== this.userName 
                  && this.previousMessagesIndex >= 1) {
            this.previousMessagesIndex--;
            if (this.previousMessagesIndex < 1) {
              this.previousMessagesIndex++;
              break; 
            }
          }
  
          textArea.value = this.chatLog[this.previousMessagesIndex].message;
        }
        break;

      case "down":
        if (this.previousMessagesIndex < this.messageIndex) {
          this.previousMessagesIndex++;
          while (this.chatLog[this.previousMessagesIndex].author !== this.userName 
                  && this.previousMessagesIndex < this.messageIndex) {
            this.previousMessagesIndex++;
            if (this.previousMessagesIndex > this.messageIndex) {
              this.previousMessagesIndex = this.messageIndex;
              break;
            }
          }
          if (this.previousMessagesIndex >= this.messageIndex) {
            textArea.value = "";
          } else {
            textArea.value = this.chatLog[this.previousMessagesIndex].message;
          }
        } else {
          textArea.value = "";
        }
        ChatStore.devStatement(`Arrow Down pressed. Previous message index = ${this.previousMessagesIndex} and message index = ${this.messageIndex}`, 'info');
        break;

      default:
        ChatStore.devStatement(`Unknown direction: ${direction}.`, 'error');
    }
  }

  /**
   * @description - LitElement first update / 
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    if (ChatStore.promptCharacterLimit > 0) {
      this.shadowRoot.querySelector("#user-input").setAttribute("maxlength", `${ChatStore.promptCharacterLimit}`);
    }
  }

  static get properties() {
    return {
      ...super.properties,
      darkMode: {
        type: Boolean,
        attribute: "dark-mode",
        reflect: true
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