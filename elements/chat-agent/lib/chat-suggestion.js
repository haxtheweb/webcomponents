/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */


import { ChatStore } from "./chat-agent-store.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS, } from "mobx";
import { html, css } from "lit";

class ChatSuggestion extends DDD {
  
  static get tag() {
    return "chat-suggestion";
  }

  constructor() {
    super();
    
    this.chosenPrompt = false;
    this.disabled = false;
    this.promptType = "";
    this.suggestion = "";

    //! mobx
    this.messageIndex = null;
    this.userIndex = null;

    autorun(() => {
      this.messageIndex = toJS(ChatStore.messageIndex);
      this.userIndex = toJS(ChatStore.userIndex);
    })
  }

  // TODO slim down the suggestions
  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          container-type: inline-size;
          display: block;
        }

        /* TODO fix border color */
        .chat-suggestion-wrapper {
          align-items: center;
          border: var(--ddd-border-sm);
          background-color: var(--ddd-theme-default-successLight);
          border-color: var(--ddd-theme-default-potentialMidnight);
          border-radius: var(--ddd-radius-xl);
          box-shadow: var(--ddd-boxShadow-xl);
          cursor: pointer;
          display: flex;
          flex-direction: row;
          justify-content: center;
          opacity: 1.0;
        }

        .suggestion-icon {
          align-items: center;
          border-right-style: solid;
          border-right: var(--ddd-border-md);
          display: flex;
          justify-content: center;
          width: 20%;
        }

        .circle-wrapper {
          background-color: white;
          border-radius: var(--ddd-radius-circle);
          padding: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-1) var(--ddd-spacing-0);
        }

        simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
        }

        .suggestion-text {
          align-items: center;
          display: flex;
          justify-content: center;
          width: 80%;

          /* Prevent text highlighting in button */
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
        }

        :host([disabled]) .chat-suggestion-wrapper {
          background-color: var(--ddd-theme-default-discoveryCoral);
          cursor: default;
          opacity: 0.6;
        }

        :host([chosen-prompt]) .chat-suggestion-wrapper {
          background-color: var(--ddd-theme-default-futureLime);
        }

        .chat-suggestion-wrapper:hover, .chat-suggestion-wrapper:focus {
          background-color: var(--ddd-theme-default-futureLime);
        }

        .chat-suggestion-wrapper:hover p, .chat-suggestion-wrapper:focus p {
          text-decoration: underline;
        }
        
        :host([disabled]) p {
          text-decoration: none;
        }

        p {
          color: var(--ddd-theme-default-potentialMidnight);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          text-align: center;
          width: 80%;
          margin: 0px;
        }

        @container (max-width: 216px) {
          .suggestion-icon {
            display: none;
          }
        }
      `
    ];
  }

  // TODO fix corner clicking issue
  render() {
    return html`
      <div class="chat-suggestion-wrapper" @click=${this.handleSuggestion} @keypress=${this.handleSuggestion} tabindex="0" aria-label='Send suggestion "${this.suggestion}" to Merlin'>
        <div class="suggestion-icon">
          <div class="circle-wrapper">
            <simple-icon-lite></simple-icon-lite>
          </div>  
        </div>
        <div class="suggestion-text">
          <p class="chat-suggestion">
            ${this.suggestion}
          </p>  
        </div>
      </div>
    `;
  }

  /**
   * @description Event handler for the suggestion button
  */
 handleSuggestion() {
   if (!this.disabled) {
     ChatStore.devStatement(`Suggestion button pressed. Suggested prompt to send to Merlin: ${this.suggestion}`, 'info');
     
     ChatStore.handleMessage(ChatStore.userName, this.suggestion);
    } else {
      ChatStore.devStatement('Suggestion buttons disabled, ignoring request', 'warn');
    }
  }

  /**
   * @description LitElement first update / sets suggestion icon
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    let simpleIcon = this.shadowRoot.querySelector("simple-icon-lite");
    switch (this.promptType) {
      case "suggestion":
        simpleIcon.setAttribute("icon", "question-answer");
        simpleIcon.style.color = "var(--data-theme-primary, var(--ddd-primary-13))";
        break;
      case "network":
        simpleIcon.setAttribute("icon", "device:signal-cellular-connected-no-internet-0-bar");
        simpleIcon.style.color = "var(--ddd-theme-default-coalyGray)";
        break;
      case "help":
        simpleIcon.setAttribute("icon", "help-outline");
        simpleIcon.style.color = "var(--ddd-theme-default-original87Pink)";
        break;
      case "hax":
        simpleIcon.setAttribute("icon", "hax:hax2022");
        simpleIcon.style.color = "var(--data-theme-primary, var(--ddd-primary-13))";
        break;
      default:
        simpleIcon.setAttribute("icon", "lrn:info");
        simpleIcon.style.color = "var(--ddd-theme-default-skyBlue)";
        break;
    }
  }
  
  /**
   * @description LitElement updated / sets disabled state
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }

    if (this.disabled) {
      this.shadowRoot.querySelector(".chat-suggestion-wrapper").removeAttribute("tabindex");
    }
  }

  static get properties() {
    return {
      ...super.properties,
      chosenPrompt: {
        type: Boolean,
        attribute: "chosen-prompt",
      },
      disabled: { type: Boolean },
      promptType: { 
        type: String, 
        attribute: "prompt-type" 
      },
      suggestion: { type: String },
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

globalThis.customElements.define(ChatSuggestion.tag, ChatSuggestion);
export { ChatSuggestion };