/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { ChatAgentModalStore } from "../chat-agent.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS, } from "mobx";
import { html, css } from "lit";

class ChatButton extends DDD {

  static get tag() {
    return "chat-button";
  }

  constructor() {
    super();

    this.buttonIcon = null;
    this.isFullView = null;
    this.isInterfaceHidden = null;

    autorun(() => {
      this.buttonIcon = toJS(ChatAgentModalStore.buttonIcon);
      this.isFullView = toJS(ChatAgentModalStore.isFullView);
      this.isInterfaceHidden = toJS(ChatAgentModalStore.isInterfaceHidden);
    })
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
          z-index: 999998;
        }

        .chat-button-wrapper {
          align-items: center;
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          border-color: light-dark(black, white);
          border-radius: var(--ddd-radius-lg);
          border-style: solid;
          border-width: 0.75px;
          box-shadow: 0 4px rgba(0, 3, 33, 0.4);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 96px;
          justify-content: center;
          width: 96px;
        }

        .chat-button-wrapper:hover, .chat-button-wrapper:focus-visible {
          box-shadow: 0 6px rgba(0, 3, 33, 0.4);
          transform: translateY(-2px);
        }

        /* TODO Figure out how to get this to work with enter key */
        .chat-button-wrapper:active {
          box-shadow: 0 1px rgba(0, 3, 33, 0.4);
          transform: translateY(3px);
        }

        :host([is-full-view]:not([is-interface-hidden])) .chat-button-wrapper {
          display: none;
        }

        .chat-button-wrapper:hover .label-wrapper, .chat-button-wrapper:focus-visible .label-wrapper {
          text-decoration: underline;
        }

        .icon-wrapper {
          align-items: center;
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-circle);
          display: flex;
          height: 56px;
          justify-content: center;
          margin-bottom: var(--ddd-spacing-1);
          width: 56px;
        }

        simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-md);
          --simple-icon-width: var(--ddd-icon-md);
          color: var(--data-theme-primary, var(--ddd-primary-13));
        }

        .label-wrapper {
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-xs);
          color: var(--ddd-theme-default-potentialMidnight);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          max-width: var(--ddd-spacing-19);
          overflow: hidden;
          padding: var(--ddd-spacing-1);
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
          
          /* Prevent text highlighting in button */
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-button-wrapper" @click=${this.handleChatButton} @keypress=${this.keyPress} tabindex="0" aria-label="${this.isInterfaceHidden ? 'Open Interface' : 'Close Interface'}">
        <div class="icon-wrapper">
          <simple-icon-lite icon="${ChatAgentModalStore.buttonIcon}"></simple-icon-lite>
        </div>
        <div class="label-wrapper" unselectable="on">
          <slot name="label">${ChatAgentModalStore.buttonLabel}</slot>
        </div>
      </div>
    `;
  }

  /**
   * @description - handles enter key press
   * @param {event} e - enter key press
   */
  keyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      ChatAgentModalStore.devStatement("Chat button pressed using Enter key.", "log");
      this.handleChatButton();
    }
  }

  /**
   * @description - handles button being clicked / pressed, will toggle the interface visibility
   */
  handleChatButton() {
    ChatAgentModalStore.devStatement("Chat button pressed.", "log");

    ChatAgentModalStore.isInterfaceHidden = !this.isInterfaceHidden;
  }

  static get properties() {
    return {
      ...super.properties,
      buttonIcon: {
        type: String,
        attribute: "button-icon",
      },
      buttonLabel: {
        type: String,
        attribute: "button-label",
      },
      
      isFullView: {
        type: Boolean,
        attribute: "is-full-view",
        reflect: true,
      },
      isInterfaceHidden: {
        type: Boolean,
        attribute: "is-interface-hidden",
        reflect: true,
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

globalThis.customElements.define(ChatButton.tag, ChatButton);
export { ChatButton };