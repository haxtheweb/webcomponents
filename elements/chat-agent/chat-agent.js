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
    // TODO this either stays an array, or find an away to intialize this variable as the JSON I want it to be
    // this.chatLog = [];
    this.engine = "alfred";
    this.isAIOpen = false;
    this.userName = "guest"; // TODO needs to grab username somehow or default to "guest"

    // button
    this.buttonIcon = "hax:wizard-hat";
    this.buttonLabel = "Merlin-AI";
    this.isButtonHidden = false;

    // control bar


    // developer mode
    this.enableDeveloperMode = true; // ! this will enable developer mode for the entire chat system

    // input
    this.promptPlaceholder = "Enter your prompt here...";

    // interface
    this.isFullView = false;
    this.isInterfaceHidden = false;

    // message


    // suggestion      
  }

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
          width: 40%;
        }

        .agent-interface-wrapper {
          display: flex;
          justify-content: right;
        }

        .agent-button-wrapper {
          display: flex;
          justify-content: right;
        }
      `,
    ];
  }

  // TODO user-name needs to filter down to chat-message.js and chat-developer-panel.js
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="chat-agent-wrapper">
        <div class="agent-interface-wrapper">
          <chat-interface prompt-placeholder="${this.promptPlaceholder}" tabindex="0"></chat-interface>
        </div>
        <div class="agent-button-wrapper">
          <chat-button tabindex="0" icon="${this.buttonIcon}">
            <span slot="label"><slot name="label">${this.buttonLabel}</slot></span>
          </chat-button>
        </div>
      </div>
    `;
  }
  

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    const CHAT_INTERFACE = this.shadowRoot.querySelector("chat-interface");
    const CHAT_BUTTON = this.shadowRoot.querySelector("chat-button");

    // developer mode
    if (this.enableDeveloperMode) {
      console.info("HAX-DEV-MODE: Developer mode is enabled");

      CHAT_INTERFACE.setAttribute("developer-mode", "");
      CHAT_BUTTON.setAttribute("developer-mode", "");
    }

    // everything
    if (this.isAIOpen) {

    }

    // button
    if (this.isFullView && !this.isInterfaceHidden) {
      this.isButtonHidden = true;
      this.enableDeveloperMode ? console.info("HAX-DEV-MODE: Button is hidden") : null;
    } else {
      this.isButtonHidden = false;
      this.enableDeveloperMode ? console.info("HAX-DEV-MODE: Button is visible") : null;
    }

    if (this.isButtonHidden) {
      this.enableDeveloperMode ? console.info("HAX-DEV-MODE: Setting button to hidden") : null;
      CHAT_BUTTON.setAttribute("hidden", "");
    } // TODO this might be moved down to `updated(changedProperties)`

    // control bar


    // input

    
    // interface
    if (this.isFullView) {
      CHAT_INTERFACE.setAttribute("full-view", "");
      this.enableDeveloperMode ? console.info("HAX-DEV-MODE: Interface loaded into full view") : null;
    } else {
      this.enableDeveloperMode ? console.info("HAX-DEV-MODE: Interface loaded into standard view") : null;
    }

    // message


    // suggestion


    // Other needed logic (might be moved to updated() once I learn how that works)
  }

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }

    const CHAT_INTERFACE = this.shadowRoot.querySelector("chat-interface");
    const CHAT_BUTTON = this.shadowRoot.querySelector("chat-button");

    // developer mode


    // everything


    // button


    // control bar


    // input


    // interface


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

  static get properties() {
    return {
      ...super.properties,
      
      // everything
      engine: {
        type: String,
      },
      isAIOpen: {
        type: Boolean,
        attribute: "ai-open",
      },
      userName: {
        type: String,
        attribute: "user-name",
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
      enableDeveloperMode: { // ! this will enable developer mode for the entire chat system
        type: Boolean,
        attribute: "developer-mode",
      }, 

      // input
      promptPlaceholder: {
        type: String,
        attribute: "prompt-placeholder",
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


      // suggestion
      

    }
  }
}

customElements.define(ChatAgent.tag, ChatAgent);
export { ChatAgent };