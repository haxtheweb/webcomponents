/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "./lib/chat-button.js";
import "./lib/chat-control-bar.js";
import "./lib/chat-developer-panel.js";
import "./lib/chat-input.js";
import "./lib/chat-interface.js";
import "./lib/chat-message.js";
import "./lib/chat-suggestion.js";
import '@haxtheweb/rpg-character/rpg-character.js';
import '@haxtheweb/simple-icon/simple-icon.js';
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";

/**
 * `chat-agent`
 * `chatbot agent style chat widget`
 * @demo demo/index.html
 * @element chat-agent
 */
class ChatAgent extends DDD {
  
  /**
   * Convention we use
   */
  static get tag() {
    return "chat-agent";
  }
  
  /**
   * HTMLElement
   */
  constructor() {
    super();

    // everything
    this.chatLog = [];
    this.engine = "alfred";
    this.isAILoaded = false;
    this.userName = "guest";
    this.userPicture = "";


    // button
    this.buttonIcon = "hax:wizard-hat";
    this.buttonLabel = "Merlin-AI";
    this.isButtonHidden = false; // TODO remove if unused

    // control bar


    // developer mode
    this.developerModeEnabled = true; // ! this will enable developer mode for the entire chat system

    // input
    this.promptCharacterLimit;
    this.promptPlaceholder = "Enter your prompt here...";

    // interface
    this.isFullView = false;
    this.isInterfaceHidden = false;

    // message
    this.merlinIndex = 0; // index of merlin messages
    this.messageIndex = 0; // index of all messages
    this.userIndex = 0; // index of user messages

    this.userTypeWriterSpeed = 1;
    this.merlinTypeWriterSpeed = 30;

    // suggestion


  }

  connectedCallback() {
    super.connectedCallback();

    // code for username and picture possibly found at => elements/haxcms-elements/lib/core/haxcms-editor-builder.js (starting around line 2639)
    
  }

  // TODO @container queries for screen size differences
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          display: block;
        }

        .chat-agent-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          position: fixed;
          bottom: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
          width: 40%; /* Switch to 30% when working with hax environment */
        }

        .agent-interface-wrapper {
          display: flex;
          justify-content: right;
        }

        .agent-button-wrapper {
          display: flex;
          justify-content: right;
        }

        /* TODO does not work, refine and fix */
        @container (max-width: 600px) {
          .chat-agent-wrapper {
            width: 30%;
          }
        }
      `,
    ];
  }

  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="chat-agent-wrapper">
        <div class="agent-interface-wrapper">
          <chat-interface></chat-interface>
        </div>
        <div class="agent-button-wrapper">
          <chat-button>
            <span slot="label">${this.buttonLabel}</span>
          </chat-button>
        </div>
      </div>
    `;
  }
  
  // TODO clean up dev statements
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    // everything
    ChatAgentModalStore.messageIndex++;
    ChatAgentModalStore.merlinIndex++;

    let date = new Date();
    let dateString = date.toString().replace(/\s/g, '-');

    const chatLogObject = {
      messageID: ChatAgentModalStore.messageIndex,
      author: "merlin",
      message: "Hello, I am Merlin. This message is rendered via Array Mapping. How can I help you today?",
      authorMessageIndex: ChatAgentModalStore.merlinIndex,
      timestamp: dateString,
    }

    ChatAgentModalStore.chatLog.push(chatLogObject);

    // button


    // control bar


    // input

    
    // interface


    // message


    // suggestion


    // Other needed logic (might be moved to updated() once I learn how that works)
  }

  // TODO CLEAN UP DEV LOGS HOLY CRAP
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }

    // TODO possibly change due to modal, check with Bryan if for example I can use ChatInterface exported from chat-interface.js instead of querySelector
    const CHAT_INTERFACE = this.shadowRoot.querySelector("chat-interface");
    const CHAT_BUTTON = this.shadowRoot.querySelector("chat-button");
    const SITE_BUILDER = document.querySelector("#site");

    // developer mode


    // everything


    // button
    if (!this.isInterfaceHidden && this.isFullView) {
      this.isButtonHidden = true;
      CHAT_BUTTON.style.display = "none";
    } else {
      this.isButtonHidden = false;
      CHAT_BUTTON.style.display = "block";
    }

    // control bar


    // input


    // interface
    if (this.isInterfaceHidden) {
      this.developerModeEnabled ? console.info("HAX-DEV-MODE: Setting interface to hidden") : null;
      CHAT_INTERFACE.style.display = "none"; // TODO will be changed
    } else {
      this.developerModeEnabled ? console.info("HAX-DEV-MODE: Setting interface to visible") : null;
      CHAT_INTERFACE.style.display = "block";
    }

    if (this.isFullView) {
      SITE_BUILDER.style.width = "75%"; // TODO will be changed
      this.developerModeEnabled ? console.info("HAX-DEV-MODE: Interface loaded into full view") : null;
    } else {
      this.developerModeEnabled ? console.info("HAX-DEV-MODE: Interface loaded into standard view") : null;
      SITE_BUILDER.style.width = "100%";
    }

    // message


    // suggestion


    // Other needed logic
    
    changedProperties.forEach((oldValue, propName) => {
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }

  handleMessages(author, message) {
    let authorIndex;

    ChatAgentModalStore.messageIndex++;
    switch(author) {
      case "merlin":
        ChatAgentModalStore.merlinIndex++;
        authorIndex = ChatAgentModalStore.merlinIndex;
        break;
      case ChatAgentModalStore.userName:
        ChatAgentModalStore.userIndex++;
        authorIndex = ChatAgentModalStore.userIndex;
        break;
    }

    let date = new Date();
    let dateString = date.toString().replace(/\s/g, '-');
    
    const chatLogObject = {
      messageID: ChatAgentModalStore.messageIndex,
      author: author,
      message: message,
      authorMessageIndex: authorIndex,
      timestamp: dateString,
    }

    ChatAgentModalStore.chatLog.push(chatLogObject);
  }

  static get properties() {
    return {
      ...super.properties,
      
      // everything
      chatLog: {
        type: Array,
      },
      engine: {
        type: String,
      },
      isAILoaded: {
        type: Boolean,
        attribute: "ai-open",
      },
      userName: {
        type: String,
        attribute: "username",
      },
      userPicture: {
        type: String,
        attribute: "user-picture",
      },

      // button
      buttonIcon: {
        type: String,
        attribute: "button-icon",
      },
      buttonLabel: {
        type: String,
        attribute: "button-label",
      },
      isButtonHidden: {
        type: Boolean,
        attribute: "hide-button",
      },

      // control bar


      // developer mode
      developerModeEnabled: { // ! this will enable developer mode for the entire chat system
        type: Boolean,
        attribute: "developer-mode",
      }, 

      // input
      promptCharacterLimit: {
        type: Number,
        attribute: "maxlength",
      },
      promptPlaceholder: {
        type: String,
        attribute: "placeholder",
      },

      // interface
      isFullView: {
        type: Boolean,
        attribute: "full-view",
      },
      isInterfaceHidden: {
        type: Boolean,
        attribute: "hide-interface",
      },

      // message
      merlinIndex: {
        type: Number,
        attribute: "merlin-index",
      },
      messageIndex: {
        type: Number,
        attribute: "message-index",
      },
      userIndex: {
        type: Number,
        attribute: "user-index",
      },

      // suggestion
      

    }
  }
}

customElements.define(ChatAgent.tag, ChatAgent);
export { ChatAgent };

// register globally so we can make sure there is only one
window.ChatAgentModal = window.ChatAgentModal || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.ChatAgentModal.requestAvailability = () => {
  if (!window.ChatAgentModal.instance) {
    window.ChatAgentModal.instance = document.createElement("chat-agent");
    document.body.appendChild(window.ChatAgentModal.instance);
  }
  return window.ChatAgentModal.instance;
};

export const ChatAgentModalStore = window.ChatAgentModal.requestAvailability();