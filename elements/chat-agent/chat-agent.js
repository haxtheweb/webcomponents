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
// TODO: synchronize variable names across all components
class ChatAgent extends DDD {
  /**
   * HTMLElement
   */
  constructor() {
    super();

    // everything
    this.engine = "alfred";
    this.isAIOpen = false;

    // button
    this.buttonLabel = "Merlin-AI";
    this.isButtonHidden = false;
    this.buttonIcon = "hax:wizard-hat";

    // control bar


    // developer mode
    this.enableDeveloperMode = false; // ! this will enable developer mode for the entire chat system

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
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="chat-agent-wrapper">
        <div class="agent-interface-wrapper">
          ${this.enableDeveloperMode ? html`
            <chat-interface prompt-placeholder="${this.promptPlaceholder}" developer-panel tabindex="0"></chat-interface>
          ` : html`
            <chat-interface prompt-placeholder="${this.promptPlaceholder}" tabindex="0"></chat-interface>
          `}
        </div>
        <div class="agent-button-wrapper">
          ${this.enableDeveloperMode ? html`
            <chat-button developer-mode tabindex="0" icon="${this.buttonIcon}">
              <span slot="label"><slot name="label">${this.buttonLabel}</slot></span>
            </chat-button>
          ` : html`
            <chat-button tabindex="0" icon="${this.buttonIcon}">
              <span slot="label"><slot name="label">${this.buttonLabel}</slot></span>
            </chat-button>
          `}
        </div>
      </div>
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "chat-agent";
  }

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    const CHAT_INTERFACE = this.shadowRoot.querySelector("chat-interface");
    const CHAT_BUTTON = this.shadowRoot.querySelector("chat-button");
    
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    if (this.enableDeveloperMode) {
      console.info("HAX-DEV-MODE: Developer panel is enabled");
    }
  }

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
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

      // button
      buttonLabel: {
        type: String,
        attribute: "button-label",
      },
      hideButton: {
        type: Boolean,
        attribute: "hide-button",
      },
      buttonIcon: {
        type: String,
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
      hideInterface: {
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
